import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fee: { type: String, default: "Free" },
    processingTime: { type: String, default: "N/A" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Service", serviceSchema);
