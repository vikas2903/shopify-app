import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  // BillingInterval,
  DeliveryMethod

} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

import axios from "axios";
import Store from "./backend/modals/store.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import dashboardroute from "./backend/route/dashboardRoutes.js";
// import { getDashboardData } from "./backend/controller/dashboardController.js";
// import { json } from "@remix-run/node";
// import { getShopSession } from "./backend/getShopSession.js";
import gdprRouter  from './webhooks/gdprWebhooks.js';

// Load environment variables
dotenv.config();
const app = express();


// app.use("/webhooks", express.raw({ type: "application/json" }), gdprRouter);


app.use("/webhooks", gdprRouter);
app.use(express.json());
app.use(cors());

console.log(">>> Hit /webhooks/shop/redact route");
// export const MONTHLY_PLAN = 'Monthly subscription';
// export const ANNUAL_PLAN = 'Annual subscription';


// Webhook

 




// Webhook
// export const loader = async ({ request }) => {
//   const { shop, accessToken, host } = await getShopSession(request);

//   console.log("Shop vs:", shop);
//   console.log("Token:", accessToken);

//   return json({
//     shop,
//     host,
//   });
// };

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// console.log(getDashboardData);
connectDB();

app.get("/auth/callback", async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res
      .status(400)
      .json({ success: false, message: "Missing shop or code" });
  }

  try {
    if (!process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) {
      throw new Error("Shopify credentials are not properly configured");
    }

    const tokenUrl = `https://${shop}/admin/oauth/access_token`;
    const payload = {
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    };

    const tokenResponse = await axios.post(tokenUrl, payload);
    const accessToken = tokenResponse.data.access_token;

    console.log("Access Token received successfully");

    // Check if store already exists
    let store = await Store.findOne({ shop });

    if (store) {
      // Update existing store
      store.accessToken = accessToken;
      store.updatedAt = new Date();
      console.log(`Updating existing store: ${shop}`);
    } else {
      // Create new store
      store = new Store({
        shop,
        accessToken,
        updatedAt: new Date(),
      });
      console.log(`Creating new store: ${shop}`);
    }

    await store.save();
    console.log(`Store ${shop} saved successfully`);

    if (!process.env.SHOPIFY_APP_NAME) {
      throw new Error(
        "SHOPIFY_APP_NAME is not defined in environment variables",
      );
    }

    const redirectURL = `https://admin.shopify.com/store/${shop.replace(
      ".myshopify.com",
      "",
    )}/apps/${process.env.SHOPIFY_APP_NAME}`;

    console.log("Redirecting to:", redirectURL);
    return res.redirect(redirectURL);
  } catch (error) {
    console.error("Callback Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to process authentication",
      error: error.message,
    });
  }
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(",") || [],
  appUrl: process.env.SHOPIFY_APP_URL,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),

  // billing: {
  //   [MONTHLY_PLAN]: {
  //     amount: 10,
  //     currencyCode: "USD",
  //     interval: BillingInterval.Every30Days,
  //   },
  //   [ANNUAL_PLAN]: {
  //     amount: 100,
  //     currencyCode: "USD",
  //     interval: BillingInterval.Annual,
  //   },
  // },


  // Appennded this code for webhook
  // webhooks: {
  //   SHOP_REDACT: {
  //     deliveryMethod: DeliveryMethod.Http,
  //     callbackUrl: "/webhooks/shop/redact",
  //     callback: async (topic, shop, body) => {
  //       console.log("Webhook received [SHOP_REDACT]:", shop, body);
  //     },
  //   },

  //   CUSTOMERS_REDACT: {
  //     deliveryMethod: DeliveryMethod.Http,
  //     callbackUrl: "/webhooks/customers/redact",
  //     callback: async (topic, shop, body) => {
  //       console.log("Webhook received [CUSTOMERS_REDACT]:", shop, body);
  //     },
  //   },

  //   CUSTOMERS_DATA_REQUEST: {
  //     deliveryMethod: DeliveryMethod.Http,
  //     callbackUrl: "/webhooks/customers/data_request",
  //     callback: async (topic, shop, body) => {
  //       console.log("Webhook received [CUSTOMERS_DATA_REQUEST]:", shop, body);
  //     },
  //   },
  // },

 webhooks: {
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/webhooks/shop/redact",
    callback: async (topic, shop, body) => {
      console.log("SHOP_REDACT webhook received:");
      console.log("Shop:", shop);
      console.log("Body:", body);
    },
  },

  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/webhooks/customers/redact",
    callback: async (topic, shop, body) => {
      console.log("CUSTOMERS_REDACT webhook received:");
      console.log("Shop:", shop);
      console.log("Body:", body);
    },
  },

  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/webhooks/customers/data_request",
    callback: async (topic, shop, body) => {
      console.log("CUSTOMERS_DATA_REQUEST webhook received:");
      console.log("Shop:", shop);
      console.log("Body:", body);
    },
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

// Start Express server if not in test environment
if (process.env.NODE_ENV !== "test") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log("Working Properly.. digisidekick 01");
  });
}



