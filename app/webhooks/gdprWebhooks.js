// /app/webhooks/gdprWebhooks.js
import express from "express";
import { verifyWebhookHMAC } from "../utils/verifyWebhookhamc.js"; // ✅ corrected filename casing

const gdprRouter = express.Router();
const secret = process.env.SHOPIFY_API_SECRET;

// ✅ Ensure raw body is available for HMAC verification
gdprRouter.use(express.raw({ type: "*/*" }));

// ✅ Utility to parse and verify
function handleGDPRWebhook(req, res, label) {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  const rawBody = req.body;

  if (!verifyWebhookHMAC(rawBody, hmac, secret)) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = JSON.parse(rawBody.toString("utf8"));
    console.log(`${label}:`, payload);
    res.status(200).send("Received");
  } catch (err) {
    console.error("Invalid JSON in webhook payload:", err);
    res.status(400).send("Invalid JSON");
  }
}

// 🎯 Shopify Webhook Routes
gdprRouter.post("/customers/data_request", (req, res) =>
  handleGDPRWebhook(req, res, "Customer Data Request")
);

gdprRouter.post("/customers/redact", (req, res) =>
  handleGDPRWebhook(req, res, "Customer Data Erasure")
);

gdprRouter.post("/shop/redact", (req, res) =>
  handleGDPRWebhook(req, res, "Shop Data Erasure")
);

export default gdprRouter;
