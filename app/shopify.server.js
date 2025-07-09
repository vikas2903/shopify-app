import dotenv from "dotenv";

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
// import axios from "axios";
import Store from "./backend/modals/store.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import crypto from "crypto";

import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
// import connectDatabase from "./backend/database/connect.js";



// import dashboardroute from "./backend/route/dashboardRoutes.js";
// import { getDashboardData } from "./backend/controller/dashboardController.js";
// import { getShopSession } from "./backend/getShopSession.js";

// Load environment variables

const app = express();

app.use("/webhooks", express.raw({ type: "*/*" }));
// app.use(express.json());
// Serve the uploads folder

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


 
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


const sigHeaderName = "X-Shopify-Hmac-Sha256";
const sigHashAlg = "sha256";
const secret = process.env.SHOPIFY_API_SECRET;

// Perform HMAC verification
function authenticateSignature(req, res, next) {
  if (req.method !== "POST") {
    return next("Request must be POST");
  }

  if (!req.rawBody) {
    return next("Request body empty");
  }

  const body = req.rawBody;
  const hmacHeader = req.get(sigHeaderName);

  // Create a hash based on the parsed body
  const hash = crypto
    .createHmac(sigHashAlg, secret)
    .update(body, "utf8", "hex")
    .digest("base64");

  // Compare the created hash with the value of the X-Shopify-Hmac-Sha256 Header
  if (hash !== hmacHeader) {
    return res.status(401).send({
      message: `Request body digest (${hash}) did not match ${sigHeaderName} (${hmacHeader})`,
    });
  }

  return next();
}

app.use("/webhooks", authenticateSignature);

// export const MONTHLY_PLAN = "Monthly subscription";
// export const ANNUAL_PLAN = "Annual subscription";

// export const loader = async ({ request }) => {
//   const { shop, accessToken, host } = await getShopSession(request);

//   console.log("Shop vs:", shop);
//   console.log("Token:", accessToken);
//   console.log("Digisidekick....")

//   return json({
//     shop,
//     host,
//   });
// };

function verifyHmac(rawBody, hmacHeader, secret) {
  const generatedHmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedHmac, "base64"),
      Buffer.from(hmacHeader, "base64"),
    );
  } catch {
    return false;
  }
}

app.post("/webhooks/customers/data_request", (req, res) => {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  if (!verifyHmac(req.body, hmac, process.env.SHOPIFY_API_SECRET)) {
    console.log("❌ Invalid HMAC - data_request");
    return res.status(401).send("Unauthorized");
  }

  const payload = JSON.parse(req.body.toString("utf8"));
  console.log("📦 Customer data request webhook:", payload);
  res.sendStatus(200);
});

// 4️⃣ GDPR: Customer redact
app.post("/webhooks/customers/redact", (req, res) => {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  if (!verifyHmac(req.body, hmac, process.env.SHOPIFY_API_SECRET)) {
    console.log("❌ Invalid HMAC - customers/redact");
    return res.status(401).send("Unauthorized");
  }

  const payload = JSON.parse(req.body.toString("utf8"));
  console.log("🧹 Customer redact webhook:", payload);
  res.sendStatus(200);
});

// 5️⃣ GDPR: Shop redact
app.post("/webhooks/shop/redact", (req, res) => {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  if (!verifyHmac(req.body, hmac, process.env.SHOPIFY_API_SECRET)) {
    console.log("❌ Invalid HMAC - shop/redact");
    return res.status(401).send("Unauthorized");
  }

  const payload = JSON.parse(req.body.toString("utf8"));
  console.log("🏪 Shop redact webhook:", payload);
  res.sendStatus(200);
});

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully : shopify.server.js");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
// console.log(getDashboardData);
connectDB();

// app.get("/auth/callback", async (req, res) => {
//   const { shop, code } = req.query;

//   if (!shop || !code) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Missing shop or code" });
//   }

//   try {
//     if (!process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) {
//       throw new Error("Shopify credentials are not properly configured");
//     }

//     const tokenUrl = `https://${shop}/admin/oauth/access_token`;
//     const payload = {
//       client_id: process.env.SHOPIFY_CLIENT_ID,
//       client_secret: process.env.SHOPIFY_CLIENT_SECRET,
//       code,
//     };

//     const tokenResponse = await axios.post(tokenUrl, payload);
//     const accessToken = tokenResponse.data.access_token;

//     console.log("Access Token received successfully");

//     // Check if store already exists
//     let store = await Store.findOne({ shop });

//     if (store) {
//       // Update existing store
//       store.accessToken = accessToken;
//       store.updatedAt = new Date();
//       console.log(`Updating existing store: ${shop}`);
//     } else {
//       // Create new store
//       store = new Store({
//         shop,
//         accessToken,
//         updatedAt: new Date(),
//       });
//       console.log(`Creating new store: ${shop}`);
//     }

//     await store.save();
//     console.log(`Store ${shop} saved successfully`);

//     if (!process.env.SHOPIFY_APP_NAME) {
//       throw new Error(
//         "SHOPIFY_APP_NAME is not defined in environment variables",
//       );
//     }

//     const redirectURL = `https://admin.shopify.com/store/${shop.replace(
//       ".myshopify.com",
//       "",
//     )}/apps/${process.env.SHOPIFY_APP_NAME}`;

//     console.log("Redirecting to:", redirectURL);
//     return res.redirect(redirectURL);
//   } catch (error) {
//     console.error("Callback Error:", error.response?.data || error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to process authentication",
//       error: error.message,
//     });
//   }
// });

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

  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/customers/data_request",
    },
    CUSTOMERS_REDACT: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/customers/redact",
    },
    SHOP_REDACT: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/shop/redact",
    },
  },
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
    afterAuth: async ({ session, billing, req, res }) => {
      const shop = session.shop;
      const accessToken = session.accessToken;

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
      console.log("✅ Access token saved to MongoDB for:", shop);

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
console.log("shopify.server.js loaded successfully 01");


// Start Express server if not in test environment
// if (process.env.NODE_ENV !== "development") {
//  const port = process.env.PORT || 1080;
//   app.listen(port, () => {
//     console.log("Endpoint: http://localhost:" + port);
//   });
// }

// app.listen(process.env.PORT || 3000, () => {
//   console.log("✅ Server running");
// });

// Start Express server unless running in test environment

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });
