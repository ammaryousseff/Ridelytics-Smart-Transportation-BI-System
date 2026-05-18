// ============================================
// Ridelytics Backend - Chat Service
// Relays messages to n8n webhook
// ============================================
const webhooks = require('../config/webhooks');
const logger = require('../utils/logger');

async function sendMessage(message, language = 'en') {
  const { url, apiKey, timeout } = webhooks.chat;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        language,
        timestamp: new Date().toISOString(),
        source: 'ridelytics-admin',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`n8n webhook returned ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    // ── Error responses from n8n ──────────────────
    // SQL Execution Error:   { success:false, userMessage, error, sql, data:[], chartType:null }
    // Validation Error:      { success:false, userMessage, error, sql:null, data:[], chartType:null }
    if (data && data.success === false) {
      return {
        success: false,
        requestId: data.requestId || null,
        question: data.question || message,
        language: data.language || language,
        sql: data.sql || null,
        chartType: 'error',
        columns: [],
        data: [],
        rowCount: 0,
        userMessage: data.userMessage || 'An error occurred while processing your query.',
        error: data.error || null,
        timestamp: data.timestamp || null,
      };
    }

    // ── Success response from Result Formatter ────
    // Fields: success, requestId, question, language, sql, chartType,
    //         columns, rowCount, data, explanation, executionTimeMs, log
    if (!data) {
      return {
        success: false,
        chartType: 'error',
        columns: [],
        data: [],
        rowCount: 0,
        explanation: language === 'ar'
          ? 'عذراً، لم يتم استلام رد من خدمة المساعد الذكي.'
          : 'No response body received from the AI assistant service.',
        fallback: true,
        error: 'Empty response body from n8n webhook',
      };
    }

    return {
      success: true,
      requestId: data.requestId || null,
      question: data.question || message,
      language: data.language || language,
      sql: data.sql || null,
      chartType: data.chartType || 'table',
      columns: data.columns || [],
      rowCount: data.rowCount ?? (data.data ? data.data.length : 0),
      data: data.data || [],
      explanation: data.explanation || data.reply || data.output || data.message || 'Response received.',
      executionTimeMs: data.executionTimeMs || null,
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      logger.warn('n8n webhook timed out');
    } else {
      logger.warn('n8n webhook error:', err.message);
    }

    // Graceful fallback when n8n is not available
    return {
      success: false,
      chartType: 'error',
      columns: [],
      data: [],
      rowCount: 0,
      explanation: language === 'ar'
        ? 'عذراً، خدمة المساعد الذكي غير متاحة حالياً. يرجى المحاولة لاحقاً.'
        : 'The AI assistant is currently unavailable. Please try again later.',
      fallback: true,
      error: err.message,
    };
  }
}

module.exports = { sendMessage };
