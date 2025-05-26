import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./database/connect.js";
import Store from "./modals/store.js";
import dashboardroute from "../backend/route.js/dashboardRoutes.js";


const PORT = process.env.PORT || 3000;
dotenv.config();
connectDatabase();


const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.SHOPIFY_APP_URL,
  credentials: true
}));

 app.use("/api", dashboardroute);
// Middleware to validate Shopify requests
const validateShopifyRequest = (req, res, next) => {
  const shop = req.body.shop;
  if (!shop || !shop.endsWith('.myshopify.com')) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid shop domain" 
    });
  }
  next();
};

app.post("/api/save-token", validateShopifyRequest, async (req, res) => {
  const { shop, accessToken } = req.body;
  
  if (!shop || !accessToken) {
    return res.status(400).json({ 
      success: false,
      error: "Shop and access token are required" 
    });
  }

  try {
    const store = await Store.findOneAndUpdate(
      { shop },
      { 
        shop,
        accessToken,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );
    
    res.status(200).json({ 
      success: true,
      message: "Token saved successfully", 
      store 
    });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to save access token" 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// https://shopify-app-7spy.onrender.com/auth/callback?code=36bf19d4a2000529942c3fba77e56439&hmac=35a7dd9dbbd3c3555700e7db8970fce8069df11e7a45054bb3401e5935e993c3&host=YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvcmF2aXN0b3JlLXNob3A&shop=ravistore-shop.myshopify.com&timestamp=1747899343
app.get("/auth/callback", async (req, res) => {
    const { shop, code } = req.query;
  
    if (!shop || !code) {
      return res.status(400).json({ success: false, message: "Missing shop or code" });
    }
  
    try {
      // Step 1: Exchange code for access token
      const tokenUrl = `https://${shop}/admin/oauth/access_token`;
      const payload = {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      };
  
      const tokenResponse = await axios.post(tokenUrl, payload);
      const accessToken = tokenResponse.data.access_token;
  
      // Step 2: Save to MongoDB
      const store = await Store.findOneAndUpdate(
        { shop },
        {
          shop,
          accessToken,
          updatedAt: new Date(),
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
  
      // Step 3: Respond with success
      return res.status(200).json({
        success: true,
        message: "Token saved successfully",
        store,
      });
    } catch (error) {
      console.error("Callback Error:", error.response?.data || error.message);
      return res.status(500).json({ success: false, message: "Failed to save token" });
    }
  });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
