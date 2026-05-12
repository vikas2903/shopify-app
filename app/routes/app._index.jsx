import { json } from "@remix-run/node";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Button, Text, BlockStack, InlineStack, Banner, Select } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { sectionsData } from "../data/sectionsData";

const chooseBestTheme = (themes) => {
  if (!Array.isArray(themes) || themes.length === 0) return null;
  const mainTheme = themes.find((theme) => theme.role === "MAIN");
  return mainTheme || themes[0];
};

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session?.shop;
  const accessToken = session?.accessToken;

  const themes = [];
  let selectedThemeId = "";

  if (shop && accessToken) {
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
        });
      }
    } catch (error) {
      console.error("[app._index] Theme fetch failed:", error);
    }
  }

  return json({ themes, selectedThemeId, shop });
};

export default function Index() {
  const { themes, selectedThemeId: initialThemeId, shop } = useLoaderData();
  const [selectedThemeId, setSelectedThemeId] = useState(initialThemeId);

  const themeOptions = [
    { label: "Select a theme", value: "" },
    ...(themes || []).map((theme) => ({
      label: theme.role === "MAIN" ? `${theme.name} 🟢` : theme.name,
      value: theme.id,
    })),
  ];

  const openCustomizer = (themeId) => {
    if (!shop || !themeId) return;
    const url = `https://${shop}/admin/themes/${themeId}/editor?context=sections&template=index`;
    window.open(url, "_blank");
  };

  return (
    <Page>
      <TitleBar title="Section Store - Ui Blocks" />
      <Layout>
        <Layout.Section>
          <Banner title="Store Customizer Blocks" status="info">
            <p>Choose one of the available block cards below. Each card will open the Shopify theme editor for your current theme.</p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned subdued>
            <BlockStack gap="100">
              <Text variant="headingLg" as="h1">Featured App Blocks</Text>
              <Text as="p" style={{ color: "#475467" }}>
                These are the main storefront blocks offered by Store Customizer. Each card explains how the block helps your store.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned subdued>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">Active theme</Text>
              <Select
                label="Select theme"
                options={themeOptions}
                value={selectedThemeId}
                onChange={setSelectedThemeId}
              />
              {!selectedThemeId && (
                <Banner status="warning">
                  No theme selected. Please choose a theme from the dropdown to open the correct Shopify customizer.
                </Banner>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {sectionsData.map((block) => (
              <Card key={block.id} sectioned subdued style={{ borderRadius: 20, minHeight: 240 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: "#eef2ff", display: "grid", placeItems: "center", fontSize: 22 }}>
                    {block.icon || "✨"}
                  </div>
                  <div>
                    <Text variant="headingMd" as="h2">{block.title}</Text>
                    <Text as="p" style={{ color: "#6b7280", marginTop: 4 }}>{block.tagline}</Text>
                  </div>
                </div>
                <Text as="p" style={{ marginTop: 14, color: "#475467", minHeight: 70 }}>{block.description}</Text>
                <InlineStack align="fill" spacing="tight" style={{ marginTop: 20 }}>
                  <Button url="/app/guide" outline>
                    How to use
                  </Button>
                  <Button
                    primary
                    disabled={!selectedThemeId}
                    onClick={() => openCustomizer(selectedThemeId)}
                  >
                    Open in theme editor
                  </Button>
                </InlineStack>
              </Card>
            ))}
          </div>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned subdued>
            <Text variant="headingLg" as="h2">Need help?</Text>
            <Text as="p" style={{ marginTop: 8 }}>Email our support team for setup guidance and any questions about block usage.</Text>
            <Text as="p" style={{ marginTop: 12, fontWeight: 600 }}>vikasprasad@digisidekick.com</Text>
            <Text as="p" style={{ marginTop: 4, fontWeight: 600 }}>support@digisidekick.com</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

