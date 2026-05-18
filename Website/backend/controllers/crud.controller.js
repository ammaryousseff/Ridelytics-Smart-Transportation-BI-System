// ============================================
// Ridelytics Backend - CRUD Controller
// ============================================
const crudService = require('../services/crud.service');

async function getAll(req, res, next) {
  try {
    const { entity } = req.params;
    const { page, limit, search, sortBy, sortOrder, ...filters } = req.query;
    const result = await crudService.getAll(entity, { page, limit, search, sortBy, sortOrder, filters });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { entity, id } = req.params;
    const data = await crudService.getById(entity, parseInt(id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { entity } = req.params;
    const result = await crudService.create(entity, req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { entity, id } = req.params;
    const result = await crudService.update(entity, parseInt(id), req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { entity, id } = req.params;
    const result = await crudService.remove(entity, parseInt(id));
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getConfig(req, res, next) {
  try {
    const { entity } = req.params;
    const config = crudService.getConfig(entity);
    res.json({ success: true, config });
  } catch (err) {
    next(err);
  }
}

async function getEntityList(req, res, next) {
  try {
    const list = crudService.getEntityList();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, getConfig, getEntityList };
