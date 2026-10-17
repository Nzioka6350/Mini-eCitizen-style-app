import crypto from 'crypto';
global.crypto = crypto;

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = 'admin@muranga.go.ke';
    const password = 'admin123';

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Admin already exists!');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      name: 'System Admin',
      email,
      passwordHash,
      role: 'admin',
    });

    console.log('Admin created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();