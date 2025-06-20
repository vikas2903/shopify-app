import crypto from 'crypto';
import { json } from '@remix-run/node';

export const action = async ({ request }) => {
  const secret = process.env.SHOPIFY_API_SECRET;
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const rawBody = await request.text();

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  const verified = crypto.timingSafeEqual(
    Buffer.from(hmacHeader, "base64"),
    Buffer.from(digest, "base64")
  );

  if (!verified) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  console.log("✅ CUSTOMER DATA REQUEST WEBHOOK:", payload);

  return json({ success: true });
};