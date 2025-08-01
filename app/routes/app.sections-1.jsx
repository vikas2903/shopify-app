import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  Page,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Banner,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import shopify from "../shopify.server";

export const loader = async ({ request }) => {
  let session = null;
  
  try {
    console.log("🚀 GraphQL Test Loader started");
    
    const authResult = await authenticate.admin(request);
    session = authResult.session;
    
    console.log("🔍 Session Info:");
    console.log("Shop:", session.shop);
    console.log("Scopes:", session.scope);

    // Check if we have required scopes for products
    if (!session.scope || !session.scope.includes('read_products')) {
      throw new Error(`Missing required scope 'read_products'. Current scopes: ${session.scope || 'none'}`);
    }

    // Use the correct Shopify GraphQL client
    console.log("🔄 Creating GraphQL client...");
    const client = new shopify.clients.Graphql({session});
    
    console.log("🔄 Executing GraphQL query...");
    const response = await client.query({
      data: `{
        products(first: 1) {
          totalCount
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }`
    });

    console.log("📡 GraphQL Response received");
    console.log("📋 GraphQL Data:", response.body);

    return json({
      productsCount: response.body.data.products.totalCount,
      sampleProducts: response.body.data.products.edges.map(edge => edge.node),
      shop: session.shop,
      error: null,
      debug: {
        scopes: session.scope,
        hasErrors: !!response.body.errors,
        errorCount: response.body.errors ? response.body.errors.length : 0
      }
    });

  } catch (error) {
    console.error("💥 GraphQL Test Error:", error);
    console.error("💥 Error stack:", error.stack);
    
    return json({
      productsCount: 0,
      sampleProducts: [],
      shop: session?.shop || null,
      error: {
        message: error.message,
        type: error.name || 'UnknownError',
        stack: error.stack
      },
      debug: {
        scopes: session?.scope || 'unknown',
        errorTime: new Date().toISOString(),
        sessionExists: !!session
      }
    }, { status: 500 });
  }
};

export default function GraphQLTestPage() {
  const { productsCount, sampleProducts, shop, error, debug } = useLoaderData();

  // Show error banner if there's an error
  if (error) {
    return (
      <Page title="GraphQL Test" fullWidth>
        <Banner
          title="GraphQL Test Error"
          tone="critical"
        >
          <p><strong>Error:</strong> {error.message}</p>
          <p><strong>Type:</strong> {error.type}</p>
          {debug && (
            <>
              <p><strong>Debug Info:</strong></p>
              <ul>
                <li>Scopes: {debug.scopes}</li>
                <li>Session Exists: {debug.sessionExists ? 'Yes' : 'No'}</li>
                {debug.errorTime && <li>Error Time: {debug.errorTime}</li>}
              </ul>
            </>
          )}
          
          <p><strong>Possible Solutions:</strong></p>
          <ol>
            <li>Check if your app has <code>read_products</code> scope</li>
            <li>Reinstall the app to get updated permissions</li>
            <li>Check the browser console (F12) for detailed error logs</li>
          </ol>
          
          <p><strong>This means:</strong> GraphQL is not working properly. Check your app permissions and scopes.</p>
        </Banner>
      </Page>
    );
  }

  return (
    <Page title="GraphQL Test - Products Count">
      {debug && (
        <Banner
          title="GraphQL Test Results"
          tone="info"
        >
          <p><strong>✅ GraphQL is working!</strong></p>
          <p>Scopes: {debug.scopes}</p>
          <p>Has Errors: {debug.hasErrors ? 'Yes' : 'No'}</p>
          {debug.errorCount > 0 && <p>Error Count: {debug.errorCount}</p>}
        </Banner>
      )}
      
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Store Products Information
            </Text>
            
            <Text variant="bodyMd">
              <strong>Total Products:</strong> {productsCount}
            </Text>
            
            <Text variant="bodyMd">
              <strong>Shop:</strong> {shop}
            </Text>
          </BlockStack>
        </Card>

        {sampleProducts.length > 0 && (
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3">
                Sample Products (First 1)
              </Text>
              
              {sampleProducts.map((product, index) => (
                <div key={product.id}>
                  <Text variant="bodyMd">
                    <strong>{index + 1}.</strong> {product.title}
                  </Text>
                  <Text variant="bodySm" tone="subdued">
                    Handle: {product.handle}
                  </Text>
                  <Text variant="bodySm" tone="subdued">
                    ID: {product.id}
                  </Text>
                </div>
              ))}
            </BlockStack>
          </Card>
        )}

        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h3">
              GraphQL Test Status
            </Text>
            
            <Banner tone="success">
              <p>✅ GraphQL query executed successfully!</p>
              <p>This confirms that your app has proper GraphQL access.</p>
            </Banner>
            
            <InlineStack gap="300">
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
              >
                Test Again
              </Button>
              
              <Button
                onClick={() => window.open(`https://${shop}/admin/products`, "_blank")}
                variant="secondary"
              >
                View Products in Admin
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
