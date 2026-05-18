// ============================================
// Ridelytics Backend - Global Error Handler
// ============================================
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.path}:`, err.message);

  // SQL Server errors
  if (err.code === 'EREQUEST' || err.code === 'ELOGIN') {
    return res.status(500).json({
      success: false,
      message: 'Database error occurred.',
      error: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
    error: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
}

module.exports = errorHandler;
