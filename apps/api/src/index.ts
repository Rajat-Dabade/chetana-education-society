import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth';
import impactRoutes from './routes/impact';
import newsRoutes from './routes/news';
import blogRoutes from './routes/blogs';
import galleryRoutes from './routes/gallery';
import uploadRoutes from './routes/upload';
import settingsRoutes from './routes/settings';
import { setupDatabase } from './startup';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy for Railway deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://chetana-education-society-api.vercel.app',
      'https://*.vercel.app',
      'https://*.netlify.app',
      'https://*.netlify.com',
      'https://chetana-education-society.netlify.app'
    ];
    
    // Allow IP addresses (for VPS deployment without domain)
    const isIPAddress = /^http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin);
    
    // Check if origin matches allowed patterns or is an IP address
    if (allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return allowed === origin;
    }) || isIPAddress) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting - More generous for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes'
  }
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for POST/PUT/DELETE
  message: {
    error: 'Too many requests for this action, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Temporarily disable rate limiting for testing
// app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes  
app.use('/api/auth', authRoutes); // Removed rate limiting for testing
app.use('/api/impact', impactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes); // Removed rate limiting for testing
app.use('/api/settings', settingsRoutes);

// API root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Chetana Education Society API',
    version: '1.0.0',
    status: 'Running on Railway',
    endpoints: ['/auth', '/blogs', '/news', '/impact', '/gallery', '/upload', '/settings', '/health']
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND'
    }
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Set up database on startup
  await setupDatabase();
});
