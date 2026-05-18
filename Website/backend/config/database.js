// ============================================
// Ridelytics Backend - SQL Server Database Connection
// Uses Windows Authentication via msnodesqlv8 (ODBC)
// ============================================
const sql = require('mssql/msnodesqlv8');
const env = require('./env');
const logger = require('../utils/logger');

const config = {
  connectionString: `Driver={ODBC Driver 18 for SQL Server};Server=${env.DB_SERVER};Database=${env.DB_DATABASE};Trusted_Connection=yes;TrustServerCertificate=yes;`,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  requestTimeout: 30000,
};

let pool = null;

/**
 * Get or create SQL Server connection pool
 */
async function getPool() {
  if (pool) return pool;

  try {
    pool = await sql.connect(config);
    logger.info(`Connected to SQL Server: ${env.DB_SERVER}/${env.DB_DATABASE}`);
    return pool;
  } catch (err) {
    logger.error('SQL Server connection failed:', err.message);
    throw err;
  }
}

/**
 * Execute a raw SQL query with optional parameters
 * @param {string} queryText - SQL query string
 * @param {Object} params - { name: { type, value } }
 */
async function query(queryText, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  for (const [name, param] of Object.entries(params)) {
    if (param.type) {
      request.input(name, param.type, param.value);
    } else {
      request.input(name, param.value !== undefined ? param.value : param);
    }
  }

  return request.query(queryText);
}

/**
 * Execute a stored procedure
 * @param {string} procedureName
 * @param {Object} params - { name: { type, value } }
 */
async function execute(procedureName, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  for (const [name, param] of Object.entries(params)) {
    if (param.type) {
      request.input(name, param.type, param.value);
    } else {
      request.input(name, param.value !== undefined ? param.value : param);
    }
  }

  return request.execute(procedureName);
}

/**
 * Close the connection pool
 */
async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
    logger.info('SQL Server connection pool closed');
  }
}

module.exports = { getPool, query, execute, closePool, sql };
