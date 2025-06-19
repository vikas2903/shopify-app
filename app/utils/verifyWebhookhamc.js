// /app/utils/verifyWebhookHMAC.js
import crypto from "crypto";

export function verifyWebhookHMAC(rawBody, hmacHeader, secret) {
  const generatedHmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(generatedHmac),
    Buffer.from(hmacHeader)
  );
}
