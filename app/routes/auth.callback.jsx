import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
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
    await Store.findOneAndUpdate(
      { shop },
      {
        shop,
        accessToken,
        updatedAt: new Date(),
        status: "active",
      },
      { upsert: true, new: true }
    );

    // Create Shopify session
    await authenticate.admin(request);

    // Redirect to the app
    return redirect(`/app?shop=${shop}&host=${host}`);
  } catch (error) {
    console.error("Auth callback error:", error.message);
    throw new Response("Authentication failed", { status: 500 });
  }
}; 