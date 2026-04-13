import { json } from "@remix-run/node";
import { Page, Layout, Card, Button, Text, BlockStack, InlineStack, Banner } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { sectionsData } from "../data/sectionsData";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function Index() {
  return (
    <Page>
      <TitleBar title="DS-App Home" />
      <Layout>
        <Layout.Section>
          <Banner title="Store Customizer Blocks" status="info">
            <p>Choose one of the available block cards below to understand how it works and where to use it in your store.</p>
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
          <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {sectionsData.map((block) => (
              <Card key={block.id} sectioned subdued style={{ borderRadius: 20, minHeight: 220 }}>
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
                <Button url="/app/guide" outline style={{ marginTop: 14 }}>
                  How to use
                </Button>
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

