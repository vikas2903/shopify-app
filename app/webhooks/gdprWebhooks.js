// /app/webhooks/gdprWebhooks.js
import express from "express";
import { verifyWebhookHMAC } from "../utils/verifyWebhookhamc.js";

const gdprRouter = express.Router();
const secret = process.env.SHOPIFY_API_SECRET;

gdprRouter.use(express.raw({ type: "application/json" }));

// Customer Data Request
gdprRouter.post("/customers/data_request", (req, res) => {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  if (!verifyWebhookHMAC(req.body, hmac, secret)) {
    return res.status(401).send("Unauthorized");
  }

  const payload = JSON.parse(req.body.toString("utf8"));
  console.log("Customer Data Request:", payload);
  res.status(200).send("Received");
});

// Customer Data Erasure
gdprRouter.post("/customers/redact", (req, res) => {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  if (!verifyWebhookHMAC(req.body, hmac, secret)) {
    return res.status(401).send("Unauthorized");
  }

  const payload = JSON.parse(req.body.toString("utf8"));
  console.log("Customer Data Erasure:", payload);
  res.status(200).send("Received");
});

// Shop Data Erasure
gdprRouter.post("/shop/redact", (req, res) => {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  if (!verifyWebhookHMAC(req.body, hmac, secret)) {
    return res.status(401).send("Unauthorized");
  }

  const payload = JSON.parse(req.body.toString("utf8"));
  console.log("Shop Data Erasure:", payload);
  res.status(200).send("Received");
});

export default gdprRouter;
