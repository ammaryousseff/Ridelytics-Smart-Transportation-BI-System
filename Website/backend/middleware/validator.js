// ============================================
// Ridelytics Backend - Input Validation Helpers
// ============================================

/**
 * Validate required fields in request body
 */
function validateRequired(fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => {
      const val = req.body[f];
      return val === undefined || val === null || val === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }
    next();
  };
}

/**
 * Validate email format
 */
function validateEmail(req, res, next) {
  const { email } = req.body;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format.',
    });
  }
  next();
}

/**
 * Sanitize string inputs (trim whitespace)
 */
function sanitizeInputs(req, res, next) {
  if (req.body) {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = value.trim();
      }
    }
  }
  next();
}

module.exports = { validateRequired, validateEmail, sanitizeInputs };
