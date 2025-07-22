// middlewares/verifyShopifyHmac.js
import { verifyShopifyHmac } from "../utils/verifyhmac.js";

export function hmacMiddleware(req, res, next) {
  const isVerified = verifyShopifyHmac(req.query, process.env.SHOPIFY_API_SECRET);

  if (!isVerified) {
    console.warn("⚠️ HMAC Verification Failed:", req.query);
    return res.status(403).send("HMAC verification failed");
  }

  next();
}
