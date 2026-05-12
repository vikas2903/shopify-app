import { json } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Banner,
  Select,
  TextField,
  Badge,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uiBlocks = [
  {
    id: "announcement-bar",
    title: "Announcement Bar",
    image: "/Annoucement_bar.png",
    tagline: "Promotions and key store messages",
    filename: "timmerwithoffersmarquee.liquid",
    assetKey: "blocks/timmerwithoffersmarquee.liquid",
  },
  {
    id: "categorised-search",
    title: "Categorised Search",
    image: "/Categorised_search.png",
    tagline: "Smarter product discovery",
    filename: "advacned-search.liquid",
    assetKey: "blocks/advacned-search.liquid",
  },
  {
    id: "products-tabber",
    title: "Products Tabber",
    image: "/products-tabber.png",
    tagline: "Organized product browsing",
    filename: "product-tabber.liquid",
    assetKey: "blocks/product-tabber.liquid",
  },
  {
    id: "shop-buy-category",
    title: "Shop by Category",
    image: "/shop-buy-category.png",
    tagline: "Visual category navigation",
    filename: "shop-buy-category.liquid",
    assetKey: "blocks/shop-buy-category.liquid",
  },
  {
    id: "shopable-video",
    title: "Shopable Video",
    image: "/shopable-video.png",
    tagline: "Video-driven product discovery",
    filename: "shopablevideo.liquid",
    assetKey: "blocks/shopablevideo.liquid",
  },
  {
    id: "usp-icons",
    title: "USP Icons",
    image: "/usp-icons.png",
    tagline: "Highlight trust and benefits",
    filename: "usp-section.liquid",
    assetKey: "blocks/usp-section.liquid",
  },
];

const chooseBestTheme = (themes) => {
  if (!Array.isArray(themes) || themes.length === 0) return null;
  const mainTheme = themes.find((theme) => theme.role === "MAIN");
  return mainTheme || themes[0];
};

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session?.shop;
  const accessToken = session?.accessToken;
  const scopeRaw = session?.scope;
  const scopeStr = Array.isArray(scopeRaw) ? (scopeRaw || []).join(",") : (scopeRaw || "");

  const themes = [];
  let selectedThemeId = "";

  if (shop && accessToken && scopeStr.includes("read_themes")) {
    try {
      const response = await fetch(`https://${shop}/admin/api/2024-01/themes.json`, {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const mappedThemes = (data.themes || []).map((theme) => ({
          id: String(theme.id),
          name: theme.name,
          role: (theme.role || "").toUpperCase(),
        }));

        const bestTheme = chooseBestTheme(mappedThemes);
        selectedThemeId = bestTheme?.id || "";

        return json({
          themes: mappedThemes,
          selectedThemeId,
          shop,
          hasReadThemes: true,
        });
      }
    } catch (error) {
      console.error("[app._index] Theme fetch failed:", error);
    }
  }

  return json({ themes, selectedThemeId, shop, hasReadThemes: false });
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
        { success: false, error: "App needs write_themes permission to insert blocks into a theme." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const themeId = formData.get("themeId");
    const blockId = formData.get("blockId");

    if (!themeId || !blockId) {
      return json({ success: false, error: "Missing theme ID or block ID." }, { status: 400 });
    }

    const block = uiBlocks.find((item) => item.id === blockId);
    if (!block) {
      return json({ success: false, error: "Unknown block selected." }, { status: 400 });
    }

    const sourcePath = path.join(
      __dirname,
      "..",
      "..",
      "extensions",
      "offers-text",
      "blocks",
      block.filename
    );

    if (!existsSync(sourcePath)) {
      return json(
        { success: false, error: `Block file not found: ${block.filename}` },
        { status: 404 }
      );
    }

    const liquidContent = readFileSync(sourcePath, "utf8");
    const putResponse = await fetch(
      `https://${session.shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
      {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: {
            key: block.assetKey,
            value: liquidContent,
          },
        }),
      }
    );

    const putData = await putResponse.json();
    if (!putResponse.ok) {
      let errorMessage = "Insert failed";
      if (putData?.errors) {
        if (typeof putData.errors === "string") errorMessage = putData.errors;
        else if (Array.isArray(putData.errors)) errorMessage = putData.errors.join(", ");
        else errorMessage = JSON.stringify(putData.errors);
      }

      return json({ success: false, error: errorMessage }, { status: putResponse.status });
    }

    return json({
      success: true,
      blockId,
      blockTitle: block.title,
      assetKey: block.assetKey,
    });
  } catch (error) {
    console.error("[app._index] Insert block failed:", error);
    return json({ success: false, error: error.message || "Insert failed" }, { status: 500 });
  }
};

export default function Index() {
  const { themes, selectedThemeId: initialThemeId, shop, hasReadThemes } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedThemeId, setSelectedThemeId] = useState(initialThemeId);
  const [manualThemeId, setManualThemeId] = useState("");
  const [lastOpenedKey, setLastOpenedKey] = useState("");

  const themeOptions = [
    { label: "Select a theme", value: "" },
    ...(themes || []).map((theme) => ({
      label:
        theme.role === "MAIN"
          ? `${theme.name} (live)`
          : theme.role === "UNPUBLISHED"
            ? `${theme.name} (draft)`
            : `${theme.name} (preview)`,
      value: theme.id,
    })),
  ];

  const openCustomizer = useCallback(
    (themeId) => {
      if (!shop || !themeId) return;
      const url = `https://${shop}/admin/themes/${themeId}/editor?context=sections&template=index`;
      window.open(url, "_blank");
    },
    [shop]
  );

  const handleManualThemeChange = useCallback((value) => {
    setManualThemeId(value);
    setSelectedThemeId(value);
  }, []);

  const handleInsert = useCallback(
    (blockId) => {
      if (!selectedThemeId) return;
      const formData = new FormData();
      formData.append("themeId", selectedThemeId);
      formData.append("blockId", blockId);
      fetcher.submit(formData, { method: "POST" });
    },
    [fetcher, selectedThemeId]
  );

  useEffect(() => {
    if (!fetcher.data?.success || !fetcher.data?.assetKey) return;
    if (lastOpenedKey === fetcher.data.assetKey) return;
    setLastOpenedKey(fetcher.data.assetKey);
    openCustomizer(selectedThemeId);
  }, [fetcher.data, lastOpenedKey, openCustomizer, selectedThemeId]);

  const activeInsertId =
    fetcher.state !== "idle" ? fetcher.formData?.get("blockId") : "";

  return (
    <Page fullWidth>
      <TitleBar title="Section Store - UI Blocks" />
      <style>{`
        .ui-install-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 1024px) {
          .ui-install-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .ui-install-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <Layout>
        <Layout.Section>
          <Card>
            <Box padding="600" background="bg-fill-brand-secondary">
              <BlockStack gap="300">
                <InlineStack gap="200" wrap>
                  <Badge tone="info">6 UI blocks</Badge>
                  <Badge tone="success">Direct theme insert</Badge>
                </InlineStack>
                <Text variant="heading2xl" as="h1">
                  Install UI blocks directly into your selected theme
                </Text>
                <Text as="p" variant="bodyLg" tone="subdued">
                  Pick a theme from the list or enter a theme ID manually, then click any block card to insert it and open Shopify customization.
                </Text>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Box padding="500">
              <BlockStack gap="300">
                <Text as="h2" variant="headingLg">
                  Theme selection
                </Text>
                <Select
                  label="Choose theme"
                  options={themeOptions}
                  value={selectedThemeId}
                  onChange={setSelectedThemeId}
                />
                <TextField
                  label="Or enter theme ID manually"
                  value={manualThemeId}
                  onChange={handleManualThemeChange}
                  autoComplete="off"
                  helpText="Use this if you want to insert the block into a preview or manually chosen theme."
                />
                {!hasReadThemes && (
                  <Banner tone="warning">
                    Theme list is unavailable because `read_themes` permission is missing. You can still paste a theme ID manually.
                  </Banner>
                )}
                {!selectedThemeId && (
                  <Banner tone="warning">
                    Select a theme or enter a theme ID before inserting a block.
                  </Banner>
                )}
                <InlineStack gap="300" wrap>
                  <Button onClick={() => openCustomizer(selectedThemeId)} disabled={!selectedThemeId}>
                    Open selected theme
                  </Button>
                  <Badge tone={selectedThemeId ? "success" : "attention"}>
                    {selectedThemeId ? `Theme ID: ${selectedThemeId}` : "Theme not selected"}
                  </Badge>
                </InlineStack>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        {fetcher.data?.success && (
          <Layout.Section>
            <Banner tone="success">
              {fetcher.data.blockTitle} was inserted into theme `{selectedThemeId}` as `{fetcher.data.assetKey}`.
            </Banner>
          </Layout.Section>
        )}

        {fetcher.data && !fetcher.data.success && (
          <Layout.Section>
            <Banner tone="critical">
              Insert failed: {fetcher.data.error}
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <div className="ui-install-grid">
            {uiBlocks.map((block) => (
              <div
                key={block.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                }}
              >
                <img
                  src={block.image}
                  alt={block.title}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div style={{ padding: 18 }}>
                  <BlockStack gap="300">
                    <div>
                      <Text as="h3" variant="headingMd">
                        {block.title}
                      </Text>
                      <Text as="p" tone="subdued" style={{ marginTop: 8 }}>
                        {block.tagline}
                      </Text>
                    </div>

                    <InlineStack gap="200" wrap>
                      <Badge>{block.filename}</Badge>
                    </InlineStack>

                    <InlineStack gap="300" wrap>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleInsert(block.id)}
                        loading={activeInsertId === block.id}
                        disabled={!selectedThemeId || fetcher.state !== "idle"}
                      >
                        Insert into theme
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </div>
              </div>
            ))}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
