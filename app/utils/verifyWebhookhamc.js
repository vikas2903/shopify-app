// /app/utils/verifyWebhookHmac.js
import crypto from "crypto";

export function verifyWebhookHMAC(rawBody, hmacHeader, secret) {
  const generatedHmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedHmac, "utf8"),
      Buffer.from(hmacHeader, "utf8")
    );
  } catch (error) {
    return false;
  }
}
