/**
 * Test GDPR webhook endpoints locally.
 * Run with: node scripts/test-gdpr-webhooks.js
 *
 * Prerequisites:
 * 1. Start your app: npm run dev (or shopify app dev)
 * 2. Set SHOPIFY_API_SECRET in .env (or pass as env when running)
 * 3. Use the port your app runs on (default 3000 or the one shown in terminal)
 */

import crypto from "node:crypto";

const BASE_URL = process.env.WEBHOOK_TEST_URL || "http://localhost:3000";
const SECRET = process.env.SHOPIFY_API_SECRET;

const ENDPOINTS = [
  "/webhooks/customers/data_request",
  "/webhooks/customers/redact",
  "/webhooks/shop/redact",
];

const SAMPLE_PAYLOADS = {
  "/webhooks/customers/data_request": {
    shop_id: 954889,
    shop_domain: "test.myshopify.com",
    orders_requested: [299938, 280263],
    customer: { id: 191167, email: "john@example.com", phone: "555-625-1199" },
    data_request: { id: 9999 },
  },
  "/webhooks/customers/redact": {
    shop_id: 954889,
    shop_domain: "test.myshopify.com",
    customer: { id: 191167, email: "john@example.com", phone: "555-625-1199" },
    orders_to_redact: [299938, 280263],
  },
  "/webhooks/shop/redact": {
    shop_id: 954889,
    shop_domain: "test.myshopify.com",
  },
};

function computeHmac(body, secret) {
  return crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");
}

async function testEndpoint(path, useValidHmac) {
  const body = JSON.stringify(SAMPLE_PAYLOADS[path] || {});
  const hmac = useValidHmac && SECRET ? computeHmac(body, SECRET) : "invalid-hmac-value";

  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Hmac-Sha256": hmac,
      "X-Shopify-Topic": path.split("/").slice(-2).join("/"),
      "X-Shopify-Shop-Domain": "test.myshopify.com",
    },
    body,
  });

  return { status: res.status, ok: res.ok };
}

async function run() {
  console.log("Testing GDPR webhooks at:", BASE_URL);
  console.log("SHOPIFY_API_SECRET set:", !!SECRET);
  console.log("");

  if (!SECRET) {
    console.log("⚠️  Set SHOPIFY_API_SECRET in .env (or export it) for valid HMAC tests.");
    console.log("   Without it, valid-HMAC requests will get 401 (expected).\n");
  }

  for (const path of ENDPOINTS) {
    console.log(path);

    const invalid = await testEndpoint(path, false);
    console.log("  Invalid HMAC:", invalid.status, invalid.status === 401 ? "✅ (expected 401)" : "❌ expected 401");

    const valid = await testEndpoint(path, true);
    if (SECRET) {
      console.log("  Valid HMAC:  ", valid.status, valid.status === 200 ? "✅ (expected 200)" : "❌ expected 200");
    } else {
      console.log("  Valid HMAC:  ", valid.status, "(no secret, 401 expected)");
    }
    console.log("");
  }

  console.log("Done. Your app must return 401 for invalid HMAC and 200 for valid HMAC.");
}

run().catch((err) => {
  console.error("Error:", err.message);
  console.log("\nIs your app running? Try: npm run dev");
  process.exit(1);
});
