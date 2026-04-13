import { json } from "@remix-run/node";
import { Page, Layout, Card, Text, InlineStack, Button, List } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { sectionsData } from "../data/sectionsData";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function Guide() {
  return (
    <Page>
      <TitleBar title="How To Use" />
      <Layout>
        <Layout.Section>
          <Card sectioned subdued>
            <Text variant="headingLg" as="h1">How to use these blocks</Text>
            <Text as="p" style={{ marginTop: 10, color: "#475467" }}>
              Open the Shopify theme editor, add block sections from the App block menu, and choose Store Customizer blocks.
            </Text>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              { icon: "🖥️", title: "Open Customization", text: "Go to Online Store → Themes → Customize in Shopify admin." },
              { icon: "➕", title: "Add Blocks", text: "Click Add blocks or App blocks in the left sidebar." },
              { icon: "📦", title: "Choose App Blocks", text: "Open App blocks and choose among theme blocks from Store Customizer." },
              { icon: "✅", title: "Add to Theme", text: "Insert the chosen block and save the theme changes." },
            ].map((item) => (
              <Card key={item.title} sectioned subdued style={{ padding: 20, borderRadius: 18, minHeight: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, background: "#eef2ff", display: "grid", placeItems: "center", fontSize: 24 }}>
                    {item.icon}
                  </div>
                  <Text variant="headingMd" as="h3">{item.title}</Text>
                </div>
                <Text as="p" style={{ marginTop: 12, color: "#475467" }}>{item.text}</Text>
              </Card>
            ))}
          </div>
        </Layout.Section>

        <Layout.Section>
          <Card title="Block Guide" sectioned>
            <div style={{ display: "grid", gap: "16px" }}>
              {sectionsData.map((block) => (
                <Card key={block.id} sectioned subdued style={{ borderRadius: 18, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 14, background: "#eef2ff", display: "grid", placeItems: "center", fontSize: 24 }}>
                      {block.icon || "✨"}
                    </div>
                    <Text variant="headingMd" as="h2">{block.title}</Text>
                  </div>
                  <Text as="p" style={{ marginTop: 10, color: "#475467" }}>{block.description}</Text>
                  <Text as="p" style={{ marginTop: 12, fontWeight: 600 }}>How to use this block</Text>
                  <Text as="p">{block.usage}</Text>
                </Card>
              ))}
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <InlineStack gap="300">
            <Button url="/app" variant="secondary">Back to Home</Button>
            <Button url="/app/contact">Contact Support</Button>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}