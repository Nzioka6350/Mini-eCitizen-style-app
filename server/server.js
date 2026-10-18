import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
// Safely polyfill crypto for local Node 20 without crashing Vercel Node 24
try {
  if (!global.crypto) {
    global.crypto = crypto;
  }
} catch (e) {
  // Ignore if it's read-only (like on Vercel)
}

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; 
import subCountyRoutes from './routes/subCountyRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// We allow your production frontend, preview frontends, and localhost
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://192.168.0.108:3000',
  'http://192.168.0.108:5173',
  'https://mini-e-citizen-style-app-rfii.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list OR if it's a Vercel preview URL for this project
    if (allowedOrigins.includes(origin) || origin.includes('mini-e-citizen-style-app-rfii')) {
      return callback(null, true);
    }
    
    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/subcounties', subCountyRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Only listen locally, Vercel handles the server in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server started on port ${port}`));
}

export default app;