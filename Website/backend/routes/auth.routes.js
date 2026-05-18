// ============================================
// Ridelytics Backend - Auth Routes
// ============================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { sanitizeInputs } = require('../middleware/validator');

router.post('/login', authLimiter, sanitizeInputs, authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
