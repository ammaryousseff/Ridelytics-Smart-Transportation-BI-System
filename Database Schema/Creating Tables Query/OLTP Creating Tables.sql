-- ================================================
-- DROP TABLES (reverse dependency order)
-- ================================================
IF OBJECT_ID('DriverEarnings',       'U') IS NOT NULL DROP TABLE DriverEarnings;
IF OBJECT_ID('Complaint',            'U') IS NOT NULL DROP TABLE Complaint;
IF OBJECT_ID('Rating',               'U') IS NOT NULL DROP TABLE Rating;
IF OBJECT_ID('Trip',                 'U') IS NOT NULL DROP TABLE Trip;
IF OBJECT_ID('Promotion',            'U') IS NOT NULL DROP TABLE Promotion;
IF OBJECT_ID('Payment',              'U') IS NOT NULL DROP TABLE Payment;
IF OBJECT_ID('PeakHourSurgeRules',   'U') IS NOT NULL DROP TABLE PeakHourSurgeRules;
IF OBJECT_ID('SeasonalPatterns',     'U') IS NOT NULL DROP TABLE SeasonalPatterns;
IF OBJECT_ID('Vehicle',              'U') IS NOT NULL DROP TABLE Vehicle;
IF OBJECT_ID('Driver',               'U') IS NOT NULL DROP TABLE Driver;
IF OBJECT_ID('Rider',                'U') IS NOT NULL DROP TABLE Rider;
IF OBJECT_ID('Zone',                 'U') IS NOT NULL DROP TABLE Zone;

-- ================================================
-- 1. Zone
-- ================================================
CREATE TABLE Zone (
    ZoneID      INT           PRIMARY KEY,
    ZoneName    VARCHAR(100)  NOT NULL,
    Region      VARCHAR(100),
    Governorate VARCHAR(100),
    City        VARCHAR(100),
    Latitude    DECIMAL(9,6) NOT NULL,
    Longitude   DECIMAL(9,6) NOT NULL
);

-- ================================================
-- 2. Rider
-- ================================================
CREATE TABLE Rider (
    RiderID          INT          PRIMARY KEY,
    FirstName        VARCHAR(100) NOT NULL,
    LastName         VARCHAR(100) NOT NULL,
    Email            VARCHAR(150) NOT NULL UNIQUE,
    PhoneNumber      VARCHAR(20),
    Gender           VARCHAR(10),
    DateOfBirth      DATE,
    RegistrationDate DATE         NOT NULL,
    Status           VARCHAR(20)  NOT NULL,
    AverageRating    DECIMAL(3,2),          -- NULL ok: new rider has no trips yet
    LastTripDate     DATE,                  -- NULL ok: new rider has no trips yet
    HomeZoneID       INT,                   -- NULL ok: optional
    CONSTRAINT FK_Rider_Zone FOREIGN KEY (HomeZoneID) REFERENCES Zone(ZoneID)
);

-- ================================================
-- 3. Driver
-- ================================================
CREATE TABLE Driver (
    DriverID          INT          PRIMARY KEY,
    FirstName         VARCHAR(100) NOT NULL,
    LastName          VARCHAR(100) NOT NULL,
    PhoneNumber       VARCHAR(20),
    NationalID        VARCHAR(50)  NOT NULL UNIQUE,
    DateOfBirth       DATE,
    Gender            VARCHAR(10),
    LicenseNumber     VARCHAR(50)  NOT NULL UNIQUE,
    LicenseExpiryDate DATE         NOT NULL,
    CancellationRate  DECIMAL(5,2),         -- NULL ok: new driver has no trips yet
    AverageRating     DECIMAL(3,2),         -- NULL ok: new driver has no trips yet
    Status            VARCHAR(20)  NOT NULL,
    IsOnline          BIT          NOT NULL,
    JoinDate          DATE         NOT NULL,
    LastOnlineTime    DATETIME,             -- NULL ok: never logged in yet
    BankAccountNumber VARCHAR(50),          -- NULL ok: may not be set yet
    HomeZoneID        INT,                  -- NULL ok: optional
    CONSTRAINT FK_Driver_Zone FOREIGN KEY (HomeZoneID) REFERENCES Zone(ZoneID)
);

-- ================================================
-- 4. Vehicle (1:1 with Driver via UNIQUE FK)
-- ================================================
CREATE TABLE Vehicle (
    VehicleID           INT           PRIMARY KEY,
    DriverID            INT           NOT NULL UNIQUE,
    LicensePlate        VARCHAR(20)   NOT NULL UNIQUE,
    TypeName            VARCHAR(50)   NOT NULL,
    ModelYear           INT           NOT NULL,
    Model               VARCHAR(100)  NOT NULL,
    Manufacturer        VARCHAR(100)  NOT NULL,
    Color               VARCHAR(50),         -- NULL ok: optional
    SeatingCapacity     INT           NOT NULL,
    Mileage             DECIMAL(10,2),        -- NULL ok: unknown at registration
    IsActive            BIT           NOT NULL,
    NextInspectionDate  DATE,                 -- NULL ok: unknown at registration
    LastInspectionDate  DATE,                 -- NULL ok: unknown at registration
    InspectionStatus    VARCHAR(30)   NOT NULL,
    InsuranceExpiryDate DATE          NOT NULL,
    BaseFarePerKm       DECIMAL(8,2)  NOT NULL,
    CONSTRAINT FK_Vehicle_Driver FOREIGN KEY (DriverID) REFERENCES Driver(DriverID)
);

-- ================================================
-- 5. SeasonalPatterns
-- ================================================
CREATE TABLE SeasonalPatterns (
    SeasonID                INT          PRIMARY KEY,
    SeasonType              VARCHAR(50)  NOT NULL,
    SeasonStartDate         DATE         NOT NULL,
    SeasonEndDate           DATE         NOT NULL,
    SeasonalSurgeMultiplier DECIMAL(4,2) NOT NULL
);

-- ================================================
-- 6. PeakHourSurgeRules
-- ================================================
CREATE TABLE PeakHourSurgeRules (
    SurgeRuleID         INT          PRIMARY KEY,
    RuleName            VARCHAR(100) NOT NULL,
    DayType             VARCHAR(20)  NOT NULL,
    StartHour           TIME         NOT NULL,
    EndHour             TIME         NOT NULL,
    TimeSurgeMultiplier DECIMAL(4,2) NOT NULL
);

-- ================================================
-- 7. Payment
-- ================================================
CREATE TABLE Payment (
    PaymentID  INT           PRIMARY KEY,
    MethodName VARCHAR(50)   NOT NULL,
    Amount     DECIMAL(10,2) NOT NULL,
    Status     VARCHAR(20)   NOT NULL
);

-- ================================================
-- 8. Promotion
-- ================================================
CREATE TABLE Promotion (
    PromotionID        INT          PRIMARY KEY,
    PromoCode          VARCHAR(50)  NOT NULL UNIQUE,
    Campaign           VARCHAR(150),          -- NULL ok: optional label
    DiscountPercentage DECIMAL(5,2) NOT NULL,
    MaxUsageCount      INT,                   -- NULL ok: means unlimited
    StartDate          DATE         NOT NULL,
    EndDate            DATE         NOT NULL,
    Status             VARCHAR(20)  NOT NULL
);

-- ================================================
-- 9. Trip
-- ================================================
CREATE TABLE Trip (
    TripID                  INT           PRIMARY KEY,
    RiderID                 INT           NOT NULL,
    DriverID                INT,                   -- NULL ok: cancelled before driver assigned
    PickupZoneID            INT           NOT NULL,
    DropOffZoneID           INT           NOT NULL,
    PaymentID               INT,                   -- NULL ok: cancelled before payment
    PromotionID             INT,                   -- NULL ok: optional on a trip
    SeasonID                INT,                   -- NULL ok: optional on a trip
    SurgeRuleID             INT,                   -- NULL ok: optional on a trip
    RequestTime             DATETIME      NOT NULL,
    AcceptanceTime          DATETIME,
    PickupTime              DATETIME,
    DropOffTime             DATETIME,
    Status                  VARCHAR(30)   NOT NULL,
    DistanceKM              DECIMAL(8,2),          -- NULL ok: trip may be cancelled
    DurationMinutes         INT,
    BaseFare                DECIMAL(8,2),
    SeasonalSurgeMultiplier DECIMAL(4,2),
    TimeSurgeMultiplier     DECIMAL(4,2),
    DiscountPercentage      DECIMAL(5,2),
    FinalFare               DECIMAL(8,2),          -- NULL ok: trip may be cancelled
    CancellationReason      VARCHAR(255),          -- NULL ok: only if cancelled
    CancelledBy             VARCHAR(50),           -- NULL ok: only if cancelled
    CONSTRAINT FK_Trip_Rider       FOREIGN KEY (RiderID)       REFERENCES Rider(RiderID),
    CONSTRAINT FK_Trip_Driver      FOREIGN KEY (DriverID)      REFERENCES Driver(DriverID),
    CONSTRAINT FK_Trip_PickupZone  FOREIGN KEY (PickupZoneID)  REFERENCES Zone(ZoneID),
    CONSTRAINT FK_Trip_DropOffZone FOREIGN KEY (DropOffZoneID) REFERENCES Zone(ZoneID),
    CONSTRAINT FK_Trip_Payment     FOREIGN KEY (PaymentID)     REFERENCES Payment(PaymentID),
    CONSTRAINT FK_Trip_Promotion   FOREIGN KEY (PromotionID)   REFERENCES Promotion(PromotionID),
    CONSTRAINT FK_Trip_Season      FOREIGN KEY (SeasonID)      REFERENCES SeasonalPatterns(SeasonID),
    CONSTRAINT FK_Trip_SurgeRule   FOREIGN KEY (SurgeRuleID)   REFERENCES PeakHourSurgeRules(SurgeRuleID)
);

-- ================================================
-- 10. Rating
-- ================================================
CREATE TABLE Rating (
    RatingID    INT          PRIMARY KEY,
    TripID      INT          NOT NULL,
    RatedBy     VARCHAR(20)  NOT NULL,
    RatingValue DECIMAL(3,2) NOT NULL,
    Comment     TEXT,                  -- NULL ok: optional free text
    RatingDate  DATE         NOT NULL,
    CONSTRAINT FK_Rating_Trip FOREIGN KEY (TripID) REFERENCES Trip(TripID)
);

-- ================================================
-- 11. Complaint
-- ================================================
CREATE TABLE Complaint (
    ComplaintID       INT          PRIMARY KEY,
    TripID            INT          NOT NULL,
    ComplaintCategory VARCHAR(100) NOT NULL,
    SeverityLevel     VARCHAR(20)  NOT NULL,
    Description       TEXT,                  -- NULL ok: optional free text
    FilingDate        DATE         NOT NULL,
    ResolutionDate    DATE,                  -- NULL ok: filled after resolution
    ResolutionNotes   TEXT,                  -- NULL ok: filled after resolution
    Status            VARCHAR(20)  NOT NULL,
    CONSTRAINT FK_Complaint_Trip FOREIGN KEY (TripID) REFERENCES Trip(TripID)
);

-- ================================================
-- 12. DriverEarnings
-- ================================================
CREATE TABLE DriverEarnings (
    EarningsID         INT           PRIMARY KEY,
    DriverID           INT           NOT NULL,
    TripID             INT           NOT NULL,
    GrossEarning       DECIMAL(10,2) NOT NULL,
    PlatformCommission DECIMAL(10,2) NOT NULL,
    BonusAmount        DECIMAL(10,2),         -- NULL ok: not every trip has a bonus
    NetEarning         DECIMAL(10,2) NOT NULL,
    EarningDate        DATE          NOT NULL,
    CONSTRAINT UQ_Earnings_Trip   UNIQUE (TripID),
    CONSTRAINT FK_Earnings_Driver FOREIGN KEY (DriverID) REFERENCES Driver(DriverID),
    CONSTRAINT FK_Earnings_Trip   FOREIGN KEY (TripID)   REFERENCES Trip(TripID)
);