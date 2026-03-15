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

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/progress', progressRoutes);

// Error Handler (must be last middleware)
app.use(errorHandler);

module.exports = app;
