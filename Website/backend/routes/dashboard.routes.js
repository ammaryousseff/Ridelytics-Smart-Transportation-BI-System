// ============================================
// Ridelytics Backend - Dashboard Routes
// ============================================
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/kpis', dashboardController.getKPIs);
router.get('/charts/trips-over-time', dashboardController.getTripsOverTime);
router.get('/charts/revenue-by-zone', dashboardController.getRevenueByZone);
router.get('/charts/top-drivers', dashboardController.getTopDrivers);
router.get('/recent/trips', dashboardController.getRecentTrips);
router.get('/recent/complaints', dashboardController.getRecentComplaints);

module.exports = router;
