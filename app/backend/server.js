import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./database/connect.js";
import Store from "./modals/store.js";

const PORT = process.env.PORT || 3000;
dotenv.config();
connectDatabase();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/save-token", async (req, res) => {
  const { shop, accessToken } = req.body;
  
  if (!shop || !accessToken) {
    return res.status(400).json({ error: "Shop and access token are required" });
  }

  try {
    const store = await Store.findOneAndUpdate(
      { shop },
      { accessToken },
      { upsert: true, new: true }
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
