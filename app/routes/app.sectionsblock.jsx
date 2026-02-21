/**
 * Sections Block Page
 * - Theme ID selector at top
 * - Grid of section cards (Shopable Video from app/section/shopable-video.liquid)
 * - Upload button uploads section file to selected theme via Theme API
 */

import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Select,
  Button,
  Banner,
  Box,
  InlineGrid,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Section definitions: map sectionKey to local file path under app/section
const SECTIONS_LIST = [
  {
    id: "shopable-video",
    sectionName: "shopable-video",
    title: "Shopable Video",
    description: "Add a shopable video carousel section to your store.",
    image:
      "https://cdn.shopify.com/s/files/1/0796/7847/2226/files/announcement-bar-removebg-preview.png?v=1754628891",
  },
];

/**
 * Loader: fetch themes and shop for the session
 */
export const loader = async ({ request }) => {
  try {
    console.log("[sectionsblock] Loader started");
    const { session } = await authenticate.admin(request);
    if (!session) {
      console.log("[sectionsblock] No session");
      throw new Error("No session. Please authenticate first.");
    }

    const shopFull = session.shop;
    const accessToken = session.accessToken;
    // Scope can be string "read_themes,write_themes" or array ["read_themes", "write_themes"]
    const scopeRaw = session.scope;
    const scopeStr = Array.isArray(scopeRaw) ? (scopeRaw || []).join(",") : (scopeRaw || "");
    const hasReadThemes = scopeStr.includes("read_themes");

    console.log("[sectionsblock] Shop:", shopFull, "| scope type:", typeof scopeRaw, "| Has read_themes:", hasReadThemes);

    if (!shopFull || !accessToken) {
      throw new Error("Missing shop or access token.");
    }
    if (!hasReadThemes) {
      throw new Error(
        "App needs read_themes scope. Reinstall the app from Shopify Admin (Apps → your app → … → Reinstall) or clear session and log in again to grant theme access."
      );
    }

    // Fetch themes from Shopify Admin API
    const apiUrl = `https://${shopFull}/admin/api/2024-01/themes.json`;
    console.log("[sectionsblock] Fetching themes:", apiUrl);
    const response = await fetch(apiUrl, {
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
    const themes = (data.themes || []).map((t) => ({
      id: String(t.id),
      name: t.name,
      role: (t.role || "").toUpperCase(),
    }));
    console.log("[sectionsblock] Themes loaded:", themes.length);

    return json({
      themes,
      shop: shopFull,
      sections: SECTIONS_LIST,
      error: null,
    });
  } catch (err) {
    console.error("[sectionsblock] Loader error:", err);
    return json(
      {
        themes: [],
        shop: null,
        sections: SECTIONS_LIST,
        error: { message: err.message || "Loader failed" },
      },
      { status: 500 }
    );
  }
};

/**
 * Action: upload section file to theme (write_themes)
 * Body: themeId, sectionName (e.g. "shopable-video")
 */
export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    console.log("[sectionsblock] Action: upload section");
    const { session } = await authenticate.admin(request);
    if (!session) {
      console.log("[sectionsblock] Action: no session");
      return json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const scopeRaw = session.scope;
    const scopeStr = Array.isArray(scopeRaw) ? (scopeRaw || []).join(",") : (scopeRaw || "");
    if (!scopeStr.includes("write_themes")) {
      console.log("[sectionsblock] Action: missing write_themes. scope:", scopeStr);
      return json({ success: false, error: "App needs write_themes scope. Reinstall the app or clear session and log in again." }, { status: 403 });
    }

    const formData = await request.formData();
    const themeId = 181499592738;
    const sectionName = formData.get("sectionName");
    if (!themeId || !sectionName) {
      console.log("[sectionsblock] Action: missing themeId or sectionName");
      return json({ success: false, error: "Missing themeId or sectionName" }, { status: 400 });
    }

    // Resolve path to section file: app/section/<sectionName>.liquid
    const sectionPath = path.join(__dirname, "..", "section", `${sectionName}.liquid`);
    console.log("[sectionsblock] Section file path:", sectionPath);

    if (!existsSync(sectionPath)) {
      console.error("[sectionsblock] File not found:", sectionPath);
      return json({ success: false, error: `Section file not found: ${sectionName}.liquid` }, { status: 404 });
    }

    const liquidContent = readFileSync(sectionPath, "utf8");
    console.log("[sectionsblock] Read file, length:", liquidContent.length);

    const shopFull = session.shop;
    const accessToken = session.accessToken;
    const assetKey = `sections/${sectionName}.liquid`;
    const putUrl = `https://${shopFull}/admin/api/2024-01/themes/${themeId}/assets.json`;
    console.log("[sectionsblock] PUT asset:", putUrl, "key:", assetKey);

    const putResponse = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: { key: assetKey, value: liquidContent },
      }),
    });

    const putData = await putResponse.json();
    if (!putResponse.ok) {
      console.error("[sectionsblock] Theme API PUT error:", putResponse.status, putData);
      return json(
        { success: false, error: putData.errors ? JSON.stringify(putData.errors) : "Upload failed" },
        { status: putResponse.status }
      );
    }

    console.log("[sectionsblock] Upload success for", assetKey);
    return json({ success: true, assetKey });
  } catch (err) {
    console.error("[sectionsblock] Action error:", err);
    return json(
      { success: false, error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
};

export default function SectionsBlockPage() {
  const { themes, shop, sections, error: loadError } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedThemeId, setSelectedThemeId] = useState(themes?.length ? themes[0].id : "");

  const themeOptions = (themes || []).map((t) => ({
    label: `${t.name}${t.role === "MAIN" ? " 🟢" : ""}`,
    value: t.id,
  }));

  const handleThemeChange = useCallback((value) => {
    setSelectedThemeId(value);
    console.log("[sectionsblock] Theme selected:", value);
  }, []);

  const handleUpload = useCallback(
    (sectionName) => {
      if (!selectedThemeId) {
        console.log("[sectionsblock] Upload skipped: no theme selected");
        return;
      }
      const formData = new FormData();
      formData.append("themeId", selectedThemeId);
      formData.append("sectionName", sectionName);
      fetcher.submit(formData, { method: "POST" });
      console.log("[sectionsblock] Upload submitted:", sectionName, "theme:", selectedThemeId);
    },
    [selectedThemeId, fetcher]
  );

  const uploadResult = fetcher.data;
  const isUploading = fetcher.state === "submitting" || fetcher.state === "loading";

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
        {/* Theme selector at top */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Select theme
                </Text>
                <Select
                  label="Theme"
                  labelInline
                  options={[
                    { label: "Select a theme", value: "" },
                    ...themeOptions,
                  ]}
                  value={selectedThemeId}
                  onChange={handleThemeChange}
                />
                {selectedThemeId && (
                  <Text as="p" variant="bodySm" tone="subdued">
                    Section files will be uploaded to this theme. You have write_themes permission.
                  </Text>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Upload result banner */}
        {uploadResult?.success && (
          <Banner tone="success" onDismiss={() => {}}>
            Section uploaded to theme. File: {uploadResult.assetKey}. Add it in Theme Editor → Add section.
          </Banner>
        )}
        {uploadResult && !uploadResult.success && (
          <Banner tone="critical" onDismiss={() => {}}>
            Upload failed: {uploadResult.error}
          </Banner>
        )}

        {/* Grid of section cards */}
        <Text as="h2" variant="headingMd">
          Section blocks
        </Text>
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="400">
          {(sections || []).map((section) => (
            <Card key={section.id}>
              <BlockStack gap="300">
                <Box
                  background="bg-surface-secondary"
                  borderRadius="200"
                  minHeight="120px"
                  padding="300"
                >
                  <img
                    src={section.image}
                    alt={section.title}
                    style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }}
                  />
                </Box>
                <Text as="h3" variant="headingSm">
                  {section.title}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  {section.description}
                </Text>
                <Button
                  variant="primary"
                  onClick={() => handleUpload(section.sectionName)}
                  loading={isUploading}
                  disabled={!selectedThemeId || isUploading}
                >
                  Upload to theme
                </Button>
                {selectedThemeId && shop && (
                  <Button
                    url={`https://${shop}/admin/themes/${selectedThemeId}/editor?context=sections&template=index`}
                    target="_blank"
                  >
                    Open theme editor
                  </Button>
                )}
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
