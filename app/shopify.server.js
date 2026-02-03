import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

// Load .env from project root or app/ so it's readable from any cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPaths = [
  path.join(process.cwd(), ".env"),
  path.join(process.cwd(), "app", ".env"),
  path.join(__dirname, ".env"),
];
for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  // BillingInterval,
  DeliveryMethod,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import Store from "./backend/modals/store.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

// import crypto from "crypto";

const app = express();

app.use("/webhooks", express.raw({ type: "*/*" }));
app.use(express.json());

app.use((req, res, next) => {
  let data = "";
  req.setEncoding("utf8");
  req.on("data", (chunk) => (data += chunk));
  req.on("end", () => {
    req.rawBody = data;
    next();
  });
});

app.use(cors());
app.use('/images', express.static(path.join(__dirname, './public')));


const connectDB = async () => {
  try {
 
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://vikasprasad2903:O3R7PnVQUr0DZO7g@cluster0.pyizi.mongodb.net/?appName=Cluster0");
    console.log("MongoDB Connected Successfully : shopify.server.js");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.warn("App will run without MongoDB. Fix MONGO_URI in .env to enable DB features.");
    // Don't exit — allow app to run so you can fix credentials or work without DB
  }
};

connectDB();



mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: ApiVersion.January25,
  scopes: ["read_themes", "write_themes"],
  appUrl: process.env.SHOPIFY_APP_URL,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),

  // webhooks: {
  //   APP_UNINSTALLED: {
  //     deliveryMethod: DeliveryMethod.Http,
  //     callbackUrl: "/webhooks",
  //   },
  //   CUSTOMERS_DATA_REQUEST: {
  //     deliveryMethod: DeliveryMethod.Http,
  //     callbackUrl: "/webhooks/customers/data_request",
  //   },
  //   CUSTOMERS_REDACT: {
  //     deliveryMethod: DeliveryMethod.Http,
  //     callbackUrl: "/webhooks/customers/redact",
  //   },
  //   SHOP_REDACT: {
  //     deliveryMethod: DeliveryMethod.Http,
  //     callbackUrl: "/webhooks/shop/redact",
  //   },
  // }, 
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
    afterAuth: async ({ session, billing, req, res }) => {
      const shop = session.shop;
      const accessToken = session.accessToken;
      const scopes = session.scope;

      console.log("🔐 Auth completed for shop:", shop);
      console.log("📋 Granted scopes:", scopes);
      console.log("🔑 Access token present:", !!accessToken);

      // await connectDatabase();

      let store = await Store.findOne({ shop });

      if (store) {
        store.accessToken = accessToken;
        store.updatedAt = new Date();
      } else {
        store = new Store({
          shop,
          accessToken,
        });
      }

      await store.save();
      // console.log("✅ Access token saved to MongoDB for:", shop);

      // Redirect to app home in Shopify admin
      const redirectUrl = `https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/apps/${process.env.SHOPIFY_APP_NAME}`;
      res.redirect(redirectUrl);
    },
  },

  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});



// Export Shopify app utilities
export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

console.log("shopify.server.js loaded successfully ✅");

