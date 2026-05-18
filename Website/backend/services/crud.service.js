// ============================================
// Ridelytics Backend - CRUD Service
// Generic CRUD via stored procedures
// ============================================
const { query, execute } = require('../config/database');
const { buildPaginatedQuery } = require('../utils/queryBuilder');
const entities = require('../models/entities');

function getEntityConfig(entityName) {
  const config = entities[entityName.toLowerCase()];
  if (!config) {
    throw Object.assign(new Error(`Entity '${entityName}' not found`), { status: 404 });
  }
  return config;
}

/**
 * Get all records with pagination, search, sort
 */
async function getAll(entityName, options = {}) {
  const config = getEntityConfig(entityName);
  const searchColumns = config.columns
    .filter((c) => c.searchable)
    .map((c) => c.key);

  const { dataQuery, countQuery, params } = buildPaginatedQuery(
    config.table,
    { ...options, searchColumns }
  );

  const [data, count] = await Promise.all([
    query(dataQuery, params),
    query(countQuery, params),
  ]);

  return {
    data: data.recordset,
    total: count.recordset[0].total,
    page: parseInt(options.page) || 1,
    limit: parseInt(options.limit) || 10,
    totalPages: Math.ceil(count.recordset[0].total / (parseInt(options.limit) || 10)),
  };
}

/**
 * Get a single record by ID
 */
async function getById(entityName, id) {
  const config = getEntityConfig(entityName);

  const result = await execute(config.procedures.getById, {
    [config.primaryKey]: id,
  });

  if (!result.recordset || result.recordset.length === 0) {
    throw Object.assign(new Error(`${config.displayName} with ID ${id} not found`), { status: 404 });
  }

  return result.recordset[0];
}

/**
 * Create a new record
 */
async function create(entityName, data) {
  const config = getEntityConfig(entityName);
  const params = {};

  for (const col of config.columns) {
    if (data[col.key] !== undefined) {
      params[col.key] = data[col.key];
    } else if (!col.required) {
      params[col.key] = null;
    }
  }

  await execute(config.procedures.insert, params);
  return { message: `${config.displayName.slice(0, -1)} created successfully`, id: data[config.primaryKey] };
}

/**
 * Update a record
 */
async function update(entityName, id, data) {
  const config = getEntityConfig(entityName);
  const params = {};

  // Set the primary key
  params[config.primaryKey] = id;

  for (const col of config.columns) {
    if (col.primaryKey) continue;
    if (data[col.key] !== undefined) {
      params[col.key] = data[col.key];
    } else if (!col.required) {
      params[col.key] = null;
    }
  }

  await execute(config.procedures.update, params);
  return { message: `${config.displayName.slice(0, -1)} updated successfully` };
}

/**
 * Delete a record
 */
async function remove(entityName, id) {
  const config = getEntityConfig(entityName);

  await execute(config.procedures.delete, {
    [config.primaryKey]: id,
  });

  return { message: `${config.displayName.slice(0, -1)} deleted successfully` };
}

/**
 * Get entity configuration (for frontend form/table generation)
 */
function getConfig(entityName) {
  const config = getEntityConfig(entityName);
  return {
    table: config.table,
    primaryKey: config.primaryKey,
    displayName: config.displayName,
    icon: config.icon,
    columns: config.columns.map((c) => ({
      key: c.key,
      label: c.label,
      type: c.type,
      required: c.required || false,
      primaryKey: c.primaryKey || false,
      searchable: c.searchable || false,
      filterable: c.filterable || false,
      options: c.options || null,
      foreignKey: c.foreignKey || null,
    })),
  };
}

/**
 * Get list of all available entities
 */
function getEntityList() {
  return Object.entries(entities).map(([key, config]) => ({
    key,
    displayName: config.displayName,
    icon: config.icon,
    table: config.table,
  }));
}

module.exports = { getAll, getById, create, update, remove, getConfig, getEntityList };
