import crypto from 'crypto';
global.crypto = crypto;

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SubCounty from './models/SubCounty.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const names = ['Kiharu', 'Kangema', 'Mathioya', 'Kigumo', 'Kandara', 'Gatanga', 'Maragwa', "Murang'a South (Kambiti)"];

  for (const name of names) {
    const exists = await SubCounty.findOne({ name });
    if (!exists) {
      await SubCounty.create({ name });
      console.log('Added:', name);
    } else {
      console.log('Skipped (exists):', name);
    }
  }

  console.log('Done.');
  process.exit();
};

seed();