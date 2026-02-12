import {
  verifyGdprWebhookHmac,
  gdprWebhookOkResponse,
  methodNotAllowedResponse,
}  from "../utils/gdprWebhook.js";
import prisma from "../db.server";
import Store from "../backend/modals/store.js";

/**
 * Mandatory GDPR webhook: shop/redact
 * 48 hours after uninstall - delete all shop data.
 */
export async function loader() {
  return gdprWebhookOkResponse();
}

export async function action({ request }) {
  if (request.method !== "POST") return methodNotAllowedResponse();
  
  const raw = await request.text();
  const unauthorized = verifyGdprWebhookHmac(request, raw);
  if (unauthorized) return unauthorized;
  
  const topic = request.headers.get("X-Shopify-Topic") || "";
  const shop = request.headers.get("X-Shopify-Shop-Domain") || "";
  let payload = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {}

  console.log("[WEBHOOK shop/redact]", { shop, topic, payload });

  // Delete all shop data
  const shopDomain = payload?.shop_domain || shop;
  if (shopDomain) {
    try {
      const deletedSessions = await prisma.session.deleteMany({
        where: { shop: shopDomain },
      });
      console.log("[WEBHOOK shop/redact] Prisma sessions deleted:", deletedSessions.count);
    } catch (e) {
      console.error("[WEBHOOK shop/redact] Prisma delete error:", e.message);
    }
    try {
      const storeResult = await Store.deleteOne({ shop: shopDomain });
      console.log("[WEBHOOK shop/redact] MongoDB store deleted:", storeResult.deletedCount);
    } catch (e) {
      console.error("[WEBHOOK shop/redact] MongoDB delete error:", e.message);
    }
  }

  return gdprWebhookOkResponse();
}
