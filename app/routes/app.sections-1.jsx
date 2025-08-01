import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  Page,
  BlockStack,
  Text,
  Select,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(`
    {
      themes(first: 20) {
        edges {
          node {
            id
            name
            role
          }
        }
      }
    }
  `);
  const { data } = await response.json();

  return json({
    themes: data.themes.edges.map((edge) => edge.node),
    shop: session.shop,
  });
};

export default function ThemesPage() {
  const { themes, shop } = useLoaderData();
  const [selectedThemeId, setSelectedThemeId] = useState(
    themes.length > 0 ? themes[0].id : ""
  );

  const handleSelectChange = (value) => {
    setSelectedThemeId(value);
  };

  const themeOptions = themes.map((theme) => ({
    label: `${theme.name}${theme.role === "MAIN" ? " 🟢" : ""}`,
    value: theme.id,
  }));

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  // Helper to extract plain ID from GID
  const getThemeId = (gid) =>
    typeof gid === "string" && gid.includes("Theme/") ? gid.split("Theme/")[1] : "";

  const themeId = getThemeId(selectedTheme?.id);
  const themeEditorUrl = `https://${shop}/admin/themes/${themeId}/editor`;
  const codeEditorUrl = `https://${shop}/admin/themes/${themeId}`;

  return (
    <Page title="Store Themes">
      {themes.length > 0 ? (
        <BlockStack gap="400">
          <Select
            label="Select a theme"
            options={themeOptions}
            onChange={handleSelectChange}
            value={selectedThemeId}
          />

          <Card>
            <BlockStack gap="200">
              <Text variant="bodyMd">
                Selected theme: {selectedTheme?.name || "None"}
              </Text>

              <InlineStack gap="300">
                {selectedTheme && (
                  <Button
                    onClick={() => window.open(themeEditorUrl, "_blank", "noopener,noreferrer")}
                    variant="primary"
                  >
                    Customize
                  </Button>
                )}

                {selectedTheme && (
                  <Button
                    onClick={() => window.open(codeEditorUrl, "_blank", "noopener,noreferrer")}
                    variant="primary"
                  >
                    Edit Code
                  </Button>
                )}
              </InlineStack>
            </BlockStack>
          </Card>
        </BlockStack>
      ) : (
        <Text variant="bodyMd" as="p">
          No themes found in this store.
        </Text>
      )}
    </Page>
  );
}
