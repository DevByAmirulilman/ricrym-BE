import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { uuid } from 'uuidv4';
import connectToDatabase from './config/db.js';
import Account from './models/Account.js';
import Character from './models/Character.js';
import Scores from './models/Scores.js';
import Session from './models/SessionSchema.js';
import bcrypt from 'bcrypt';
import authRoutes from './routes/auth.js'
import accountRoutes from './routes/account.js'
import characterRoutes from './routes/characters.js'
import scoresRoutes from './routes/scores.js'
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
connectToDatabase();

//router middleware
app.use('/api/', authRoutes)
app.use('/api/', accountRoutes)
app.use('/api/', characterRoutes)
app.use('/api/', scoresRoutes)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
