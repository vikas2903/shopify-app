
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const { shop } = req.query;

  if (!shop) {
    return res.status(400).send("Missing shop parameter");
  }

  const redirectUri = `${process.env.HOST}/auth/callback`;
  const scopes = "read_themes,write_themes";
  const installUrl = `https://${shop}/admin/oauth/authorize` +
    `?client_id=${process.env.SHOPIFY_CLIENT_ID}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=123456` + 
    `&grant_options[]=per-user`;

  return res.redirect(installUrl);
});

export default router;
