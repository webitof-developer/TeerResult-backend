import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import bannerRputes from './routes/bannerRoutes.js';
import contactRoute from './routes/contactRoutes.js';
import adminSettingsRoutes from './routes/adminSettingsRoutes.js';
import dreamRoutes from './routes/dreamRoutes.js';
import { UPLOAD_DIR } from './config/paths.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/banners', bannerRputes);
app.use('/api/contacts', contactRoute);
app.use('/api/adminsettings', adminSettingsRoutes);
app.use('/api/dreams', dreamRoutes);


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
