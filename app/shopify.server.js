import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

import axios from 'axios';
import Store from './backend/modals/store.js';
import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardroute from "./backend/route/dashboardRoutes.js";
import { getDashboardData } from "./backend/controller/dashboardController.js";
import { json } from "@remix-run/node";
import { getShopSession } from "./backend/getShopSession.js";
import { isValidShopifyWebhook } from './utils/verifyWebhookHmac.js';
import { createRequestHandler } from "@remix-run/express";
import * as build from '../build/server/index.js'

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json({ type: "*/*" })); // ensure raw body for HMAC
app.use(cors());

export const MONTHLY_PLAN = 'Monthly subscription';
export const ANNUAL_PLAN = 'Annual subscription';

// ################## Webhook Routes (before Remix handler) ##################
app.post("/webhooks/customers/data_request", (req, res) => {
  if (!isValidShopifyWebhook(req)) {
    return res.status(401).send("Unauthorized");
  }
  console.log("✅ Valid customer data request");
  res.status(200).send("OK");
});

app.post("/webhooks/customers/redact", (req, res) => {
  if (!isValidShopifyWebhook(req)) {
    return res.status(401).send("Unauthorized");
  }
  console.log("✅ Valid customer redact request");
  res.status(200).send("OK");
});

app.post("/webhooks/shop/redact", (req, res) => {
  if (!isValidShopifyWebhook(req)) {
    return res.status(401).send("Unauthorized");
  }
  console.log("✅ Valid shop redact request");
  res.status(200).send("OK");
});
// ###########################################################################

export const loader = async ({ request }) => {
  const { shop, accessToken, host } = await getShopSession(request);
  return json({ shop, host });
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

app.get("/auth/callback", async (req, res) => {
  const { shop, code } = req.query;
  if (!shop || !code) {
    return res.status(400).json({ success: false, message: "Missing shop or code" });
  }

  try {
    const tokenUrl = `https://${shop}/admin/oauth/access_token`;
    const payload = {
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    };

    const tokenResponse = await axios.post(tokenUrl, payload);
    const accessToken = tokenResponse.data.access_token;

    let store = await Store.findOne({ shop });
    if (store) {
      store.accessToken = accessToken;
      store.updatedAt = new Date();
    } else {
      store = new Store({ shop, accessToken, updatedAt: new Date() });
    }
    await store.save();

    const redirectURL = `https://admin.shopify.com/store/${shop.replace(
      ".myshopify.com",
      ""
    )}/apps/${process.env.SHOPIFY_APP_NAME}`;

    return res.redirect(redirectURL);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process authentication",
      error: error.message
    });
  }
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(",") || [],
  appUrl: process.env.SHOPIFY_APP_URL,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  billing: {
    [MONTHLY_PLAN]: {
      amount: 10,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    },
    [ANNUAL_PLAN]: {
      amount: 100,
      currencyCode: 'USD',
      interval: BillingInterval.Annual,
    },
  },
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

app.all("*", createRequestHandler({ build }));

if (process.env.NODE_ENV !== 'test') {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log("🚀 Server running on http://localhost:" + PORT);
  });
}
