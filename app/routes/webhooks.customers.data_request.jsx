import {
  verifyGdprWebhookHmac,
  gdprWebhookOkResponse,
  methodNotAllowedResponse,
} from "../utils/gdprWebhook.js";

/**
 * Mandatory GDPR webhook: customers/data_request
 * Customer requested to view their data. This app does not store customer PII.
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

  console.log("[WEBHOOK customers/data_request]", { shop, topic, payload });
  return gdprWebhookOkResponse();
}
