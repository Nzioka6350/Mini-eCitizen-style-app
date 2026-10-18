import crypto from 'crypto';
global.crypto = crypto; 

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; 
import subCountyRoutes from './routes/subCountyRoutes.js';
connectDB();


const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://192.168.0.108:3000',
  'http://192.168.0.108:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/services', serviceRoutes);
app.use('/api/subcounties', subCountyRoutes);

//Test backend is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Only listen locally, Vercel handles the server in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server started on port ${port}`));
}

// app.listen(port, () => console.log(`Server started on port ${port}`));
export default app;