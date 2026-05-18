// ============================================
// Ridelytics Backend - Health Route
// ============================================
const express = require('express');
const router = express.Router();
const { getPool } = require('../config/database');

router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 as check_val');
    if (result.recordset[0].check_val === 1) {
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime(),
  });
});

module.exports = router;
