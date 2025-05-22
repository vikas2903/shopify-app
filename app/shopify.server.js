import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

import Store from './backend/modals/store.js'

import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

 mongoose.connect('mongodb+srv://vikasprasad2903:fkkbpuJg7iHm7dB4@cluster0.nq7t1.mongodb.net/',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("MongoDB Connected Successfully");

// app.get("/auth/callback", async (req, res) => {
//   const { shop, code } = req.query;

//   console.log("shop", shop);
//   console.log("code", code);

//   if (!shop || !code) {
//     return res.status(400).json({ success: false, message: "Missing shop or code" });
//   }

//   try {
//     // Step 1: Exchange code for access token
//     const tokenUrl = `https://${shop}/admin/oauth/access_token`;
//     const payload = {
//       client_id: '7e14cea35d331d8a859a3d97b6b76175',
//       client_secret: 'e4ffba4176a93186f92eeccdff913d56',
//       code,
//     };

//     const tokenResponse = await axios.post(tokenUrl, payload);
//     console.log(tokenResponse);

//     const accessToken = tokenResponse.data.access_token;
//     console.log(accessToken);

//     // Step 2: Save a new store entry (no update)
//     const store = new Store({
//       shop,
//       accessToken,
//       updatedAt: new Date(),
//     });

//     await store.save(); // Save to MongoDB

//     // Step 3: Return success response
//     return res.status(200).json({
//       success: true,
//       message: "Token saved successfully",
//       store,
//     });
//   } catch (error) {
//     console.error("Callback Error:", error.response?.data || error.message);
//     return res.status(500).json({ success: false, message: "Failed to save token" });
//   }
// });

app.get("/auth/callback", async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res.status(400).json({ success: false, message: "Missing shop or code" });
  }

  try {
    const tokenUrl = `https://${shop}/admin/oauth/access_token`;
    const payload = {
      client_id: '7e14cea35d331d8a859a3d97b6b76175',
      client_secret: 'e4ffba4176a93186f92eeccdff913d56',
      code,
    };

    const tokenResponse = await axios.post(tokenUrl, payload);
    const accessToken = tokenResponse.data.access_token;

    const store = new Store({
      shop,
      accessToken,
      updatedAt: new Date(),
    });

    await store.save();

    // ✅ Redirect to your embedded app inside Shopify Admin
    const redirectURL = `https://admin.shopify.com/store/${shop.replace(
      ".myshopify.com",
      ""
    )}/apps/${process.env.SHOPIFY_APP_HANDLE}`;

    return res.redirect(redirectURL); // This sends the merchant to your app in Shopify admin

  } catch (error) {
    console.error("Callback Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Failed to save token" });
  }
});


mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
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



