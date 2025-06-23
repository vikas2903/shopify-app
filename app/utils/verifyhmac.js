import crypto from 'crypto';

/**
 * Verifies Shopify webhook using HMAC SHA256
 * @param {Buffer} rawBody - Raw request body
 * @param {string} hmacHeader - HMAC from Shopify header
 * @param {string} secret - Your Shopify API secret
 * @returns {boolean}
 */
export function verifyhmac(rawBody, hmacHeader, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'base64'),
      Buffer.from(hmacHeader, 'base64')
    );
  } catch (err) {
    return false;
  }
}
