import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Page, Layout, Card, BlockStack, Text } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    
    // Get session from database to see what's actually stored
    const dbSession = await prisma.session.findFirst({
      where: { shop: session.shop },
    });

    return json({
      sessionFromAuth: {
        id: session.id,
        shop: session.shop,
        scope: session.scope,
        scopeType: typeof session.scope,
        accessToken: session.accessToken ? 'Present' : 'Missing',
      },
      sessionFromDB: dbSession ? {
        id: dbSession.id,
        shop: dbSession.shop,
        scope: dbSession.scope,
        scopeType: typeof dbSession.scope,
        accessToken: dbSession.accessToken ? 'Present' : 'Missing',
      } : null,
      scopeAnalysis: {
        rawScope: session.scope,
        scopeAsString: typeof session.scope === 'string' ? session.scope : String(session.scope),
        scopeAsArray: typeof session.scope === 'string' ? session.scope.split(',').map(s => s.trim()) : (Array.isArray(session.scope) ? session.scope : []),
        hasReadThemes: (session.scope || '').includes('read_themes'),
        hasWriteThemes: (session.scope || '').includes('write_themes'),
        hasReadProducts: (session.scope || '').includes('read_products'),
      },
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

export default function DebugScopes() {
  const data = useLoaderData();

  if (data.error) {
    return (
      <Page>
        <TitleBar title="Debug Scopes" />
        <Card>
          <Text as="p" variant="bodyMd" tone="critical">
            Error: {data.error}
          </Text>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <TitleBar title="Session Scope Debug" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Session from authenticate.admin()
              </Text>
              <pre style={{ 
                backgroundColor: '#F5F5F5', 
                padding: '16px', 
                borderRadius: '8px', 
                overflow: 'auto',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                {JSON.stringify(data.sessionFromAuth, null, 2)}
              </pre>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Session from Database
              </Text>
              <pre style={{ 
                backgroundColor: '#F5F5F5', 
                padding: '16px', 
                borderRadius: '8px', 
                overflow: 'auto',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                {data.sessionFromDB ? JSON.stringify(data.sessionFromDB, null, 2) : 'No session found in database'}
              </pre>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Scope Analysis
              </Text>
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  <strong>Raw Scope:</strong> {data.scopeAnalysis.rawScope || 'null'}
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>Scope as String:</strong> {data.scopeAnalysis.scopeAsString}
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>Scope as Array:</strong> [{data.scopeAnalysis.scopeAsArray.join(', ')}]
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>Has read_themes:</strong> {data.scopeAnalysis.hasReadThemes ? '✅ Yes' : '❌ No'}
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>Has write_themes:</strong> {data.scopeAnalysis.hasWriteThemes ? '✅ Yes' : '❌ No'}
                </Text>
                <Text as="p" variant="bodyMd">
                  <strong>Has read_products:</strong> {data.scopeAnalysis.hasReadProducts ? '✅ Yes' : '❌ No'}
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
