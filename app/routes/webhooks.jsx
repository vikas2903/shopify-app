import {
  verifyGdprWebhookHmac,
  gdprWebhookOkResponse,
  methodNotAllowedResponse,
} from "../utils/gdprWebhook";
import prisma from "../db.server";
import Store from "../backend/modals/store.js";

/**
 * GDPR mandatory webhooks: Shopify POSTs to /webhooks for all three compliance topics.
 * X-Shopify-Topic header indicates: customers/data_request | customers/redact | shop/redact
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
  let payload = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {}

  switch (topic) {
    case "customers/data_request":
      console.log("[WEBHOOK customers/data_request]", payload);
      // App does not store customer PII; acknowledge receipt
      break;

    case "customers/redact":
      console.log("[WEBHOOK customers/redact]", payload);
      // App does not store customer PII; acknowledge receipt
      break;

    case "shop/redact": {
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
      break;
    }

    default:
      console.log("[WEBHOOK unknown topic]", topic, payload);
  }

  return gdprWebhookOkResponse();
}