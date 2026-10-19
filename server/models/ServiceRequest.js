import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    location: {
      subCounty: { type: String, required: true },
      landmark: { type: String, required: true },
    },
    description: { type: String, required: true },
    imageUrl: { type: String, default: null }, // We'll handle image logic later
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("ServiceRequest", serviceRequestSchema);
