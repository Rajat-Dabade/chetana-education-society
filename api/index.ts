import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import routes
import authRoutes from '../apps/api/src/routes/auth';
import blogRoutes from '../apps/api/src/routes/blogs';
import newsRoutes from '../apps/api/src/routes/news';
import impactRoutes from '../apps/api/src/routes/impact';
import galleryRoutes from '../apps/api/src/routes/gallery';
import uploadRoutes from '../apps/api/src/routes/upload';
import settingsRoutes from '../apps/api/src/routes/settings';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://chetana-education-society-api.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle root API request
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Chetana Education Society API',
    version: '1.0.0',
    endpoints: ['/auth', '/blogs', '/news', '/impact', '/gallery', '/upload', '/settings']
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export for Vercel
export default app;
