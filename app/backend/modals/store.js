import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  installDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Store", storeSchema);
