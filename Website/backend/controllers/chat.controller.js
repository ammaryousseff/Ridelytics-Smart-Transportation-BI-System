// ============================================
// Ridelytics Backend - Chat Controller
// ============================================
const chatService = require('../services/chat.service');

async function sendMessage(req, res, next) {
  try {
    const { message, language } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }
    const result = await chatService.sendMessage(message, language || 'en');
    // Return the full structured response from n8n
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { sendMessage };
