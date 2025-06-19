// app/routes/webhooks.customers.redact/route.js
import { shopify } from "../../shopify.server.js";

export const action = async ({ request }) => {
  return shopify.webhooks.process(request);
};

export const loader = async () => {
  return new Response("Customer Redact Webhook OK", { status: 200 });
};
