// ============================================
// Ridelytics Backend - Dashboard Controller
// ============================================
const dashboardService = require('../services/dashboard.service');

async function getKPIs(req, res, next) {
  try {
    const kpis = await dashboardService.getKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    next(err);
  }
}

async function getTripsOverTime(req, res, next) {
  try {
    const data = await dashboardService.getTripsOverTime();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getRevenueByZone(req, res, next) {
  try {
    const data = await dashboardService.getRevenueByZone();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getTopDrivers(req, res, next) {
  try {
    const data = await dashboardService.getTopDrivers();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getRecentTrips(req, res, next) {
  try {
    const data = await dashboardService.getRecentTrips();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getRecentComplaints(req, res, next) {
  try {
    const data = await dashboardService.getRecentComplaints();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getKPIs, getTripsOverTime, getRevenueByZone, getTopDrivers, getRecentTrips, getRecentComplaints };
