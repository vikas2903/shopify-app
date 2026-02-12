import { authenticate } from "../shopify.server";

/**
 * Webhook: app/scopes_update
 * Acknowledge receipt - return 200 OK status (no database operations).
 */
export const loader = async () => {
  // Handle GET requests (Shopify webhook verification)
  return new Response("OK", { status: 200 });
};

export const action = async ({ request }) => {
  const { shop, session, topic, payload } = await authenticate.webhook(request);

  console.log(`[WEBHOOK app/scopes_update] Received ${topic} webhook for ${shop}`);
  console.log(`[WEBHOOK app/scopes_update] Current scopes:`, payload.current);

  // Return 200 OK - no database operations
  return new Response();
};
