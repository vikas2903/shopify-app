import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/**
 * Webhook: app/scopes_update
 * Update session scopes when Shopify sends scope update notification.
 */
export const loader = async () => {
  // Handle GET requests (Shopify webhook verification)
  return new Response("OK", { status: 200 });
};

export const action = async ({ request }) => {
  const { shop, session, topic, payload } = await authenticate.webhook(request);

  console.log(`[WEBHOOK app/scopes_update] Received ${topic} webhook for ${shop}`);
  console.log(`[WEBHOOK app/scopes_update] Old scopes:`, payload.previous);
  console.log(`[WEBHOOK app/scopes_update] New scopes:`, payload.current);

  // Update session scopes in database
  if (session && payload.current) {
    try {
      await prisma.session.updateMany({
        where: { shop },
        data: {
          scope: payload.current.join(','),
        },
      });
      console.log(`✅ Updated scopes for shop ${shop}:`, payload.current.join(','));
    } catch (error) {
      console.error(`❌ Error updating scopes for shop ${shop}:`, error);
    }
  }

  // Return 200 OK
  return new Response();
};
