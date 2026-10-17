import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['citizen', 'officer', 'admin'], 
    default: 'citizen' 
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;