import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  fee: { type: String, default: 'Free' }, // e.g., 'KES 1,000' or 'Free'
  processingTime: { type: String, default: 'N/A' }, // e.g., '~30 days'
  isActive: { type: Boolean, default: true } // Admin can hide services instead of deleting
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);