import crypto from 'crypto';

/**
 * Verifies Shopify webhook HMAC signature
 */
export function isValidShopifyWebhook(req) {
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
  const rawBody = JSON.stringify(req.body);
  const generatedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(generatedHmac, "utf8"),
    Buffer.from(hmacHeader, "utf8")
  );
}
