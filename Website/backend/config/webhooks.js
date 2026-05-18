// ============================================
// Ridelytics Backend - n8n Webhook Configuration
// ============================================
const env = require('./env');

const webhooks = {
  chat: {
    url: env.N8N_CHAT_WEBHOOK_URL,
    apiKey: env.N8N_API_KEY,
    timeout: 60000, // 60s — n8n cloud + AI processing can be slow
  },
};

module.exports = webhooks;
