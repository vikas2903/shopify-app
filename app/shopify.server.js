import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import express from 'express';
import fetch from 'node-fetch';

const router = express();

router.get("/auth/callback", async (req, res) => {
  const { shop, code } = req.query;
console.log(code);
console.log(shop);
  if (!shop || !code) {
    return res.status(400).send("Missing shop or code");
  }

  try {
    // ✅ Correct query string and removed body
    const backendResponse = await fetch(
      `https://shopify-wishlist-app-mu3m.onrender.com/api/auth/callback?shop=${shop}&code=${code}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error("Backend error:", result);
      return res.status(500).send("Failed to exchange token");
    }

    return res.redirect(result.redirectUrl);
  } catch (error) {
    console.error("Frontend Callback Error:", error.message);
    res.status(500).send("Something went wrong during callback");
  }
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

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;


