import {
  verifyGdprWebhookHmac,
  gdprWebhookOkResponse,
  methodNotAllowedResponse,
} from "../utils/gdprWebhook";

/**
 * Mandatory GDPR webhook: customers/redact
 * - Handles POST with JSON body and Content-Type: application/json
 * - Returns 401 Unauthorized if Shopify HMAC header is invalid
 * - Returns 200 to confirm receipt
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
  console.log("[WEBHOOK customers/redact]", payload);

  return gdprWebhookOkResponse();
}
