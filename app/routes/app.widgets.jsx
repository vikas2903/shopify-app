import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Thumbnail
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import whatsapp from "../assets/whatsapp.png";

export default function Dswidgets() {
  return (
    <Page>
      <TitleBar title="Ds Widgets" />
      <Layout>
 

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Offer Contents 
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="javascript:void(0)"
                    target="_blank"
                    removeUnderline
                  >
                    <Thumbnail
                    source={whatsapp}
                    alt="Thumbnail"
                    />
                  
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Offer Contents 
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Offer Contents 
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
        
       

      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
