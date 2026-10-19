import mongoose from "mongoose";

const requestHistorySchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    previousStatus: { type: String },
    newStatus: { type: String, required: true },
    note: { type: String }, // Optional note from the officer
  },
  { timestamps: true },
);

export default mongoose.model("RequestHistory", requestHistorySchema);
