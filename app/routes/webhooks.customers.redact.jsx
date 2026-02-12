import {
  verifyGdprWebhookHmac,
  gdprWebhookOkResponse,
  methodNotAllowedResponse,
} from "../utils/gdprWebhook.js";

/**
 * Mandatory GDPR webhook: customers/redact
 * Store owner requested deletion of customer data. This app does not store customer PII.
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

  console.log("[WEBHOOK customers/redact]", { shop, topic, payload });
  return gdprWebhookOkResponse();
}
