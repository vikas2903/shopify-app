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
  TextField,
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

    // parse the request URL once to avoid redeclaration and for use in both
    // the no-scope and has-scope branches
    let previewId = null;
    try {
      const parsed = new URL(request.url);
      previewId = parsed.searchParams.get("preview_theme_id");
    } catch (e) {
      // swallow; request.url should be valid, but be defensive
      console.warn("[sectionsblock] Failed to parse request URL for preview_theme_id", e);
    }

    console.log("[sectionsblock] Shop:", shopFull, "| scope type:", typeof scopeRaw, "| Has read_themes:", hasReadThemes, "| previewId:", previewId);

    if (!shopFull || !accessToken) {
      throw new Error("Missing shop or access token.");
    }

    if (!hasReadThemes) {
      console.warn("[sectionsblock] No read_themes scope; skipping theme fetch.");
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

    // Fetch themes from Shopify Admin API (only when read_themes is available)
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
    console.log("[sectionsblock] Themes API response received. Theme count:", (data.themes || []).length);

    // Map the API result into our shape. The Admin API returns published, unpublished
    // and development (preview) themes whenever the access token has the
    // `read_themes` permission. If the token lacks the scope we never hit this
    // branch and themes will be empty.
    let themes = (data.themes || []).map((t) => ({
      id: String(t.id),
      name: t.name,
      role: (t.role || "").toUpperCase(),
    }));

    // if we previously parsed a previewId, add it now if it wasn’t returned
    // by the API.  (It may already be present when the token has read_themes.)
    if (previewId && !themes.find((t) => t.id === previewId)) {
      themes.unshift({
        id: previewId,
        name: `Preview theme (${previewId})`,
        role: "PREVIEW",
      });
      console.log("[sectionsblock] Added preview_theme_id to themes:", previewId);
    }

    console.log("[sectionsblock] Themes loaded:", themes.length);

    return json({
      themes,
      shop: shopFull,
      sections: SECTIONS_LIST,
      error: null,
      hasReadThemes: true,
    });
  } catch (err) {
    console.error("[sectionsblock] Loader error:", err);
    console.error("[sectionsblock] Loader error (returning fallback):", err);
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
    const themeId = formData.get("themeId");
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

      // Shopify sometimes returns a generic 403 with the message
      // "[API] API Access has been disabled" when the shop is frozen or the
      // API credentials are no longer valid.  This is not something the
      // app code can fix; instruct the user accordingly.
      let errorMessage = "Upload failed";
      if (putData && putData.errors) {
        // errors may be an object or string
        if (typeof putData.errors === "string") {
          errorMessage = putData.errors;
        } else if (Array.isArray(putData.errors)) {
          errorMessage = putData.errors.join(", ");
        } else {
          errorMessage = JSON.stringify(putData.errors);
        }
      }

      if (/API Access has been disabled/.test(errorMessage)) {
        errorMessage =
          "Shop API access is disabled – the store may be frozen or expired. " +
          "Check the shop’s status in the Shopify admin and reinstall the app if necessary.";
      }

      return json({ success: false, error: errorMessage }, { status: putResponse.status });
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
  const { themes, shop, sections, error: loadError, hasReadThemes } = useLoaderData();
  const fetcher = useFetcher();
  const [manualThemeId, setManualThemeId] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(() => (themes?.length ? themes[0].id : ""));

  const themeOptions = (themes || []).map((t) => {
    // highlight the currently published theme, and give a note for any
    // preview/development entries
    let label = t.name;
    if (t.role === "MAIN") label += " 🟢";
    else if (t.role === "PREVIEW" || t.role === "DEVELOPMENT") label += " (preview)";
    else if (t.role === "UNPUBLISHED") label += " (unpublished)";
    return { label, value: t.id };
  });

  const handleThemeChange = useCallback((value) => {
    setSelectedThemeId(value);
    console.log("[sectionsblock] Theme selected:", value);
  }, []);

  const handleManualThemeChange = useCallback((value) => {
    setManualThemeId(value);
    setSelectedThemeId(value);
    console.log("[sectionsblock] Manual theme id set:", value);
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

                {!hasReadThemes && (
                  <>
                    <Banner tone="warning">
                      App does not have `read_themes` permission. Without that scope the
                      Admin API can’t list any themes (including unpublished or preview
                      themes), so you’ll need to supply the ID manually.  A preview
                      theme ID often shows up in storefront URLs as
                      <code>?preview_theme_id=&lt;id&gt;</code>.
                    </Banner>
                    <TextField
                      label="Theme ID"
                      value={manualThemeId}
                      onChange={handleManualThemeChange}
                      autoComplete="off"
                    />
                  </>
                )}

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
