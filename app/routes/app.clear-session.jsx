import { json, redirect } from '@remix-run/node';
import { useLoaderData, useActionData } from '@remix-run/react';
import { Page, Layout, Card, Button, Banner, BlockStack, Text } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    
    // Also get session from DB to show current state
    const dbSession = await prisma.session.findFirst({
      where: { shop: session.shop },
    });

    return json({ 
      shop: session.shop,
      currentScope: session.scope,
      dbScope: dbSession?.scope || null,
    });
  } catch (error) {
    return json({ 
      shop: 'unknown',
      error: error.message,
      currentScope: null,
      dbScope: null,
    });
  }
};

export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;

    console.log(`🗑️ Clearing sessions for shop: ${shop}`);
    console.log(`📋 Current scopes before clear:`, session.scope);

    // Delete all sessions for this shop from Prisma
    const deletedPrisma = await prisma.session.deleteMany({
      where: { shop },
    });
    console.log(`✅ Deleted ${deletedPrisma.count} Prisma session(s)`);

    // Also clear MongoDB store if it exists
    try {
      const Store = (await import('../backend/modals/store.js')).default;
      const mongoose = (await import('mongoose')).default;
      
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      }
      
      const deletedMongo = await Store.deleteMany({ shop });
      console.log(`✅ Deleted ${deletedMongo.deletedCount} MongoDB store(s)`);
    } catch (mongoError) {
      console.log(`⚠️ MongoDB cleanup skipped:`, mongoError.message);
    }

    console.log(`✅ Cleared all sessions for shop: ${shop}`);

    // Redirect to auth to get new session with updated scopes
    // Use full URL to ensure proper redirect
    const authUrl = `/auth?shop=${shop}`;
    return redirect(authUrl);
  } catch (error) {
    console.error('Error clearing session:', error);
    return json({ error: error.message }, { status: 500 });
  }
};

export default function ClearSession() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const { shop, currentScope, dbScope, error } = loaderData || {};

  return (
    <Page>
      <TitleBar title="Clear Session & Re-authorize" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Clear Session to Update Scopes
              </Text>
              
              {actionData?.error && (
                <Banner status="critical">
                  <p>Error: {actionData.error}</p>
                </Banner>
              )}

              <Text as="p" variant="bodyMd">
                Your app session currently has old scopes. To get the new scopes 
                (read_themes, write_themes, read_products), you need to clear the 
                current session and re-authorize.
              </Text>

              <Text as="p" variant="bodyMd">
                <strong>Current Shop:</strong> {shop || 'Unknown'}
              </Text>

              {currentScope && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
                  <Text as="p" variant="bodySm" fontWeight="semibold">Current Session Scope:</Text>
                  <Text as="p" variant="bodySm" style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {currentScope || 'null'}
                  </Text>
                  <Text as="p" variant="bodySm" tone={currentScope?.includes('read_themes') ? 'success' : 'critical'} style={{ marginTop: '8px' }}>
                    Has read_themes: {currentScope?.includes('read_themes') ? '✅ Yes' : '❌ No'}
                  </Text>
                  {dbScope && dbScope !== currentScope && (
                    <Text as="p" variant="bodySm" tone="subdued" style={{ marginTop: '8px' }}>
                      DB Scope: {dbScope}
                    </Text>
                  )}
                </div>
              )}

              <form method="post" style={{ marginTop: '16px' }}>
                <Button submit primary>
                  Clear Session & Re-authorize
                </Button>
              </form>

              <Banner status="info">
                <p>
                  After clicking the button, you'll be redirected to re-authorize 
                  the app with the updated scopes.
                </p>
              </Banner>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
