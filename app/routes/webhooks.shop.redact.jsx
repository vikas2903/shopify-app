import {
  verifyGdprWebhookHmac,
  gdprWebhookOkResponse,
  methodNotAllowedResponse,
} from "../utils/gdprWebhook";
import prisma from "../db.server";
import Store from "../backend/modals/store.js";

/**
 * Mandatory GDPR webhook: shop/redact (48h after uninstall).
 * Deletes all app data for the shop: Prisma Session + MongoDB Store.
 */
export async function loader() {
  return gdprWebhookOkResponse();
}

export async function action({ request }) {
  if (request.method !== "POST") {
    return methodNotAllowedResponse();
  }

  const raw = await request.text();
  const unauthorized = verifyGdprWebhookHmac(request, raw);
  if (unauthorized) return unauthorized;

  let payload = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    // Still accept; HMAC was valid
  }
  console.log("[WEBHOOK shop/redact]", payload);

  const shopDomain = payload?.shop_domain;
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
