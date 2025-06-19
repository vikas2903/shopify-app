// app/routes/webhooks.shop.redact/route.js
import { shopify } from "../../shopify.server.js";

export const action = async ({ request }) => {
  return shopify.webhooks.process(request);
};

export const loader = async () => {
  return new Response("Shop Redact Webhook OK", { status: 200 });
};
