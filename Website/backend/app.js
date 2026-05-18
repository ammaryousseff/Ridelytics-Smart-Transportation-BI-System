// ============================================
// Ridelytics Backend - Express Application
// Smart Transportation BI System
// ============================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const logger = require('./utils/logger');
const { getPool, closePool } = require('./config/database');
const seedAdmin = require('./utils/seedAdmin');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const crudRoutes = require('./routes/crud.routes');
const chatRoutes = require('./routes/chat.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// ── Security & Middleware ─────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// ── Public Routes ─────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Protected Routes (require JWT) ────────────
app.use('/api/crud', authMiddleware, crudRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);

// ── 404 Handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ── Error Handler ─────────────────────────────
app.use(errorHandler);

// ── Server Startup ────────────────────────────
async function startServer() {
  try {
    // Connect to SQL Server
    logger.info('Connecting to SQL Server...');
    await getPool();

    // Seed admin user
    await seedAdmin();

    // Start Express
    app.listen(env.PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════╗
║    🚗  Ridelytics API Server Running         ║
║    📍  http://localhost:${env.PORT}               ║
║    📊  Database: ${env.DB_DATABASE}         ║
║    🔐  Auth: Windows Authentication          ║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

startServer();

module.exports = app;
