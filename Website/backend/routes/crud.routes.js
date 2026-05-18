// ============================================
// Ridelytics Backend - CRUD Routes
// ============================================
const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crud.controller');
const { sanitizeInputs } = require('../middleware/validator');

// Entity list
router.get('/entities', crudController.getEntityList);

// Entity config (column metadata)
router.get('/:entity/config', crudController.getConfig);

// CRUD operations
router.get('/:entity', crudController.getAll);
router.get('/:entity/:id', crudController.getById);
router.post('/:entity', sanitizeInputs, crudController.create);
router.put('/:entity/:id', sanitizeInputs, crudController.update);
router.delete('/:entity/:id', crudController.remove);

module.exports = router;
