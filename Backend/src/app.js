import express from "express";
const app = express();
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import aiRoutes from './routes/ai.routes.js';
import path from 'path';
import fs from 'fs';
import connectDB from "./db/db.js";
config();

app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(cookieParser());
app.use(cors(
    {
        origin: "*",
        credentials: true
    }
));

app.use('/api/ai', aiRoutes);

// Static serving for generated audio files
const uploadsDir = path.join(process.cwd(), 'uploads');
const voicesDir = path.join(uploadsDir, 'voices');
if (!fs.existsSync(voicesDir)) {
    fs.mkdirSync(voicesDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

export default app;