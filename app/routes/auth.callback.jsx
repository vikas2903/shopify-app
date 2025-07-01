// app/routes/auth.callback.jsx
import { json, redirect } from "@remix-run/node";
import axios from "axios";
import qs from "qs"; // 👈 Make sure to install: npm i qs
import Store from "../backend/modals/store.js";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");

  if (!shop || !code) {
    return json({ success: false, message: "Missing shop or code" }, { status: 400 });
  }

  try {
    const tokenUrl = `https://${shop}/admin/oauth/access_token`;

    // ✅ FIX: Shopify expects application/x-www-form-urlencoded
    const payload = qs.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET, // FIXED: use correct env var
      code,
    });

    const tokenResponse = await axios.post(tokenUrl, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = tokenResponse.data.access_token;

    let store = await Store.findOne({ shop });
    if (store) {
      store.accessToken = accessToken;
      store.updatedAt = new Date();
    } else {
      store = new Store({ shop, accessToken, updatedAt: new Date() });
    }

    await store.save();

    const redirectURL = `https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/apps/${process.env.SHOPIFY_APP_NAME}`;
    return redirect(redirectURL);

  } catch (error) {
    console.error("Auth Callback Error:", error.response?.data || error.message);
    return json({
      success: false,
      message: "Failed to process authentication Vs",
      error: error.message,
    }, { status: 500 });
  }
};
