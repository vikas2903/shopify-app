import { json } from "@remix-run/node";
import crypto from "crypto";

export async function action({ request }) {
  const rawBody = await request.text();
  const hmacHeader = request.headers.get("X-Shopify-Hmac-Sha256");
  const secret = process.env.SHOPIFY_API_SECRET;

  if (!hmacHeader || !secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const hash = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  if (hash !== hmacHeader) {
    console.error("❌ HMAC mismatch:", { expected: hmacHeader, calculated: hash });
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  console.log("🏪 Shop Redact Webhook:", payload);

  return json({ success: true });
}
