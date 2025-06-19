// /utils/verifyWebhookHMAC.js
import crypto from "crypto";

/**
 * Verifies Shopify webhook using HMAC.
 * @param {Buffer|string} rawBody - Raw body of the request
 * @param {string} hmacHeader - Header from Shopify
 * @param {string} secret - Shopify API secret
 * @returns {boolean}
 */
export function verifyWebhookHMAC(rawBody, hmacHeader, secret) {
  const generatedHmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedHmac),
      Buffer.from(hmacHeader)
    );
  } catch {
    return false;
  }
}
