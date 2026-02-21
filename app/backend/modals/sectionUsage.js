import mongoose from "mongoose";

const sectionUsageSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
    index: true,
  },
  sectionKey: {
    type: String,
    required: true,
    index: true,
  },
  themeId: {
    type: String,
    required: true,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
});

// One record per shop per section (latest upload wins; we can also support multiple if needed)
sectionUsageSchema.index({ shop: 1, sectionKey: 1 }, { unique: true });

export default mongoose.models.SectionUsage || mongoose.model("SectionUsage", sectionUsageSchema);
