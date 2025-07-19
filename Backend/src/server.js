import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import birthdayRoutes from './routes/birthdayRoutes.js'
import authRoutes from './routes/authRoutes.js'
import './routes/utils/scheduler.js'

const app = express();

const allowedOrigins = ["https://pingwish.vercel.app","http://pingwish.vercel.app","https://ping-wish.vercel.app","http://ping-wish.vercel.app"];

app.use(cors({
  origin:allowedOrigins,
  // origin:'http://localhost:5173',
  credentials:true
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/birthdays',birthdayRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Simple route to check server
app.get('/', (req, res) => {
  res.send('Birthday Reminder API running');
});

// TODO: Add birthday routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
