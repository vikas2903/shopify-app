// // utils/getShopSession.js

// import { authenticate } from "../shopify.server.js";

// /**
//  * Get shop session details for use in API requests.
//  * Call this from Remix loaders or actions.
//  */
// export async function getShopSession(request) {
//   const { session } = await authenticate.admin(request);

//   if (!session) {
//     throw new Error("No active session found");
//   }

//   const shop = session.shop;
//   const accessToken = session.accessToken;
//   const host = new URL(request.url).searchParams.get("host");

//   return {
//     shop,
//     accessToken,
//     host,
//   };
// }
