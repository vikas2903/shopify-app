import { redirect } from "@remix-run/node";
import axios from "axios";
import Store from "../backend/modals/store.js";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  const host = url.searchParams.get("host");

  if (!shop || !code) {
    throw new Response("Missing shop or code", { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // Save store data
    await Store.create({
      shop,
      accessToken,
      updatedAt: new Date(),
      status: "active",
    });

    // Redirect to the app dashboard inside Shopify admin
    return redirect(
      `https://admin.shopify.com/store/${shop.replace(
        ".myshopify.com",
        ""
      )}/apps/${process.env.SHOPIFY_APP_HANDLE}`
    );
  } catch (error) {
    console.error("Auth callback error:", error.message);
    throw new Response("Authentication failed", { status: 500 });
  }
};
