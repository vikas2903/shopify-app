import { redirect } from "@remix-run/node";
import axios from "axios";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  const host = url.searchParams.get("host");

  if (!shop || !code) {
    throw new Response("Missing shop & code", { status: 404 });
  }

  try {
    const tokenResponse = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code: code,
      },
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    await axios.post(`${process.env.BACKEND_URL}/api/save-token`, {
      shop,
      accessToken,
    });

    return redirect(`/?shop=${shop}&host=${host}`);
  } catch (error) {
    console.error("Error in callback:", error.message);
    throw new Response("Failed to process authentication", { status: 500 });
  }
};
