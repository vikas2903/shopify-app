// /app/webhooks/gdprWebhooks.js
import express from "express";
import { verifyWebhookHMAC } from "../webhooks/gdprWebhooks.js"

const gdprRouter = express.Router();
const secret = process.env.SHOPIFY_API_SECRET;

gdprRouter.use(express.raw({ type: "application/json" }));

// ✅ Reusable handler function
const handleGDPRWebhook = (type, req, res) => {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  const rawBody = req.body;

  if (!verifyWebhookHMAC(rawBody, hmac, secret)) {
    console.warn(`❌ ${type} webhook failed HMAC verification`);
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = JSON.parse(rawBody.toString("utf8"));
    console.log(`✅ ${type} webhook received:`, payload);
    return res.status(200).send("Received");
  } catch (err) {
    console.error(`❌ Failed to process ${type} webhook:`, err);
    return res.status(400).send("Invalid JSON");
  }
};

// 📦 Customer Data Request
gdprRouter.post("/customers/data_request", (req, res) =>
  handleGDPRWebhook("CUSTOMERS_DATA_REQUEST", req, res)
);

// 🧹 Customer Data Erasure
gdprRouter.post("/customers/redact", (req, res) =>
  handleGDPRWebhook("CUSTOMERS_REDACT", req, res)
);

// 🏪 Shop Data Erasure
gdprRouter.post("/shop/redact", (req, res) =>
  handleGDPRWebhook("SHOP_REDACT", req, res)
);

export default gdprRouter;
