// ============================================
// Ridelytics Backend - Environment Configuration
// ============================================
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default-dev-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // SQL Server
  DB_SERVER: process.env.DB_SERVER || 'localhost',
  DB_DATABASE: process.env.DB_DATABASE || 'RidelyticsOLTP',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 1433,
  DB_TRUST_CERT: process.env.DB_TRUST_CERT === 'true',

  // n8n
  N8N_CHAT_WEBHOOK_URL: process.env.N8N_CHAT_WEBHOOK_URL || 'http://localhost:5678/webhook/chat',
  N8N_API_KEY: process.env.N8N_API_KEY || '',

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
};

module.exports = env;
