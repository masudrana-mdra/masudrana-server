import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoose from 'mongoose';
import validatedEnv from './env.js';

// BSON Compatibility Check - Must run first to prevent serialization issues
import { initBSONCompat } from './utils/bsonCompat.js';
try {
  initBSONCompat();
} catch (err) {
  console.error('BSON initialization failed:', err.message);
  process.exit(1);
}

// Run Zod environment variables validation before anything else

import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { getAuth } from './lib/auth.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import configRoutes from './routes/configRoutes.js';

// Load env vars for local scripts. Render injects these at runtime.
dotenv.config();

// Connect to database (starts background connection pool with retries)
connectDB().catch((err) => {
  console.error('Initial MongoDB connection failed:', err.message);
});

const app = express();

// Set security HTTP headers with custom CSP options for Better Auth redirects
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://*", "http://localhost:*"],
      frameAncestors: ["'self'", ...validatedEnv.CLIENT_URL.split(',').map((url) => url.trim()).filter(Boolean)],
    },
  },
}));

// Compression middleware
app.use(compression());

// Disable Caching for API endpoints to prevent stale dashboards/unauthorized responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Structured JSON Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      })
    );
  });
  next();
});

// Request Timeout Middleware (30 seconds)
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    if (!res.headersSent) {
      res.status(503).json({ success: false, message: 'Request timed out' });
    }
  });
  next();
});

// Database connection health guard
app.use((req, res, next) => {
  if (req.path === '/api/health') return next(); // Exclude health check from guard
  if (mongoose.connection.readyState < 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently unavailable. Please try again later.',
    });
  }
  next();
});

// Enable CORS
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  ...validatedEnv.CLIENT_URL.split(',').map((url) => url.trim()).filter(Boolean),
]);

const isAllowedVercelPreview = (origin) => {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === 'https:' && hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin) || isAllowedVercelPreview(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// Health Check Endpoint (Render monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Better Auth route handler using Express Router  
const authRouter = express.Router();

authRouter.all('*', async (req, res, next) => {
  try {
    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('[Better Auth] Database not connected');
      return res.status(503).json({
        success: false,
        message: 'Database connection failed',
      });
    }

    const auth = await getAuth();
    
    // Get the path relative to /api/auth
    const path = req.path || '/';
    
    console.log(`[Better Auth] ${req.method} ${path}`);
    
    // Route to appropriate auth.api methods for simple endpoints
    if (path === '/session' && req.method === 'GET') {
      console.log('[Better Auth] Using auth.api.getSession()');
      const session = await auth.api.getSession({ headers: req.headers });
      return res.json(session);
    } else if (path === '/sign-out' && req.method === 'POST') {
      console.log('[Better Auth] Using auth.api.signOut()');
      const result = await auth.api.signOut({ headers: req.headers });
      return res.json(result);
    } else {
      // For all other routes, use toNodeHandler
      console.log(`[Better Auth] Using toNodeHandler for ${req.method} ${path}`);
      
      const { toNodeHandler } = await import('better-auth/node');
      const handler = toNodeHandler(auth);
      return handler(req, res);
    }
  } catch (error) {
    console.error('[Better Auth] Error:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Authentication service unavailable',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
});

// Mount auth router at /api/auth
app.use('/api/auth', authRouter);

// Body parsers (AFTER Better Auth handler)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Basic rate limiting for API endpoints (excluding auth to prevent OAuth state blocks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// Mount routers (Better Auth handles /api/auth/*, so custom auth routes would conflict)
// Only use custom authRoutes for non-Better-Auth endpoints if needed
// app.use('/api/auth', authRoutes);  // DISABLED: Better Auth handles all /api/auth/* routes
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/config', configRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Masud Rana Portfolio API is running...',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Centralized error handler
app.use(errorHandler);

// Listen unconditionally (for persistent Render instance)
const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT.`);
    process.exitCode = 1;
    server.close();
    return;
  }
  console.error(error);
  process.exitCode = 1;
  server.close();
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // In production, log and restart gracefully if needed
});

export default app;


