import { json } from "@remix-run/node";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({});
};

export default function Contact() {
  return (
    <Page>
      <TitleBar title="Support" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingLg" as="h1">Get in Touch</Text>
              <Text as="p">Need help with DS-App? Our support team is here to assist you.</Text>
              <BlockStack gap="300">
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">Email Support</Text>
                  <Text as="p">For general inquiries and support:</Text>
                  <Text as="p" fontWeight="bold">vikasprasad@digisidekick.com</Text>
                  <Text as="p">For technical support:</Text>
                  <Text as="p" fontWeight="bold">support@digisidekick.com</Text>
                </BlockStack>
                <Text as="p">We aim to respond to all inquiries within 24 hours.</Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <InlineStack gap="300">
            <Button url="/app" variant="secondary">Back to Home</Button>
            <Button url="/app/guide">View Guide</Button>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}