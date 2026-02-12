import { authenticate } from "../shopify.server";

/**
 * Mandatory GDPR webhook: customers/redact
 * Store owner requested deletion of customer data. This app does not store customer PII.
 */
export const loader = async () => {
  // Handle GET requests (Shopify webhook verification)
  return new Response("OK", { status: 200 });
};

export const action = async ({ request }) => {
  const { shop, session, topic, payload } = await authenticate.webhook(request);

  console.log(`[WEBHOOK customers/redact] Received ${topic} webhook for ${shop}`);
  console.log(`[WEBHOOK customers/redact] Payload:`, payload);

  // Return 200 OK - no database operations
  return new Response();
};
