// import crypto from 'crypto';

// /**
//  * Verifies Shopify webhook HMAC signature
//  */
// export function isValidShopifyWebhook(req) {
//   const hmacHeader = req.headers['x-shopify-hmac-sha256'];
//   const secret = process.env.SHOPIFY_API_SECRET;

//   if (!hmacHeader || !secret || !Buffer.isBuffer(req.body)) {
//     return false;
//   }

//   const generatedHmac = crypto
//     .createHmac('sha256', secret)
//     .update(req.body)
//     .digest('base64');

//   const hmacBuffer = Buffer.from(hmacHeader, 'utf8');
//   const generatedBuffer = Buffer.from(generatedHmac, 'utf8');

//   if (hmacBuffer.length !== generatedBuffer.length) {
//     return false;
//   }

//   return crypto.timingSafeEqual(hmacBuffer, generatedBuffer);
// }
