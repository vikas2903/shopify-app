import {
  verifyGdprWebhookHmac,
  gdprWebhookOkResponse,
  methodNotAllowedResponse,
} from "../../utils/gdprWebhook";

/**
 * Mandatory GDPR: customers/data_request — customer requested to view their data.
 * This app does not store customer/order PII; we acknowledge receipt with 200.
 */
export async function loader() {
  return gdprWebhookOkResponse();
}

export async function action({ request }) {
  if (request.method !== "POST") return methodNotAllowedResponse();
  const raw = await request.text();
  const unauthorized = verifyGdprWebhookHmac(request, raw);
  if (unauthorized) return unauthorized;
  let payload = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {}
  console.log("[WEBHOOK customers/data_request]", payload);
  return gdprWebhookOkResponse();
}
