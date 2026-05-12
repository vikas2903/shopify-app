import { json } from "@remix-run/node";
import { Page, Layout, Card, Text, InlineStack, Button, BlockStack, Badge } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

const guideBlocks = [
  {
    id: "announcement-bar",
    title: "Announcement Bar",
    image: "/Annoucement_bar.png",
  },
  {
    id: "categorised-search",
    title: "Categorised Search",
    image: "/Categorised_search.png",
  },
  {
    id: "products-tabber",
    title: "Products Tabber",
    image: "/products-tabber.png",
  },
  {
    id: "shop-buy-category",
    title: "Shop by Category",
    image: "/shop-buy-category.png",
  },
  {
    id: "shopable-video",
    title: "Shopable Video",
    image: "/shopable-video.png",
  },
  {
    id: "usp-icons",
    title: "USP Icons",
    image: "/usp-icons.png",
  },
];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function Guide() {
  return (
    <Page fullWidth>
      <TitleBar title="How To Use" />
      <style>{`
        .guide-block-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 1024px) {
          .guide-block-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .guide-block-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: 24, background: "#f3f7ff", borderRadius: 16 }}>
              <BlockStack gap="300">
                <InlineStack gap="200" wrap>
                  <Badge tone="info">Simple guide</Badge>
                  <Badge tone="success">Manual customization flow</Badge>
                </InlineStack>
                <Text variant="headingXl" as="h1">
                  How to use the UI blocks
                </Text>
                <Text as="p" style={{ color: "#475467" }}>
                  Open Shopify customization, choose the block you want, insert it into your theme, then update the block settings and save.
                </Text>
              </BlockStack>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              {
                step: "1",
                title: "Open customization",
                text: "Go to Online Store, open Themes, then click Customize.",
              },
              {
                step: "2",
                title: "Choose section or block",
                text: "In the left sidebar, click Add section or App blocks and choose the UI block you want to use.",
              },
              {
                step: "3",
                title: "Update settings",
                text: "Add your content like product handles, videos, text, or styling options inside the block settings.",
              },
              {
                step: "4",
                title: "Save changes",
                text: "When the block looks right, save the theme changes and publish if needed.",
              },
            ].map((item) => (
              <Card key={item.step}>
                <div style={{ padding: 20 }}>
                  <BlockStack gap="200">
                    <div style={{ width: 42, height: 42, borderRadius: 999, background: "#111827", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>
                      {item.step}
                    </div>
                    <Text variant="headingMd" as="h3">
                      {item.title}
                    </Text>
                    <Text as="p" style={{ color: "#475467" }}>
                      {item.text}
                    </Text>
                  </BlockStack>
                </div>
              </Card>
            ))}
          </div>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <div style={{ padding: 20 }}>
              <BlockStack gap="300">
                <Text as="h2" variant="headingLg">
                  Available UI blocks
                </Text>
                <Text as="p" style={{ color: "#475467" }}>
                  These are the 6 UI blocks available in your dashboard. Open customization and choose whichever block you want to use.
                </Text>

                <div className="guide-block-grid">
                  {guideBlocks.map((block) => (
                    <div
                      key={block.id}
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 18,
                        overflow: "hidden",
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
                      <div style={{ padding: 16 }}>
                        <Text variant="headingMd" as="h3">
                          {block.title}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </BlockStack>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <InlineStack gap="300">
            <Button url="/app" variant="primary">
              Back to dashboard
            </Button>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
