// utils/verifyHmac.js
// import crypto from "crypto";
// import { URLSearchParams } from "url";

// export function verifyShopifyHmac(query, shopifySecret) {
//   const { hmac, signature, ...params } = query;

//   const message = Object.keys(params)
//     .sort()
//     .map((key) => `${key}=${Array.isArray(params[key]) ? params[key].join(',') : params[key]}`)
//     .join("&");

//   const generatedHmac = crypto
//     .createHmac("sha256", shopifySecret)
//     .update(message)
//     .digest("hex");

//   return generatedHmac === hmac;
// }



import crypto from "crypto";

function verifyShopifyHmac(params, secret) {
  const { hmac, ...rest } = params;

  const message = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${Array.isArray(rest[key]) ? rest[key][0] : rest[key]}`)
    .join("&");

  const generatedHmac = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(generatedHmac, "utf-8"),
    Buffer.from(hmac, "utf-8")
  );
}


export default verifyShopifyHmac;