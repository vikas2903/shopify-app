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
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Add middleware to update the updatedAt field before saving
storeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Store || mongoose.model("Store", storeSchema);

// export default mongoose.model("Store", storeSchema); 



