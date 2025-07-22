// import crypto from 'crypto';
// import { json } from '@remix-run/node';

// export const action = async ({ request }) => {
//   const secret = process.env.SHOPIFY_API_SECRET;
//   const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
//   const rawBody = await request.text();

//   const digest = crypto
//     .createHmac("sha256", secret)
//     .update(rawBody, "utf8")
//     .digest("base64");

//   const verified = crypto.timingSafeEqual(
//     Buffer.from(hmacHeader, "base64"),
//     Buffer.from(digest, "base64")
//   );

//   if (!verified) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const payload = JSON.parse(rawBody);
//   console.log("✅ CUSTOMER DATA REQUEST WEBHOOK:", payload);

//   return json({ success: true });
// };
 
import crypto from 'crypto';
import { json } from '@remix-run/node';

export const loader = async ({ request }) => {
  try {
    const secret = process.env.SHOPIFY_API_SECRET;
    
    // Get the HMAC from the request header
    const hmac = request.headers.get('X-Shopify-Hmac-Sha256');

    // If HMAC is not found, return an error
    if (!hmac) {
      return new Response('HMAC header missing', { status: 400 });
    }

    // Get the raw request body (the payload)
    const raw = await request.text();

    // Create the HMAC hash using the raw body and Shopify secret
    const digest = crypto
      .createHmac('sha256', secret)
      .update(raw, 'utf8')
      .digest('base64');

    // Verify the HMAC signature
    const verified = crypto.timingSafeEqual(
      Buffer.from(hmac, 'base64'),
      Buffer.from(digest, 'base64')
    );

    // If the HMAC is invalid, return an error
    if (!verified) {
      return new Response('HMAC invalid', { status: 401 });
    }

    // If HMAC is valid, process the payload 
    const payload = JSON.parse(raw);
    console.log('Webhook data:', payload);

    return json({ message: 'Webhook verified successfully' });
  } catch (error) {
    console.error('Error during HMAC verification:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
