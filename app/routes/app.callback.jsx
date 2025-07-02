// import { redirect } from "@remix-run/node";
// import axios from "axios";
// import { authenticate } from "../shopify.server";

// export const loader = async ({ request }) => {
//   const url = new URL(request.url);
//   const shop = url.searchParams.get("shop");
//   const code = url.searchParams.get("code");
//   const host = url.searchParams.get("host");

//   if (!shop || !code) {
//     throw new Response("Missing shop & code", { status: 404 });
//   }

//   try {
//     // Exchange the code for an access token
//     const tokenResponse = await axios.post(
//       `https://${shop}/admin/oauth/access_token`,
//       {
//         client_id: process.env.SHOPIFY_API_KEY,
//         client_secret: process.env.SHOPIFY_API_SECRET,
//         code: code,
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;

//     if (!accessToken) {
//       throw new Error("Failed to get access token");
//     }

//     // Save the token to your backend
//     await axios.post(`${process.env.BACKEND_URL}/api/save-token`, {
//       shop,
//       accessToken,
//     });

//     // Create a session using Shopify's authenticate helper
//     await authenticate.admin(request);

//     // Redirect to the app with the necessary parameters
//     return redirect(`/app?shop=${shop}&host=${host}`);
//   } catch (error) {
//     console.error("Error in callback:", error.message);
//     throw new Response("Failed to process authentication", { status: 500 });
//   }
// };

// import { redirect } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// import axios from "axios";

// export const loader = async ({ request }) => {
//   try {
//     // Authenticate and create session
//     const { session } = await authenticate.admin(request);

//     // Get shop and access token from session
//     const shop = session.shop;
//     const accessToken = session.accessToken;

//     // Save to your own DB via your backend API
//     await axios.post(`${process.env.BACKEND_URL}/api/save-token`, {
//       shop,
//       accessToken,
//     });

//     // Get host from URL (optional)
//     const url = new URL(request.url);
//     const host = url.searchParams.get("host");

//     // Redirect back to your app dashboard
//     return redirect(`/app?shop=${shop}&host=${host}`);
//   } catch (error) {
//     console.error("Error in auth callback:", error);
//     throw new Response("Failed to process authentication", { status: 500 });
//   }
// };


import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server.js";
import Store from "../backend/modals/store.js";
import mongoose from "mongoose";

export const loader = async ({ request }) => {
  try {
    // Authenticate and create session
    const { session } = await authenticate.admin(request);

    // Get shop and token from session
    const shop = session.shop;
    const accessToken = session.accessToken;

    // Connect DB (if not already connected)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Check if store exists
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

    // Redirect back to app in Shopify Admin
    const redirectUrl = `https://admin.shopify.com/store/${shop.replace(
      ".myshopify.com",
      ""
    )}/apps/${process.env.SHOPIFY_APP_NAME}`;

    return redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Error in auth callback:", error);
    throw new Response("Failed to complete authentication vs:001", { status: 500 });
  }
};
