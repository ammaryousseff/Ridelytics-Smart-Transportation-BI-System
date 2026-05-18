// ============================================
// Ridelytics Backend - SQL Query Builder Helpers
// ============================================
const sql = require('mssql/msnodesqlv8');

/**
 * Build a paginated SELECT query
 * @param {string} table - Table name
 * @param {Object} options - { page, limit, search, searchColumns, sortBy, sortOrder, filters }
 */
function buildPaginatedQuery(table, options = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    searchColumns = [],
    sortBy = null,
    sortOrder = 'ASC',
    filters = {},
  } = options;

  const offset = (page - 1) * limit;
  let whereConditions = [];
  let params = {};

  // Search across specified columns
  if (search && searchColumns.length > 0) {
    const searchClauses = searchColumns.map(
      (col, i) => `${col} LIKE @search${i}`
    );
    whereConditions.push(`(${searchClauses.join(' OR ')})`);
    searchColumns.forEach((col, i) => {
      params[`search${i}`] = { type: sql.NVarChar, value: `%${search}%` };
    });
  }

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      whereConditions.push(`${key} = @filter_${key}`);
      params[`filter_${key}`] = value;
    }
  }

  const whereClause = whereConditions.length > 0
    ? `WHERE ${whereConditions.join(' AND ')}`
    : '';

  const orderClause = sortBy
    ? `ORDER BY ${sortBy} ${sortOrder === 'DESC' ? 'DESC' : 'ASC'}`
    : `ORDER BY (SELECT NULL)`;

  const dataQuery = `
    SELECT * FROM ${table}
    ${whereClause}
    ${orderClause}
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `;

  const countQuery = `
    SELECT COUNT(*) as total FROM ${table}
    ${whereClause}
  `;

  params.offset = { type: sql.Int, value: offset };
  params.limit = { type: sql.Int, value: limit };

  return { dataQuery, countQuery, params };
}

module.exports = { buildPaginatedQuery };
