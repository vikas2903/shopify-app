// routes/authCallback.js
import express from "express";
import axios from "axios";
import connectDatabase from "../backend/database/connect.js";
import Store from "../backend/modals/store.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res.status(400).send("Missing shop or code");
  }

  try {
    await connectDatabase();

    const tokenUrl = `https://${shop}/admin/oauth/access_token`;
    const payload = {
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    };

    const tokenRes = await axios.post(tokenUrl, payload);
    const accessToken = tokenRes.data.access_token;

    let store = await Store.findOne({ shop });

    if (store) {
      store.accessToken = accessToken;
      store.updatedAt = new Date();
    } else {
      store = new Store({ shop, accessToken });
    }

    await store.save();
    console.log(`✅ Access token stored for ${shop}`);

    const redirectURL = `https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/apps/${process.env.SHOPIFY_APP_NAME}`;
    return res.redirect(redirectURL);
  } catch (err) {
    console.error("OAuth error:", err.response?.data || err.message);
    return res.status(500).send("OAuth callback error");
  }
});

export default router;
