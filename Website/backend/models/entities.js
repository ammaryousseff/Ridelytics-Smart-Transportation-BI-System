// ============================================
// Ridelytics Backend - Entity Configurations
// Defines all 12 OLTP tables with column metadata
// ============================================
const sql = require('mssql/msnodesqlv8');

const entities = {
  // ── Zone ────────────────────────────────────
  zones: {
    table: 'Zone',
    primaryKey: 'ZoneID',
    displayName: 'Zones',
    icon: '📍',
    procedures: {
      getAll: 'sp_GetZones',
      getById: 'sp_GetZoneByID',
      insert: 'sp_InsertZone',
      update: 'sp_UpdateZone',
      delete: 'sp_DeleteZone',
    },
    columns: [
      { key: 'ZoneID', label: 'Zone ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'ZoneName', label: 'Zone Name', type: 'text', sqlType: sql.VarChar(100), required: true, searchable: true },
      { key: 'Region', label: 'Region', type: 'text', sqlType: sql.VarChar(100), searchable: true },
      { key: 'Governorate', label: 'Governorate', type: 'text', sqlType: sql.VarChar(100), searchable: true },
      { key: 'City', label: 'City', type: 'text', sqlType: sql.VarChar(100), searchable: true },
      { key: 'Latitude', label: 'Latitude', type: 'number', sqlType: sql.Decimal(9, 6), required: true },
      { key: 'Longitude', label: 'Longitude', type: 'number', sqlType: sql.Decimal(9, 6), required: true },
    ],
  },

  // ── Rider ───────────────────────────────────
  riders: {
    table: 'Rider',
    primaryKey: 'RiderID',
    displayName: 'Riders',
    icon: '🧑',
    procedures: {
      getAll: 'sp_GetRiders',
      getById: 'sp_GetRiderByID',
      insert: 'sp_InsertRider',
      update: 'sp_UpdateRider',
      delete: 'sp_DeleteRider',
    },
    columns: [
      { key: 'RiderID', label: 'Rider ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'FirstName', label: 'First Name', type: 'text', sqlType: sql.VarChar(100), required: true, searchable: true },
      { key: 'LastName', label: 'Last Name', type: 'text', sqlType: sql.VarChar(100), required: true, searchable: true },
      { key: 'Email', label: 'Email', type: 'email', sqlType: sql.VarChar(150), required: true, searchable: true },
      { key: 'PhoneNumber', label: 'Phone', type: 'text', sqlType: sql.VarChar(20) },
      { key: 'Gender', label: 'Gender', type: 'select', sqlType: sql.VarChar(10), options: ['Male', 'Female'] },
      { key: 'DateOfBirth', label: 'Date of Birth', type: 'date', sqlType: sql.Date },
      { key: 'RegistrationDate', label: 'Registration Date', type: 'date', sqlType: sql.Date, required: true },
      { key: 'Status', label: 'Status', type: 'select', sqlType: sql.VarChar(20), required: true, options: ['Active', 'Inactive', 'Suspended'], filterable: true },
      { key: 'AverageRating', label: 'Avg Rating', type: 'number', sqlType: sql.Decimal(3, 2) },
      { key: 'LastTripDate', label: 'Last Trip', type: 'date', sqlType: sql.Date },
      { key: 'HomeZoneID', label: 'Home Zone', type: 'number', sqlType: sql.Int, foreignKey: 'zones' },
    ],
  },

  // ── Driver ──────────────────────────────────
  drivers: {
    table: 'Driver',
    primaryKey: 'DriverID',
    displayName: 'Drivers',
    icon: '🚗',
    procedures: {
      getAll: 'sp_GetDrivers',
      getById: 'sp_GetDriverByID',
      insert: 'sp_InsertDriver',
      update: 'sp_UpdateDriver',
      delete: 'sp_DeleteDriver',
    },
    columns: [
      { key: 'DriverID', label: 'Driver ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'FirstName', label: 'First Name', type: 'text', sqlType: sql.VarChar(100), required: true, searchable: true },
      { key: 'LastName', label: 'Last Name', type: 'text', sqlType: sql.VarChar(100), required: true, searchable: true },
      { key: 'PhoneNumber', label: 'Phone', type: 'text', sqlType: sql.VarChar(20) },
      { key: 'NationalID', label: 'National ID', type: 'text', sqlType: sql.VarChar(50), required: true },
      { key: 'DateOfBirth', label: 'Date of Birth', type: 'date', sqlType: sql.Date },
      { key: 'Gender', label: 'Gender', type: 'select', sqlType: sql.VarChar(10), options: ['Male', 'Female'] },
      { key: 'LicenseNumber', label: 'License Number', type: 'text', sqlType: sql.VarChar(50), required: true },
      { key: 'LicenseExpiryDate', label: 'License Expiry', type: 'date', sqlType: sql.Date, required: true },
      { key: 'CancellationRate', label: 'Cancel Rate %', type: 'number', sqlType: sql.Decimal(5, 2) },
      { key: 'AverageRating', label: 'Avg Rating', type: 'number', sqlType: sql.Decimal(3, 2) },
      { key: 'Status', label: 'Status', type: 'select', sqlType: sql.VarChar(20), required: true, options: ['Active', 'Inactive', 'Suspended'], filterable: true },
      { key: 'IsOnline', label: 'Online', type: 'boolean', sqlType: sql.Bit, required: true },
      { key: 'JoinDate', label: 'Join Date', type: 'date', sqlType: sql.Date, required: true },
      { key: 'LastOnlineTime', label: 'Last Online', type: 'datetime', sqlType: sql.DateTime },
      { key: 'BankAccountNumber', label: 'Bank Account', type: 'text', sqlType: sql.VarChar(50) },
      { key: 'HomeZoneID', label: 'Home Zone', type: 'number', sqlType: sql.Int, foreignKey: 'zones' },
    ],
  },

  // ── Vehicle ─────────────────────────────────
  vehicles: {
    table: 'Vehicle',
    primaryKey: 'VehicleID',
    displayName: 'Vehicles',
    icon: '🚙',
    procedures: {
      getAll: 'sp_GetVehicles',
      getById: 'sp_GetVehicleByID',
      insert: 'sp_InsertVehicle',
      update: 'sp_UpdateVehicle',
      delete: 'sp_DeleteVehicle',
    },
    columns: [
      { key: 'VehicleID', label: 'Vehicle ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'DriverID', label: 'Driver ID', type: 'number', sqlType: sql.Int, required: true, foreignKey: 'drivers' },
      { key: 'LicensePlate', label: 'License Plate', type: 'text', sqlType: sql.VarChar(20), required: true, searchable: true },
      { key: 'TypeName', label: 'Type', type: 'text', sqlType: sql.VarChar(50), required: true, searchable: true },
      { key: 'ModelYear', label: 'Year', type: 'number', sqlType: sql.Int, required: true },
      { key: 'Model', label: 'Model', type: 'text', sqlType: sql.VarChar(100), required: true, searchable: true },
      { key: 'Manufacturer', label: 'Manufacturer', type: 'text', sqlType: sql.VarChar(100), required: true, searchable: true },
      { key: 'Color', label: 'Color', type: 'text', sqlType: sql.VarChar(50) },
      { key: 'SeatingCapacity', label: 'Seats', type: 'number', sqlType: sql.Int, required: true },
      { key: 'Mileage', label: 'Mileage', type: 'number', sqlType: sql.Decimal(10, 2) },
      { key: 'IsActive', label: 'Active', type: 'boolean', sqlType: sql.Bit, required: true },
      { key: 'NextInspectionDate', label: 'Next Inspection', type: 'date', sqlType: sql.Date },
      { key: 'LastInspectionDate', label: 'Last Inspection', type: 'date', sqlType: sql.Date },
      { key: 'InspectionStatus', label: 'Inspection', type: 'select', sqlType: sql.VarChar(30), required: true, options: ['Passed', 'Failed', 'Pending'] },
      { key: 'InsuranceExpiryDate', label: 'Insurance Expiry', type: 'date', sqlType: sql.Date, required: true },
      { key: 'BaseFarePerKm', label: 'Fare/Km', type: 'number', sqlType: sql.Decimal(8, 2), required: true },
    ],
  },

  // ── Seasonal Patterns ───────────────────────
  seasonalpatterns: {
    table: 'SeasonalPatterns',
    primaryKey: 'SeasonID',
    displayName: 'Seasonal Patterns',
    icon: '🌤️',
    procedures: {
      getAll: 'sp_GetSeasonalPatterns',
      getById: 'sp_GetSeasonalPatternByID',
      insert: 'sp_InsertSeasonalPattern',
      update: 'sp_UpdateSeasonalPattern',
      delete: 'sp_DeleteSeasonalPattern',
    },
    columns: [
      { key: 'SeasonID', label: 'Season ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'SeasonType', label: 'Season Type', type: 'text', sqlType: sql.VarChar(50), required: true, searchable: true },
      { key: 'SeasonStartDate', label: 'Start Date', type: 'date', sqlType: sql.Date, required: true },
      { key: 'SeasonEndDate', label: 'End Date', type: 'date', sqlType: sql.Date, required: true },
      { key: 'SeasonalSurgeMultiplier', label: 'Surge Multiplier', type: 'number', sqlType: sql.Decimal(4, 2), required: true },
    ],
  },

  // ── Peak Hour Surge Rules ───────────────────
  surgerules: {
    table: 'PeakHourSurgeRules',
    primaryKey: 'SurgeRuleID',
    displayName: 'Surge Rules',
    icon: '⚡',
    procedures: {
      getAll: 'sp_GetPeakHourSurgeRules',
      getById: 'sp_GetPeakHourSurgeRuleByID',
      insert: 'sp_InsertPeakHourSurgeRule',
      update: 'sp_UpdatePeakHourSurgeRule',
      delete: 'sp_DeletePeakHourSurgeRule',
    },
    columns: [
      { key: 'SurgeRuleID', label: 'Rule ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'RuleName', label: 'Rule Name', type: 'text', sqlType: sql.VarChar(100), required: true, searchable: true },
      { key: 'DayType', label: 'Day Type', type: 'select', sqlType: sql.VarChar(20), required: true, options: ['Weekday', 'Weekend', 'Holiday'] },
      { key: 'StartHour', label: 'Start Hour', type: 'time', sqlType: sql.VarChar(8), required: true },
      { key: 'EndHour', label: 'End Hour', type: 'time', sqlType: sql.VarChar(8), required: true },
      { key: 'TimeSurgeMultiplier', label: 'Surge Multiplier', type: 'number', sqlType: sql.Decimal(4, 2), required: true },
    ],
  },

  // ── Payment ─────────────────────────────────
  payments: {
    table: 'Payment',
    primaryKey: 'PaymentID',
    displayName: 'Payments',
    icon: '💳',
    procedures: {
      getAll: 'sp_GetPayments',
      getById: 'sp_GetPaymentByID',
      insert: 'sp_InsertPayment',
      update: 'sp_UpdatePayment',
      delete: 'sp_DeletePayment',
    },
    columns: [
      { key: 'PaymentID', label: 'Payment ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'MethodName', label: 'Method', type: 'select', sqlType: sql.VarChar(50), required: true, options: ['Cash', 'Credit Card', 'Debit Card', 'Mobile Wallet', 'Fawry'], searchable: true },
      { key: 'Amount', label: 'Amount', type: 'number', sqlType: sql.Decimal(10, 2), required: true },
      { key: 'Status', label: 'Status', type: 'select', sqlType: sql.VarChar(20), required: true, options: ['Completed', 'Pending', 'Failed', 'Refunded'], filterable: true },
    ],
  },

  // ── Promotion ───────────────────────────────
  promotions: {
    table: 'Promotion',
    primaryKey: 'PromotionID',
    displayName: 'Promotions',
    icon: '🎁',
    procedures: {
      getAll: 'sp_GetPromotions',
      getById: 'sp_GetPromotionByID',
      insert: 'sp_InsertPromotion',
      update: 'sp_UpdatePromotion',
      delete: 'sp_DeletePromotion',
    },
    columns: [
      { key: 'PromotionID', label: 'Promo ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'PromoCode', label: 'Code', type: 'text', sqlType: sql.VarChar(50), required: true, searchable: true },
      { key: 'Campaign', label: 'Campaign', type: 'text', sqlType: sql.VarChar(150), searchable: true },
      { key: 'DiscountPercentage', label: 'Discount %', type: 'number', sqlType: sql.Decimal(5, 2), required: true },
      { key: 'MaxUsageCount', label: 'Max Usage', type: 'number', sqlType: sql.Int },
      { key: 'StartDate', label: 'Start Date', type: 'date', sqlType: sql.Date, required: true },
      { key: 'EndDate', label: 'End Date', type: 'date', sqlType: sql.Date, required: true },
      { key: 'Status', label: 'Status', type: 'select', sqlType: sql.VarChar(20), required: true, options: ['Active', 'Expired', 'Disabled'], filterable: true },
    ],
  },

  // ── Trip ────────────────────────────────────
  trips: {
    table: 'Trip',
    primaryKey: 'TripID',
    displayName: 'Trips',
    icon: '🛣️',
    procedures: {
      getAll: 'sp_GetTrips',
      getById: 'sp_GetTripByID',
      insert: 'sp_InsertTrip',
      update: 'sp_UpdateTrip',
      delete: 'sp_DeleteTrip',
    },
    columns: [
      { key: 'TripID', label: 'Trip ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'RiderID', label: 'Rider ID', type: 'number', sqlType: sql.Int, required: true, foreignKey: 'riders' },
      { key: 'DriverID', label: 'Driver ID', type: 'number', sqlType: sql.Int, foreignKey: 'drivers' },
      { key: 'PickupZoneID', label: 'Pickup Zone', type: 'number', sqlType: sql.Int, required: true, foreignKey: 'zones' },
      { key: 'DropOffZoneID', label: 'Drop-off Zone', type: 'number', sqlType: sql.Int, required: true, foreignKey: 'zones' },
      { key: 'PaymentID', label: 'Payment ID', type: 'number', sqlType: sql.Int, foreignKey: 'payments' },
      { key: 'PromotionID', label: 'Promotion ID', type: 'number', sqlType: sql.Int, foreignKey: 'promotions' },
      { key: 'SeasonID', label: 'Season ID', type: 'number', sqlType: sql.Int, foreignKey: 'seasonalpatterns' },
      { key: 'SurgeRuleID', label: 'Surge Rule ID', type: 'number', sqlType: sql.Int, foreignKey: 'surgerules' },
      { key: 'RequestTime', label: 'Request Time', type: 'datetime', sqlType: sql.DateTime, required: true },
      { key: 'AcceptanceTime', label: 'Accepted', type: 'datetime', sqlType: sql.DateTime },
      { key: 'PickupTime', label: 'Pickup Time', type: 'datetime', sqlType: sql.DateTime },
      { key: 'DropOffTime', label: 'Drop-off Time', type: 'datetime', sqlType: sql.DateTime },
      { key: 'Status', label: 'Status', type: 'select', sqlType: sql.VarChar(30), required: true, options: ['Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled'], filterable: true },
      { key: 'DistanceKM', label: 'Distance (km)', type: 'number', sqlType: sql.Decimal(8, 2) },
      { key: 'DurationMinutes', label: 'Duration (min)', type: 'number', sqlType: sql.Int },
      { key: 'BaseFare', label: 'Base Fare', type: 'number', sqlType: sql.Decimal(8, 2) },
      { key: 'SeasonalSurgeMultiplier', label: 'Season Surge', type: 'number', sqlType: sql.Decimal(4, 2) },
      { key: 'TimeSurgeMultiplier', label: 'Time Surge', type: 'number', sqlType: sql.Decimal(4, 2) },
      { key: 'DiscountPercentage', label: 'Discount %', type: 'number', sqlType: sql.Decimal(5, 2) },
      { key: 'FinalFare', label: 'Final Fare', type: 'number', sqlType: sql.Decimal(8, 2) },
      { key: 'CancellationReason', label: 'Cancel Reason', type: 'text', sqlType: sql.VarChar(255) },
      { key: 'CancelledBy', label: 'Cancelled By', type: 'text', sqlType: sql.VarChar(50) },
    ],
  },

  // ── Rating ──────────────────────────────────
  ratings: {
    table: 'Rating',
    primaryKey: 'RatingID',
    displayName: 'Ratings',
    icon: '⭐',
    procedures: {
      getAll: 'sp_GetRatings',
      getById: 'sp_GetRatingByID',
      insert: 'sp_InsertRating',
      update: 'sp_UpdateRating',
      delete: 'sp_DeleteRating',
    },
    columns: [
      { key: 'RatingID', label: 'Rating ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'TripID', label: 'Trip ID', type: 'number', sqlType: sql.Int, required: true, foreignKey: 'trips' },
      { key: 'RatedBy', label: 'Rated By', type: 'select', sqlType: sql.VarChar(20), required: true, options: ['Rider', 'Driver'] },
      { key: 'RatingValue', label: 'Rating', type: 'number', sqlType: sql.Decimal(3, 2), required: true },
      { key: 'Comment', label: 'Comment', type: 'textarea', sqlType: sql.Text },
      { key: 'RatingDate', label: 'Date', type: 'date', sqlType: sql.Date, required: true },
    ],
  },

  // ── Complaint ───────────────────────────────
  complaints: {
    table: 'Complaint',
    primaryKey: 'ComplaintID',
    displayName: 'Complaints',
    icon: '📋',
    procedures: {
      getAll: 'sp_GetComplaints',
      getById: 'sp_GetComplaintByID',
      insert: 'sp_InsertComplaint',
      update: 'sp_UpdateComplaint',
      delete: 'sp_DeleteComplaint',
    },
    columns: [
      { key: 'ComplaintID', label: 'Complaint ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'TripID', label: 'Trip ID', type: 'number', sqlType: sql.Int, required: true, foreignKey: 'trips' },
      { key: 'ComplaintCategory', label: 'Category', type: 'select', sqlType: sql.VarChar(100), required: true, options: ['Safety', 'Driver Behavior', 'Overcharge', 'App Issue', 'Route Problem', 'Vehicle Condition', 'Other'], searchable: true, filterable: true },
      { key: 'SeverityLevel', label: 'Severity', type: 'select', sqlType: sql.VarChar(20), required: true, options: ['Low', 'Medium', 'High', 'Critical'], filterable: true },
      { key: 'Description', label: 'Description', type: 'textarea', sqlType: sql.Text },
      { key: 'FilingDate', label: 'Filed On', type: 'date', sqlType: sql.Date, required: true },
      { key: 'ResolutionDate', label: 'Resolved On', type: 'date', sqlType: sql.Date },
      { key: 'ResolutionNotes', label: 'Resolution Notes', type: 'textarea', sqlType: sql.Text },
      { key: 'Status', label: 'Status', type: 'select', sqlType: sql.VarChar(20), required: true, options: ['Open', 'In Progress', 'Resolved', 'Closed', 'Escalated'], filterable: true },
    ],
  },

  // ── Driver Earnings ─────────────────────────
  driverearnings: {
    table: 'DriverEarnings',
    primaryKey: 'EarningsID',
    displayName: 'Driver Earnings',
    icon: '💰',
    procedures: {
      getAll: 'sp_GetDriverEarnings',
      getById: 'sp_GetDriverEarningsByID',
      insert: 'sp_InsertDriverEarning',
      update: 'sp_UpdateDriverEarning',
      delete: 'sp_DeleteDriverEarning',
    },
    columns: [
      { key: 'EarningsID', label: 'Earnings ID', type: 'number', sqlType: sql.Int, primaryKey: true, required: true },
      { key: 'DriverID', label: 'Driver ID', type: 'number', sqlType: sql.Int, required: true, foreignKey: 'drivers' },
      { key: 'TripID', label: 'Trip ID', type: 'number', sqlType: sql.Int, required: true, foreignKey: 'trips' },
      { key: 'GrossEarning', label: 'Gross Earning', type: 'number', sqlType: sql.Decimal(10, 2), required: true },
      { key: 'PlatformCommission', label: 'Commission', type: 'number', sqlType: sql.Decimal(10, 2), required: true },
      { key: 'BonusAmount', label: 'Bonus', type: 'number', sqlType: sql.Decimal(10, 2) },
      { key: 'NetEarning', label: 'Net Earning', type: 'number', sqlType: sql.Decimal(10, 2), required: true },
      { key: 'EarningDate', label: 'Date', type: 'date', sqlType: sql.Date, required: true },
    ],
  },
};

module.exports = entities;
