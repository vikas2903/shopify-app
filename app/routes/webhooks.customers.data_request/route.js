// app/routes/webhooks.customers.data_request/route.js
import { shopify } from "../../shopify.server.js";

export const action = async ({ request }) => {
  return shopify.webhooks.process(request);
};

export const loader = async () => {
  return new Response("Customer Data Request Webhook OK", { status: 200 });
};
