import crypto from "node:crypto";

const HMAC_HEADER = "x-shopify-hmac-sha256";

/**
 * Verify Shopify webhook HMAC for mandatory GDPR compliance webhooks.
 * Returns an error Response (401) if invalid, or null if valid.
 * @param {Request} request - The incoming webhook request
 * @param {string} rawBody - Raw request body as string
 * @returns {Promise<Response|null>} 401 Response if invalid, null if valid
 */
export function verifyGdprWebhookHmac(request, rawBody) {
  const secret = process.env.SHOPIFY_API_SECRET;
  const hmac = request.headers.get(HMAC_HEADER) || request.headers.get("X-Shopify-Hmac-Sha256") || "";

  if (!secret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!hmac) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  try {
    const verified = crypto.timingSafeEqual(
      Buffer.from(hmac, "base64"),
      Buffer.from(digest, "base64")
    );
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}

/** Standard 200 JSON response for GDPR webhooks */
export const gdprWebhookOkResponse = () =>
  new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

/** 405 Method Not Allowed - GDPR webhooks must be POST */
export const methodNotAllowedResponse = () =>
  new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
