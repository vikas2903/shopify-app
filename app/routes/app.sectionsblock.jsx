/**
 * Sections Block Page
 * - Theme selector
 * - Dashboard-style block library
 * - Upload button uploads section file to selected theme
 * - On success, opens Shopify theme editor automatically
 */

import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  TextField,
  Select,
  Button,
  Banner,
  Box,
  InlineGrid,
  InlineStack,
  Badge,
  Divider,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECTIONS_LIST = [
  {
    id: "shopable-video",
    sectionName: "shopable-video",
    title: "Shopable Video",
    description:
      "Install a product-linked shopable video section with 5 cards in one row on desktop and a mobile-friendly 2-column layout.",
    image:
      "https://cdn.shopify.com/s/files/1/0796/7847/2226/files/announcement-bar-removebg-preview.png?v=1754628891",
    highlights: ["5-up desktop", "2-column mobile", "Product-handle driven"],
  },
];

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    if (!session) {
      throw new Error("No session. Please authenticate first.");
    }

    const shopFull = session.shop;
    const accessToken = session.accessToken;
    const scopeRaw = session.scope;
    const scopeStr = Array.isArray(scopeRaw) ? (scopeRaw || []).join(",") : (scopeRaw || "");
    const hasReadThemes = scopeStr.includes("read_themes");

    let previewId = null;
    try {
      const parsed = new URL(request.url);
      previewId = parsed.searchParams.get("preview_theme_id");
    } catch (e) {
      console.warn("[sectionsblock] Failed to parse request URL for preview_theme_id", e);
    }

    if (!shopFull || !accessToken) {
      throw new Error("Missing shop or access token.");
    }

    if (!hasReadThemes) {
      const initialThemes = previewId
        ? [{ id: previewId, name: `Preview theme (${previewId})`, role: "PREVIEW" }]
        : [];

      return json({
        themes: initialThemes,
        shop: shopFull,
        sections: SECTIONS_LIST,
        error: null,
        hasReadThemes: false,
      });
    }

    const response = await fetch(`https://${shopFull}/admin/api/2024-01/themes.json`, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[sectionsblock] Themes API error:", response.status, errText);
      throw new Error(`Themes API failed: ${response.status}`);
    }

    const data = await response.json();
    let themes = (data.themes || []).map((t) => ({
      id: String(t.id),
      name: t.name,
      role: (t.role || "").toUpperCase(),
    }));

    if (previewId && !themes.find((t) => t.id === previewId)) {
      themes.unshift({
        id: previewId,
        name: `Preview theme (${previewId})`,
        role: "PREVIEW",
      });
    }

    return json({
      themes,
      shop: shopFull,
      sections: SECTIONS_LIST,
      error: null,
      hasReadThemes: true,
    });
  } catch (err) {
    console.error("[sectionsblock] Loader error:", err);
    return json(
      {
        themes: [],
        shop: null,
        sections: SECTIONS_LIST,
        error: { message: err.message || "Loader failed" },
        hasReadThemes: false,
      },
      { status: 500 }
    );
  }
};

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { session } = await authenticate.admin(request);
    if (!session) {
      return json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const scopeRaw = session.scope;
    const scopeStr = Array.isArray(scopeRaw) ? (scopeRaw || []).join(",") : (scopeRaw || "");
    if (!scopeStr.includes("write_themes")) {
      return json(
        {
          success: false,
          error: "App needs write_themes scope. Reinstall the app or clear session and log in again.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const themeId = formData.get("themeId");
    const sectionName = formData.get("sectionName");

    if (!themeId || !sectionName) {
      return json({ success: false, error: "Missing themeId or sectionName" }, { status: 400 });
    }

    const sectionPath = path.join(__dirname, "..", "section", `${sectionName}.liquid`);
    if (!existsSync(sectionPath)) {
      return json(
        { success: false, error: `Section file not found: ${sectionName}.liquid` },
        { status: 404 }
      );
    }

    const liquidContent = readFileSync(sectionPath, "utf8");
    const shopFull = session.shop;
    const accessToken = session.accessToken;
    const assetKey = `sections/${sectionName}.liquid`;

    const putResponse = await fetch(
      `https://${shopFull}/admin/api/2024-01/themes/${themeId}/assets.json`,
      {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: { key: assetKey, value: liquidContent },
        }),
      }
    );

    const putData = await putResponse.json();
    if (!putResponse.ok) {
      let errorMessage = "Upload failed";
      if (putData && putData.errors) {
        if (typeof putData.errors === "string") errorMessage = putData.errors;
        else if (Array.isArray(putData.errors)) errorMessage = putData.errors.join(", ");
        else errorMessage = JSON.stringify(putData.errors);
      }

      if (/API Access has been disabled/.test(errorMessage)) {
        errorMessage =
          "Shop API access is disabled - the store may be frozen or expired. Check the store status and reinstall the app if needed.";
      }

      return json({ success: false, error: errorMessage }, { status: putResponse.status });
    }

    return json({ success: true, assetKey, sectionName });
  } catch (err) {
    console.error("[sectionsblock] Action error:", err);
    return json(
      { success: false, error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
};

export default function SectionsBlockPage() {
  const { themes, shop, sections, error: loadError, hasReadThemes } = useLoaderData();
  const fetcher = useFetcher();
  const [manualThemeId, setManualThemeId] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(() => (themes?.length ? themes[0].id : ""));
  const [pendingSectionName, setPendingSectionName] = useState("");
  const [openedAssetKey, setOpenedAssetKey] = useState("");

  const themeOptions = (themes || []).map((t) => {
    let label = t.name;
    if (t.role === "MAIN") label += " (live)";
    else if (t.role === "PREVIEW" || t.role === "DEVELOPMENT") label += " (preview)";
    else if (t.role === "UNPUBLISHED") label += " (draft)";
    return { label, value: t.id };
  });

  const handleThemeChange = useCallback((value) => {
    setSelectedThemeId(value);
  }, []);

  const handleManualThemeChange = useCallback((value) => {
    setManualThemeId(value);
    setSelectedThemeId(value);
  }, []);

  const openThemeEditor = useCallback(() => {
    if (!selectedThemeId || !shop) return;
    window.open(
      `https://${shop}/admin/themes/${selectedThemeId}/editor?context=sections&template=index`,
      "_blank"
    );
  }, [selectedThemeId, shop]);

  const handleUpload = useCallback(
    (sectionName) => {
      if (!selectedThemeId) return;
      setPendingSectionName(sectionName);
      const formData = new FormData();
      formData.append("themeId", selectedThemeId);
      formData.append("sectionName", sectionName);
      fetcher.submit(formData, { method: "POST" });
    },
    [selectedThemeId, fetcher]
  );

  const uploadResult = fetcher.data;
  const isUploading = fetcher.state === "submitting" || fetcher.state === "loading";

  useEffect(() => {
    if (!uploadResult?.success || !uploadResult?.assetKey) return;
    if (openedAssetKey === uploadResult.assetKey) return;
    setOpenedAssetKey(uploadResult.assetKey);
    openThemeEditor();
  }, [uploadResult, openedAssetKey, openThemeEditor]);

  if (loadError) {
    return (
      <Page title="Sections" fullWidth>
        <TitleBar title="Sections" />
        <Banner tone="critical" title="Error">
          {loadError.message}
        </Banner>
      </Page>
    );
  }

  return (
    <Page title="Sections" fullWidth>
      <TitleBar title="Sections" />
      <BlockStack gap="400">
        <Layout>
          <Layout.Section>
            <Box background="bg-fill-brand-secondary" borderRadius="300" padding="600">
              <InlineGrid columns={{ xs: 1, md: 2 }} gap="500">
                <BlockStack gap="300">
                  <InlineStack gap="200" wrap>
                    <Badge tone="info">App dashboard</Badge>
                    <Badge tone="success">One-click install flow</Badge>
                  </InlineStack>
                  <Text as="h1" variant="heading2xl">
                    Install blocks and jump straight into customization
                  </Text>
                  <Text as="p" variant="bodyLg" tone="subdued">
                    Choose a theme, click a block card, and the app will upload the section file and open Shopify customization so you can place it right away.
                  </Text>
                  <InlineStack gap="300" wrap>
                    <Box background="bg-surface" borderRadius="200" padding="300">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" tone="subdued">Blocks ready</Text>
                        <Text as="p" variant="headingLg">{sections.length}</Text>
                      </BlockStack>
                    </Box>
                    <Box background="bg-surface" borderRadius="200" padding="300">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" tone="subdued">Theme status</Text>
                        <Text as="p" variant="headingLg">{selectedThemeId ? "Connected" : "Select theme"}</Text>
                      </BlockStack>
                    </Box>
                  </InlineStack>
                </BlockStack>

                <Box background="bg-surface" borderRadius="300" padding="400">
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingMd">
                      Quick steps
                    </Text>
                    <Text as="p" variant="bodyMd">1. Pick the Shopify theme you want to edit.</Text>
                    <Text as="p" variant="bodyMd">2. Click `Add to theme and customize`.</Text>
                    <Text as="p" variant="bodyMd">3. In the theme editor, use `Add section` and configure the uploaded block.</Text>
                  </BlockStack>
                </Box>
              </InlineGrid>
            </Box>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Theme setup
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  This is the theme where the app will upload your section files.
                </Text>
                <Select
                  label="Theme"
                  options={[{ label: "Select a theme", value: "" }, ...themeOptions]}
                  value={selectedThemeId}
                  onChange={handleThemeChange}
                />

                {!hasReadThemes && (
                  <>
                    <Banner tone="warning">
                      The app cannot list themes without `read_themes`. Paste a theme ID manually if needed.
                    </Banner>
                    <TextField
                      label="Theme ID"
                      value={manualThemeId}
                      onChange={handleManualThemeChange}
                      autoComplete="off"
                    />
                  </>
                )}

                <InlineStack gap="200" wrap>
                  <Badge tone={selectedThemeId ? "success" : "attention"}>
                    {selectedThemeId ? "Theme selected" : "Theme required"}
                  </Badge>
                  <Button onClick={openThemeEditor} disabled={!selectedThemeId || !shop}>
                    Open customizer
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Block library
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Install a block into your selected theme and jump into the Shopify editor from the same screen.
                </Text>
                <Divider />

                {uploadResult?.success && (
                  <Banner tone="success">
                    {uploadResult.sectionName || pendingSectionName} uploaded successfully. The theme editor has been opened for customization.
                  </Banner>
                )}
                {uploadResult && !uploadResult.success && (
                  <Banner tone="critical">
                    Upload failed: {uploadResult.error}
                  </Banner>
                )}

                <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
                  {(sections || []).map((section) => (
                    <Box
                      key={section.id}
                      background="bg-surface-secondary"
                      borderRadius="300"
                      padding="300"
                    >
                      <BlockStack gap="300">
                        <Box background="bg-surface" borderRadius="200" overflowX="hidden">
                          <img
                            src={section.image}
                            alt={section.title}
                            style={{
                              width: "100%",
                              height: 220,
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </Box>

                        <InlineStack align="space-between" blockAlign="start" gap="200">
                          <BlockStack gap="100">
                            <Text as="h3" variant="headingLg">
                              {section.title}
                            </Text>
                            <Text as="p" variant="bodyMd" tone="subdued">
                              {section.description}
                            </Text>
                          </BlockStack>
                          <Badge tone="info">Section</Badge>
                        </InlineStack>

                        <InlineStack gap="200" wrap>
                          {(section.highlights || []).map((item) => (
                            <Badge key={item}>{item}</Badge>
                          ))}
                        </InlineStack>

                        <InlineStack gap="300" wrap>
                          <Button
                            variant="primary"
                            onClick={() => handleUpload(section.sectionName)}
                            loading={isUploading && pendingSectionName === section.sectionName}
                            disabled={!selectedThemeId || isUploading}
                          >
                            Add to theme and customize
                          </Button>
                          <Button onClick={openThemeEditor} disabled={!selectedThemeId || !shop}>
                            Open customizer
                          </Button>
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  ))}
                </InlineGrid>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
