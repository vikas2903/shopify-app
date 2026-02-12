import { authenticate } from "../shopify.server";

/**
 * Mandatory GDPR webhook: customers/data_request
 * Customer requested to view their data. This app does not store customer PII.
 */
export const loader = async () => {
  // Handle GET requests (Shopify webhook verification)
  return new Response("OK", { status: 200 });
};

export const action = async ({ request }) => {
  const { shop, session, topic, payload } = await authenticate.webhook(request);

  console.log(`[WEBHOOK customers/data_request] Received ${topic} webhook for ${shop}`);
  console.log(`[WEBHOOK customers/data_request] Payload:`, payload);

  // Return 200 OK - no database operations
  return new Response();
};
