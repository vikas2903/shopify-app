import { authenticate } from "../shopify.server";

/**
 * Mandatory GDPR webhook: shop/redact
 * 48 hours after uninstall - acknowledge receipt (no data stored).
 */
export const loader = async () => {
  // Handle GET requests (Shopify webhook verification)
  return new Response("OK", { status: 200 });
};

export const action = async ({ request }) => {
  const { shop, session, topic, payload } = await authenticate.webhook(request);

  console.log(`[WEBHOOK shop/redact] Received ${topic} webhook for ${shop}`);
  console.log(`[WEBHOOK shop/redact] Payload:`, payload);

  // Return 200 OK - no database operations
  return new Response();
};
