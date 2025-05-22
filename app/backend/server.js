import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./database/connect.js";
import Store from "./modals/store.js";

const PORT = process.env.PORT || 3000;
dotenv.config();
connectDatabase();

const app = express();
app.use(express.json());

app.post("/api/save-token", async (req, res) => {
  const { shop, accessToken } = req.body;
  try {
    const store = Store.findOneAndUpdate(
      { shop },
      { accessToken },
      { upsert: true, new: true },
    );
    res.status(200).json({ message: "Token Saved", store });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Pta nahi kaha Error h :)" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
