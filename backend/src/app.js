const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Route modules
const healthRoutes = require('./modules/health/routes');
const authRoutes = require('./modules/auth/routes');
const subjectsRoutes = require('./modules/subjects/routes');
const videosRoutes = require('./modules/videos/routes');
const progressRoutes = require('./modules/progress/routes');
const aiRoutes = require('./modules/ai/routes');

const app = express();

// Middlewares
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  'https://learnflow-eta.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests, or some preflight)
      if (!origin) return callback(null, true);
      
      const allOrigins = [...new Set([...allowedOrigins, ...defaultOrigins])];
      
      if (allOrigins.includes('*')) return callback(null, true);
      if (allOrigins.includes(origin)) return callback(null, true);
      
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

// Error Handler (must be last middleware)
app.use(errorHandler);

module.exports = app;
