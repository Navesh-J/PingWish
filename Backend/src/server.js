import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


import birthdayRoutes from './routes/birthdayRoutes.js'
import './routes/utils/scheduler.js'

const app = express();
app.use(cors());
app.use(express.json());

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
