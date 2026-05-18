// ============================================
// Ridelytics Backend - Dashboard Service
// KPI aggregation queries against the Ridelytics OLTP
// ============================================
const { query } = require('../config/database');

async function getKPIs() {
  const [totalTrips, totalRevenue, activeDrivers, activeRiders, avgRating, cancellationRate] =
    await Promise.all([
      query('SELECT COUNT(*) as value FROM Trip'),
      query("SELECT ISNULL(SUM(FinalFare), 0) as value FROM Trip WHERE Status = 'Completed'"),
      query("SELECT COUNT(*) as value FROM Driver WHERE Status = 'Active'"),
      query("SELECT COUNT(*) as value FROM Rider WHERE Status = 'Active'"),
      query('SELECT ISNULL(AVG(RatingValue), 0) as value FROM Rating'),
      query(`
        SELECT
          CASE WHEN COUNT(*) = 0 THEN 0
          ELSE CAST(SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100
          END as value
        FROM Trip
      `),
    ]);

  return {
    totalTrips: totalTrips.recordset[0].value,
    totalRevenue: parseFloat(totalRevenue.recordset[0].value) || 0,
    activeDrivers: activeDrivers.recordset[0].value,
    activeRiders: activeRiders.recordset[0].value,
    avgRating: parseFloat(avgRating.recordset[0].value).toFixed(2),
    cancellationRate: parseFloat(cancellationRate.recordset[0].value).toFixed(1),
  };
}

async function getTripsOverTime() {
  const result = await query(`
    SELECT
      FORMAT(RequestTime, 'yyyy-MM') as month,
      COUNT(*) as trips,
      ISNULL(SUM(CASE WHEN Status = 'Completed' THEN FinalFare ELSE 0 END), 0) as revenue
    FROM Trip
    GROUP BY FORMAT(RequestTime, 'yyyy-MM')
    ORDER BY month DESC
    OFFSET 0 ROWS FETCH NEXT 12 ROWS ONLY
  `);
  return result.recordset.reverse();
}

async function getRevenueByZone() {
  const result = await query(`
    SELECT TOP 10
      z.ZoneName,
      COUNT(t.TripID) as trips,
      ISNULL(SUM(t.FinalFare), 0) as revenue
    FROM Trip t
    JOIN Zone z ON t.PickupZoneID = z.ZoneID
    WHERE t.Status = 'Completed'
    GROUP BY z.ZoneName
    ORDER BY revenue DESC
  `);
  return result.recordset;
}

async function getTopDrivers() {
  const result = await query(`
    SELECT TOP 10
      d.DriverID,
      d.FirstName + ' ' + d.LastName as DriverName,
      d.AverageRating,
      COUNT(de.EarningsID) as totalTrips,
      ISNULL(SUM(de.NetEarning), 0) as totalEarnings
    FROM Driver d
    LEFT JOIN DriverEarnings de ON d.DriverID = de.DriverID
    GROUP BY d.DriverID, d.FirstName, d.LastName, d.AverageRating
    ORDER BY totalEarnings DESC
  `);
  return result.recordset;
}

async function getRecentTrips() {
  const result = await query(`
    SELECT TOP 5
      t.TripID, t.Status, t.FinalFare, t.RequestTime,
      r.FirstName + ' ' + r.LastName as RiderName,
      ISNULL(d.FirstName + ' ' + d.LastName, 'Unassigned') as DriverName
    FROM Trip t
    JOIN Rider r ON t.RiderID = r.RiderID
    LEFT JOIN Driver d ON t.DriverID = d.DriverID
    ORDER BY t.RequestTime DESC
  `);
  return result.recordset;
}

async function getRecentComplaints() {
  const result = await query(`
    SELECT TOP 5
      c.ComplaintID, c.ComplaintCategory, c.SeverityLevel, c.Status, c.FilingDate,
      c.TripID
    FROM Complaint c
    ORDER BY c.FilingDate DESC
  `);
  return result.recordset;
}

module.exports = {
  getKPIs,
  getTripsOverTime,
  getRevenueByZone,
  getTopDrivers,
  getRecentTrips,
  getRecentComplaints,
};
