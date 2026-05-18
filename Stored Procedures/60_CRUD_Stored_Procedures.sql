-- ============================================================
-- RIDELYTICS DATABASE - CRUD STORED PROCEDURES
-- Tables: Vehicle, Driver, DriverEarnings, Zone, Rider,
--         SeasonalPatterns, Trip, Payment, Complaint,
--         Rating, PeakHourSurgeRules, Promotion
-- ============================================================
USE RidelyticsOLTP;
GO
-- ============================================================
-- VEHICLE
-- ============================================================


CREATE PROCEDURE sp_GetVehicles
AS
BEGIN
    SELECT * FROM Vehicle;
END
GO
-- EXEC sp_GetVehicles;
-- ============================================================
CREATE PROCEDURE sp_GetVehicleByID
    @VehicleID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Vehicle WHERE VehicleID = @VehicleID)
    BEGIN
        PRINT 'Vehicle with ID ' + CAST(@VehicleID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Vehicle WHERE VehicleID = @VehicleID;
END
GO
-- EXEC sp_GetVehicleByID @VehicleID = 1;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertVehicle
    @VehicleID          INT,
    @DriverID           INT,
    @LicensePlate       VARCHAR(20),
    @TypeName           VARCHAR(50),
    @ModelYear          INT,
    @Model              VARCHAR(100),
    @Manufacturer       VARCHAR(100),
    @Color              VARCHAR(50) = NULL,
    @SeatingCapacity    INT,
    @Mileage            DECIMAL(10,2) = NULL,
    @IsActive           BIT,
    @NextInspectionDate DATE = NULL,
    @LastInspectionDate DATE = NULL,
    @InspectionStatus   VARCHAR(30),
    @InsuranceExpiryDate DATE,
    @BaseFarePerKm      DECIMAL(8,2)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Vehicle WHERE VehicleID = @VehicleID)
    BEGIN
        PRINT 'Cannot insert Vehicle: VehicleID ' + CAST(@VehicleID AS VARCHAR) + ' is already registered.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot insert Vehicle: Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    INSERT INTO Vehicle
        (VehicleID, DriverID, LicensePlate, TypeName, ModelYear, Model, Manufacturer, Color,
         SeatingCapacity, Mileage, IsActive, NextInspectionDate, LastInspectionDate, 
         InspectionStatus, InsuranceExpiryDate, BaseFarePerKm)
    VALUES
        (@VehicleID, @DriverID, @LicensePlate, @TypeName, @ModelYear, @Model, @Manufacturer, @Color,
         @SeatingCapacity, @Mileage, @IsActive, @NextInspectionDate, @LastInspectionDate, 
         @InspectionStatus, @InsuranceExpiryDate, @BaseFarePerKm);
END
GO
-- EXEC sp_InsertVehicle
--     @VehicleID          = 1,
--     @DriverID           = 10,
--     @LicensePlate       = 'ABC-1234',
--     @TypeName           = 'Sedan',
--     @ModelYear          = 2021,
--     @Model              = 'Camry',
--     @Manufacturer       = 'Toyota',
--     @Color              = 'White',          -- optional (NULL allowed)
--     @SeatingCapacity    = 4,
--     @Mileage            = 15000.00,         -- optional (NULL allowed)
--     @IsActive           = 1,
--     @NextInspectionDate = '2025-06-01',     -- optional (NULL allowed)
--     @LastInspectionDate = '2024-06-01',     -- optional (NULL allowed)
--     @InspectionStatus   = 'Passed',
--     @InsuranceExpiryDate = '2025-12-31',
--     @BaseFarePerKm      = 3.50;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateVehicle
    @VehicleID          INT,
    @DriverID           INT,
    @LicensePlate       VARCHAR(20),
    @TypeName           VARCHAR(50),
    @ModelYear          INT,
    @Model              VARCHAR(100),
    @Manufacturer       VARCHAR(100),
    @Color              VARCHAR(50) = NULL,
    @SeatingCapacity    INT,
    @Mileage            DECIMAL(10,2) = NULL,
    @IsActive           BIT,
    @NextInspectionDate DATE = NULL,
    @LastInspectionDate DATE = NULL,
    @InspectionStatus   VARCHAR(30),
    @InsuranceExpiryDate DATE,
    @BaseFarePerKm      DECIMAL(8,2)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Vehicle WHERE VehicleID = @VehicleID)
    BEGIN
        PRINT 'Cannot update: Vehicle with ID ' + CAST(@VehicleID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot update Vehicle: Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE Vehicle SET
        DriverID            = @DriverID,
        LicensePlate        = @LicensePlate,
        TypeName            = @TypeName,
        ModelYear           = @ModelYear,
        Model               = @Model,
        Manufacturer        = @Manufacturer,
        Color               = @Color,
        SeatingCapacity     = @SeatingCapacity,
        Mileage             = @Mileage,
        IsActive            = @IsActive,
        NextInspectionDate  = @NextInspectionDate,
        LastInspectionDate  = @LastInspectionDate,
        InspectionStatus    = @InspectionStatus,
        InsuranceExpiryDate = @InsuranceExpiryDate,
        BaseFarePerKm       = @BaseFarePerKm
    WHERE VehicleID = @VehicleID;
END
GO
-- EXEC sp_UpdateVehicle
--     @VehicleID          = 1,
--     @DriverID           = 10,
--     @LicensePlate       = 'ABC-1234',
--     @TypeName           = 'SUV',
--     @ModelYear          = 2022,
--     @Model              = 'RAV4',
--     @Manufacturer       = 'Toyota',
--     @Color              = 'Black',          -- optional (NULL allowed)
--     @SeatingCapacity    = 5,
--     @Mileage            = 20000.00,         -- optional (NULL allowed)
--     @IsActive           = 1,
--     @NextInspectionDate = '2026-01-01',     -- optional (NULL allowed)
--     @LastInspectionDate = '2025-01-01',     -- optional (NULL allowed)
--     @InspectionStatus   = 'Passed',
--     @InsuranceExpiryDate = '2026-06-30',
--     @BaseFarePerKm      = 4.00;
-- ============================================================
CREATE PROCEDURE sp_DeleteVehicle
    @VehicleID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Vehicle WHERE VehicleID = @VehicleID)
    BEGIN
        PRINT 'Cannot delete: Vehicle with ID ' + CAST(@VehicleID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Vehicle WHERE VehicleID = @VehicleID;
END
GO
-- EXEC sp_DeleteVehicle @VehicleID = 1;

-- ============================================================
-- DRIVER
-- ============================================================

CREATE PROCEDURE sp_GetDrivers
AS
BEGIN
    SELECT * FROM Driver;
END
GO
-- EXEC sp_GetDrivers;
-- ============================================================
CREATE PROCEDURE sp_GetDriverByID
    @DriverID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Driver WHERE DriverID = @DriverID;
END
GO
-- EXEC sp_GetDriverByID @DriverID = 10;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertDriver
    @DriverID           INT,
    @FirstName          VARCHAR(100),
    @LastName           VARCHAR(100),
    @PhoneNumber        VARCHAR(20) = NULL,
    @NationalID         VARCHAR(50),
    @DateOfBirth        DATE = NULL,
    @Gender             VARCHAR(10) = NULL,
    @LicenseNumber      VARCHAR(50),
    @LicenseExpiryDate  DATE,
    @CancellationRate   DECIMAL(5,2) = NULL,
    @AverageRating      DECIMAL(3,2) = NULL,
    @Status             VARCHAR(20),
    @IsOnline           BIT,
    @JoinDate           DATE,
    @LastOnlineTime     DATETIME = NULL,
    @BankAccountNumber  VARCHAR(50) = NULL,
    @HomeZoneID         INT = NULL
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot insert Driver: DriverID ' + CAST(@DriverID AS VARCHAR) + ' is already registered.';
        RETURN;
    END

    IF @HomeZoneID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @HomeZoneID)
    BEGIN
        PRINT 'Cannot insert Driver: Zone with ID ' + CAST(@HomeZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    INSERT INTO Driver
        (DriverID, FirstName, LastName, PhoneNumber, NationalID, DateOfBirth, Gender,
         LicenseNumber, LicenseExpiryDate, CancellationRate, AverageRating, Status,
         IsOnline, JoinDate, LastOnlineTime, BankAccountNumber, HomeZoneID)
    VALUES
        (@DriverID, @FirstName, @LastName, @PhoneNumber, @NationalID, @DateOfBirth, @Gender,
         @LicenseNumber, @LicenseExpiryDate, @CancellationRate, @AverageRating, @Status,
         @IsOnline, @JoinDate, @LastOnlineTime, @BankAccountNumber, @HomeZoneID);

END
GO
-- EXEC sp_InsertDriver
--     @DriverID           = 10,
--     @FirstName          = 'Ahmed',
--     @LastName           = 'Hassan',
--     @PhoneNumber        = '01012345678',    -- optional (NULL allowed)
--     @NationalID         = '29901011234567',
--     @DateOfBirth        = '1999-01-01',     -- optional (NULL allowed)
--     @Gender             = 'Male',           -- optional (NULL allowed)
--     @LicenseNumber      = 'LIC-00123',
--     @LicenseExpiryDate  = '2027-05-01',
--     @CancellationRate   = 0.05,             -- optional (NULL allowed)
--     @AverageRating      = NULL,             -- optional (NULL allowed)
--     @Status             = 'Active',
--     @IsOnline           = 0,
--     @JoinDate           = '2024-01-15',
--     @LastOnlineTime     = NULL,             -- optional (NULL allowed)
--     @BankAccountNumber  = 'BK-9900123',     -- optional (NULL allowed)
--     @HomeZoneID         = 3;               -- optional (NULL allowed)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateDriver
    @DriverID           INT,
    @FirstName          VARCHAR(100),
    @LastName           VARCHAR(100),
    @PhoneNumber        VARCHAR(20) = NULL,
    @NationalID         VARCHAR(50),
    @DateOfBirth        DATE = NULL,
    @Gender             VARCHAR(10) = NULL,
    @LicenseNumber      VARCHAR(50),
    @LicenseExpiryDate  DATE,
    @CancellationRate   DECIMAL(5,2) = NULL,
    @AverageRating      DECIMAL(3,2) = NULL,
    @Status             VARCHAR(20),
    @IsOnline           BIT,
    @JoinDate           DATE,
    @LastOnlineTime     DATETIME = NULL,
    @BankAccountNumber  VARCHAR(50) = NULL,
    @HomeZoneID         INT = NULL
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot update: Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @HomeZoneID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @HomeZoneID)
    BEGIN
        PRINT 'Cannot update Driver: Zone with ID ' + CAST(@HomeZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE Driver SET
        FirstName          = @FirstName,
        LastName           = @LastName,
        PhoneNumber        = @PhoneNumber,
        NationalID         = @NationalID,
        DateOfBirth        = @DateOfBirth,
        Gender             = @Gender,
        LicenseNumber      = @LicenseNumber,
        LicenseExpiryDate  = @LicenseExpiryDate,
        CancellationRate   = @CancellationRate,
        AverageRating      = @AverageRating,
        Status             = @Status,
        IsOnline           = @IsOnline,
        JoinDate           = @JoinDate,
        LastOnlineTime     = @LastOnlineTime,
        BankAccountNumber  = @BankAccountNumber,
        HomeZoneID         = @HomeZoneID
    WHERE DriverID = @DriverID;
END
GO
-- EXEC sp_UpdateDriver
--     @DriverID           = 10,
--     @FirstName          = 'Ahmed',
--     @LastName           = 'Hassan',
--     @PhoneNumber        = '01098765432',    -- optional (NULL allowed)
--     @NationalID         = '29901011234567',
--     @DateOfBirth        = '1999-01-01',     -- optional (NULL allowed)
--     @Gender             = 'Male',           -- optional (NULL allowed)
--     @LicenseNumber      = 'LIC-00123',
--     @LicenseExpiryDate  = '2028-05-01',
--     @CancellationRate   = 0.03,             -- optional (NULL allowed)
--     @AverageRating      = 4.80,             -- optional (NULL allowed)
--     @Status             = 'Active',
--     @IsOnline           = 1,
--     @JoinDate           = '2024-01-15',
--     @LastOnlineTime     = '2025-04-10 14:30:00', -- optional (NULL allowed)
--     @BankAccountNumber  = 'BK-9900123',          -- optional (NULL allowed)
--     @HomeZoneID         = 5;                     -- optional (NULL allowed)
-- ============================================================
CREATE PROCEDURE sp_DeleteDriver
    @DriverID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot delete: Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Driver WHERE DriverID = @DriverID;
END
GO
-- EXEC sp_DeleteDriver @DriverID = 10;

-- ============================================================
-- DRIVER EARNINGS
-- ============================================================

CREATE PROCEDURE sp_GetDriverEarnings
AS
BEGIN
    SELECT * FROM DriverEarnings;
END
GO
-- EXEC sp_GetDriverEarnings;
-- ============================================================
CREATE PROCEDURE sp_GetDriverEarningsByID
    @EarningsID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM DriverEarnings WHERE EarningsID = @EarningsID)
    BEGIN
        PRINT 'Driver earning record with ID ' + CAST(@EarningsID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM DriverEarnings WHERE EarningsID = @EarningsID;
END
GO
-- EXEC sp_GetDriverEarningsByID @EarningsID = 1;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertDriverEarning
    @EarningsID          INT,
    @DriverID            INT,
    @TripID              INT,
    @GrossEarning        DECIMAL(10,2),
    @PlatformCommission   DECIMAL(10,2),
    @BonusAmount         DECIMAL(10,2) = NULL,
    @NetEarning          DECIMAL(10,2),
    @EarningDate         DATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM DriverEarnings WHERE EarningsID = @EarningsID)
    BEGIN
        PRINT 'Cannot insert Driver Earning: EarningsID ' + CAST(@EarningsID AS VARCHAR) + ' is already registered.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot insert Driver Earning: Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot insert Driver Earning: Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    INSERT INTO DriverEarnings
        (EarningsID, DriverID, TripID, GrossEarning, PlatformCommission, BonusAmount, NetEarning, EarningDate)
    VALUES
        (@EarningsID, @DriverID, @TripID, @GrossEarning, @PlatformCommission, @BonusAmount, @NetEarning, @EarningDate);

END
GO
-- EXEC sp_InsertDriverEarning
--     @EarningsID         = 1,
--     @DriverID           = 10,
--     @TripID             = 100,
--     @GrossEarning       = 120.00,
--     @PlatformCommission = 24.00,
--     @BonusAmount        = 10.00,    -- optional (NULL allowed)
--     @NetEarning         = 106.00,
--     @EarningDate        = '2025-04-10';
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateDriverEarning
    @EarningsID           INT,
    @DriverID            INT,
    @TripID              INT,
    @GrossEarning        DECIMAL(10,2),
    @PlatformCommission   DECIMAL(10,2),
    @BonusAmount         DECIMAL(10,2) = NULL,
    @NetEarning          DECIMAL(10,2),
    @EarningDate         DATE
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM DriverEarnings WHERE EarningsID = @EarningsID)
    BEGIN
        PRINT 'Cannot update: Driver earning record with ID ' + CAST(@EarningsID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot update Driver Earning: Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot update Driver Earning: Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE DriverEarnings SET
        DriverID           = @DriverID,
        TripID             = @TripID,
        GrossEarning       = @GrossEarning,
        PlatformCommission  = @PlatformCommission,
        BonusAmount        = @BonusAmount,
        NetEarning         = @NetEarning,
        EarningDate        = @EarningDate
    WHERE EarningsID = @EarningsID;
END
GO
-- EXEC sp_UpdateDriverEarning
--     @EarningsID         = 1,
--     @DriverID           = 10,
--     @TripID             = 100,
--     @GrossEarning       = 130.00,
--     @PlatformCommission = 26.00,
--     @BonusAmount        = 15.00,    -- optional (NULL allowed)
--     @NetEarning         = 119.00,
--     @EarningDate        = '2025-04-11';
-- ============================================================
CREATE PROCEDURE sp_DeleteDriverEarning
    @EarningsID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM DriverEarnings WHERE EarningsID = @EarningsID)
    BEGIN
        PRINT 'Cannot delete: Driver earning record with ID ' + CAST(@EarningsID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM DriverEarnings WHERE EarningsID = @EarningsID;
END
GO
-- EXEC sp_DeleteDriverEarning @EarningsID = 1;

-- ============================================================
-- ZONE
-- ============================================================

CREATE PROCEDURE sp_GetZones
AS
BEGIN
    SELECT * FROM Zone;
END
GO
-- EXEC sp_GetZones;
-- ============================================================
CREATE PROCEDURE sp_GetZoneByID
    @ZoneID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @ZoneID)
    BEGIN
        PRINT 'Zone with ID ' + CAST(@ZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Zone WHERE ZoneID = @ZoneID;
END
GO
-- EXEC sp_GetZoneByID @ZoneID = 3;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertZone
    @ZoneID      INT,
    @ZoneName    VARCHAR(100),
    @Region      VARCHAR(100) = NULL,
    @Governorate VARCHAR(100) = NULL,
    @City        VARCHAR(100) = NULL,
    @Latitude    DECIMAL(9,6),
    @Longitude   DECIMAL(9,6)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @ZoneID)
    BEGIN
        PRINT 'Cannot insert Zone: Zone ID ' + CAST(@ZoneID AS VARCHAR) + ' already exists.';
        RETURN;
    END
    INSERT INTO Zone (ZoneID, ZoneName, Region, Governorate, City, Latitude, Longitude)
    VALUES (@ZoneID, @ZoneName, @Region, @Governorate, @City, @Latitude, @Longitude);

END
GO
-- EXEC sp_InsertZone
--     @ZoneID      = 3,
--     @ZoneName    = 'Maadi',
--     @Region      = 'Greater Cairo',   -- optional (NULL allowed)
--     @Governorate = 'Cairo',           -- optional (NULL allowed)
--     @City        = 'Cairo',           -- optional (NULL allowed)
--     @Latitude    = 29.960600,
--     @Longitude   = 31.257400;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateZone
    @ZoneID      INT,
    @ZoneName    VARCHAR(100),
    @Region      VARCHAR(100) = NULL,
    @Governorate VARCHAR(100) = NULL,
    @City        VARCHAR(100) = NULL,
    @Latitude    DECIMAL(9,6),
    @Longitude   DECIMAL(9,6)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @ZoneID)
    BEGIN
        PRINT 'Cannot update: Zone with ID ' + CAST(@ZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE Zone SET
        ZoneName    = @ZoneName,
        Region      = @Region,
        Governorate = @Governorate,
        City        = @City,
        Latitude    = @Latitude,
        Longitude   = @Longitude
    WHERE ZoneID = @ZoneID;
END
GO
-- EXEC sp_UpdateZone
--     @ZoneID      = 3,
--     @ZoneName    = 'Maadi Extended',
--     @Region      = 'Greater Cairo',   -- optional (NULL allowed)
--     @Governorate = 'Cairo',           -- optional (NULL allowed)
--     @City        = 'Cairo',           -- optional (NULL allowed)
--     @Latitude    = 29.961000,
--     @Longitude   = 31.258000;
-- ============================================================
CREATE PROCEDURE sp_DeleteZone
    @ZoneID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @ZoneID)
    BEGIN
        PRINT 'Cannot delete: Zone with ID ' + CAST(@ZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Zone WHERE ZoneID = @ZoneID;
END
GO
-- EXEC sp_DeleteZone @ZoneID = 3;

-- ============================================================
-- RIDER
-- ============================================================

CREATE PROCEDURE sp_GetRiders
AS
BEGIN
    SELECT * FROM Rider;
END
GO
-- EXEC sp_GetRiders;
-- ============================================================
CREATE PROCEDURE sp_GetRiderByID
    @RiderID INT
AS
BEGIN
IF NOT EXISTS (SELECT 1 FROM Rider WHERE RiderID = @RiderID)
    BEGIN
        PRINT 'Rider with ID ' + CAST(@RiderID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Rider WHERE RiderID = @RiderID;
END
GO
-- EXEC sp_GetRiderByID @RiderID = 5;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertRider
    @RiderID          INT,
    @FirstName        VARCHAR(100),
    @LastName         VARCHAR(100),
    @Email            VARCHAR(150),
    @PhoneNumber      VARCHAR(20) = NULL,
    @Gender           VARCHAR(10) = NULL,
    @DateOfBirth      DATE = NULL,
    @RegistrationDate DATE,
    @Status           VARCHAR(20),
    @AverageRating    DECIMAL(3,2) = NULL,
    @LastTripDate     DATE = NULL,
    @HomeZoneID       INT = NULL
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Rider WHERE RiderID = @RiderID)
    BEGIN
        PRINT 'Cannot insert Rider: RiderID ' + CAST(@RiderID AS VARCHAR) + ' is already registered.';
        RETURN;
    END

    IF @HomeZoneID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @HomeZoneID)
    BEGIN
        PRINT 'Cannot insert Rider: Zone with ID ' + CAST(@HomeZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    INSERT INTO Rider
        (RiderID, FirstName, LastName, Email, PhoneNumber, Gender, DateOfBirth,
         RegistrationDate, Status, AverageRating, LastTripDate, HomeZoneID)
    VALUES
        (@RiderID, @FirstName, @LastName, @Email, @PhoneNumber, @Gender, @DateOfBirth,
         @RegistrationDate, @Status, @AverageRating, @LastTripDate, @HomeZoneID);

END
GO
-- EXEC sp_InsertRider
--     @RiderID          = 5,
--     @FirstName        = 'Sara',
--     @LastName         = 'Ali',
--     @Email            = 'sara.ali@email.com',
--     @PhoneNumber      = '01198765432',   -- optional (NULL allowed)
--     @Gender           = 'Female',        -- optional (NULL allowed)
--     @DateOfBirth      = '1998-07-15',    -- optional (NULL allowed)
--     @RegistrationDate = '2024-03-01',
--     @Status           = 'Active',
--     @AverageRating    = NULL,            -- optional (NULL allowed)
--     @LastTripDate     = NULL,            -- optional (NULL allowed)
--     @HomeZoneID       = 3;              -- optional (NULL allowed)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateRider
    @RiderID          INT,
    @FirstName        VARCHAR(100),
    @LastName         VARCHAR(100),
    @Email            VARCHAR(150),
    @PhoneNumber      VARCHAR(20) = NULL,
    @Gender           VARCHAR(10) = NULL,
    @DateOfBirth      DATE = NULL,
    @RegistrationDate DATE,
    @Status           VARCHAR(20),
    @AverageRating    DECIMAL(3,2) = NULL,
    @LastTripDate     DATE = NULL,
    @HomeZoneID       INT = NULL
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Rider WHERE RiderID = @RiderID)
    BEGIN
        PRINT 'Cannot update: Rider with ID ' + CAST(@RiderID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @HomeZoneID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @HomeZoneID)
    BEGIN
        PRINT 'Cannot update Rider: Zone with ID ' + CAST(@HomeZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE Rider SET
        FirstName        = @FirstName,
        LastName         = @LastName,
        Email            = @Email,
        PhoneNumber      = @PhoneNumber,
        Gender           = @Gender,
        DateOfBirth      = @DateOfBirth,
        RegistrationDate = @RegistrationDate,
        Status           = @Status,
        AverageRating    = @AverageRating,
        LastTripDate     = @LastTripDate,
        HomeZoneID       = @HomeZoneID
    WHERE RiderID = @RiderID;
END
GO
-- EXEC sp_UpdateRider
--     @RiderID          = 5,
--     @FirstName        = 'Sara',
--     @LastName         = 'Ali',
--     @Email            = 'sara.new@email.com',
--     @PhoneNumber      = '01198765432',   -- optional (NULL allowed)
--     @Gender           = 'Female',        -- optional (NULL allowed)
--     @DateOfBirth      = '1998-07-15',    -- optional (NULL allowed)
--     @RegistrationDate = '2024-03-01',
--     @Status           = 'Active',
--     @AverageRating    = 4.75,            -- optional (NULL allowed)
--     @LastTripDate     = '2025-04-09',    -- optional (NULL allowed)
--     @HomeZoneID       = 5;              -- optional (NULL allowed)
-- ============================================================
CREATE PROCEDURE sp_DeleteRider
    @RiderID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Rider WHERE RiderID = @RiderID)
    BEGIN
        PRINT 'Cannot delete: Rider with ID ' + CAST(@RiderID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Rider WHERE RiderID = @RiderID;
END
GO
-- EXEC sp_DeleteRider @RiderID = 5;

-- ============================================================
-- SEASONAL PATTERNS
-- ============================================================

CREATE PROCEDURE sp_GetSeasonalPatterns
AS
BEGIN
    SELECT * FROM SeasonalPatterns;
END
GO
-- EXEC sp_GetSeasonalPatterns;
-- ============================================================
CREATE PROCEDURE sp_GetSeasonalPatternByID
    @SeasonID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM SeasonalPatterns WHERE SeasonID = @SeasonID)
    BEGIN
        PRINT 'Seasonal pattern with ID ' + CAST(@SeasonID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM SeasonalPatterns WHERE SeasonID = @SeasonID;
END
GO
-- EXEC sp_GetSeasonalPatternByID @SeasonID = 2;
-- ============================================================
CREATE PROCEDURE sp_InsertSeasonalPattern
    @SeasonID              INT,
    @SeasonType            VARCHAR(50),
    @SeasonStartDate       DATE,
    @SeasonEndDate         DATE,
    @SeasonalSurgeMultiplier DECIMAL(4,2)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM SeasonalPatterns WHERE SeasonID = @SeasonID)
    BEGIN
        PRINT 'Cannot insert Seasonal Pattern: SeasonID ' + CAST(@SeasonID AS VARCHAR) + ' already exists.';
        RETURN;
    END
    INSERT INTO SeasonalPatterns
        (SeasonID, SeasonType, SeasonStartDate, SeasonEndDate, SeasonalSurgeMultiplier)
    VALUES
        (@SeasonID, @SeasonType, @SeasonStartDate, @SeasonEndDate, @SeasonalSurgeMultiplier);

END
GO
-- EXEC sp_InsertSeasonalPattern
--     @SeasonID               = 2,
--     @SeasonType             = 'Summer',
--     @SeasonStartDate        = '2025-06-01',
--     @SeasonEndDate          = '2025-08-31',
--     @SeasonalSurgeMultiplier = 1.30;
-- ============================================================
CREATE PROCEDURE sp_UpdateSeasonalPattern
    @SeasonID              INT,
    @SeasonType            VARCHAR(50),
    @SeasonStartDate       DATE,
    @SeasonEndDate         DATE,
    @SeasonalSurgeMultiplier DECIMAL(4,2)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM SeasonalPatterns WHERE SeasonID = @SeasonID)
    BEGIN
        PRINT 'Cannot update: Seasonal pattern with ID ' + CAST(@SeasonID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE SeasonalPatterns SET
        SeasonType             = @SeasonType,
        SeasonStartDate        = @SeasonStartDate,
        SeasonEndDate          = @SeasonEndDate,
        SeasonalSurgeMultiplier = @SeasonalSurgeMultiplier
    WHERE SeasonID = @SeasonID;
END
GO
-- EXEC sp_UpdateSeasonalPattern
--     @SeasonID               = 2,
--     @SeasonType             = 'High Summer',
--     @SeasonStartDate        = '2025-06-15',
--     @SeasonEndDate          = '2025-09-15',
--     @SeasonalSurgeMultiplier = 1.50;
-- ============================================================
CREATE PROCEDURE sp_DeleteSeasonalPattern
    @SeasonID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM SeasonalPatterns WHERE SeasonID = @SeasonID)
    BEGIN
        PRINT 'Cannot delete: Seasonal pattern with ID ' + CAST(@SeasonID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM SeasonalPatterns WHERE SeasonID = @SeasonID;
END
GO
-- EXEC sp_DeleteSeasonalPattern @SeasonID = 2;

-- ============================================================
-- TRIP
-- ============================================================

CREATE PROCEDURE sp_GetTrips
AS
BEGIN
    SELECT * FROM Trip;
END
GO
-- EXEC sp_GetTrips;
-- ============================================================
CREATE PROCEDURE sp_GetTripByID
    @TripID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Trip WHERE TripID = @TripID;
END
GO
-- EXEC sp_GetTripByID @TripID = 100;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertTrip
    @TripID               INT,
    @RiderID              INT,
    @DriverID             INT = NULL,
    @PickupZoneID         INT,
    @DropOffZoneID        INT,
    @PaymentID            INT = NULL,
    @PromotionID          INT = NULL,
    @SeasonID             INT = NULL,
    @SurgeRuleID          INT = NULL,
    @RequestTime          DATETIME,
    @AcceptanceTime       DATETIME = NULL,
    @PickupTime           DATETIME = NULL,
    @DropOffTime          DATETIME = NULL,
    @Status               VARCHAR(30),
    @DistanceKM           DECIMAL(8,2) = NULL,
    @DurationMinutes      INT = NULL,
    @BaseFare             DECIMAL(8,2) = NULL,
    @SeasonalSurgeMultiplier DECIMAL(4,2) = NULL,
    @TimeSurgeMultiplier  DECIMAL(4,2) = NULL,
    @DiscountPercentage   DECIMAL(5,2) = NULL,
    @FinalFare            DECIMAL(8,2) = NULL,
    @CancellationReason   VARCHAR(255) = NULL,
    @CancelledBy          VARCHAR(50) = NULL
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot insert TripID: TripID ' + CAST(@TripID AS VARCHAR) + ' already exists.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Rider WHERE RiderID = @RiderID)
    BEGIN
        PRINT 'Cannot insert Trip: Rider with ID ' + CAST(@RiderID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @DriverID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot insert Trip: Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @PickupZoneID)
    BEGIN
        PRINT 'Cannot insert Trip: Pickup zone with ID ' + CAST(@PickupZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @DropOffZoneID)
    BEGIN
        PRINT 'Cannot insert Trip: Drop-off zone with ID ' + CAST(@DropOffZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @PaymentID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Payment WHERE PaymentID = @PaymentID)
    BEGIN
        PRINT 'Cannot insert Trip: Payment with ID ' + CAST(@PaymentID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @PromotionID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Promotion WHERE PromotionID = @PromotionID)
    BEGIN
        PRINT 'Cannot insert Trip: Promotion with ID ' + CAST(@PromotionID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @SeasonID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM SeasonalPatterns WHERE SeasonID = @SeasonID)
    BEGIN
        PRINT 'Cannot insert Trip: Seasonal pattern with ID ' + CAST(@SeasonID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @SurgeRuleID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM PeakHourSurgeRules WHERE SurgeRuleID = @SurgeRuleID)
    BEGIN
        PRINT 'Cannot insert Trip: Surge rule with ID ' + CAST(@SurgeRuleID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    INSERT INTO Trip
        (TripID, RiderID, DriverID, PickupZoneID, DropOffZoneID, PaymentID, PromotionID,
         SeasonID, SurgeRuleID, RequestTime, AcceptanceTime, PickupTime, DropOffTime,
         Status, DistanceKM, DurationMinutes, BaseFare, SeasonalSurgeMultiplier,
         TimeSurgeMultiplier, DiscountPercentage, FinalFare, CancellationReason, CancelledBy)
    VALUES
        (@TripID, @RiderID, @DriverID, @PickupZoneID, @DropOffZoneID, @PaymentID, @PromotionID,
         @SeasonID, @SurgeRuleID, @RequestTime, @AcceptanceTime, @PickupTime, @DropOffTime,
         @Status, @DistanceKM, @DurationMinutes, @BaseFare, @SeasonalSurgeMultiplier,
         @TimeSurgeMultiplier, @DiscountPercentage, @FinalFare, @CancellationReason, @CancelledBy);

END
GO
-- EXEC sp_InsertTrip
--     @TripID               = 100,
--     @RiderID              = 5,
--     @DriverID             = 10,            -- optional (NULL allowed)
--     @PickupZoneID         = 3,
--     @DropOffZoneID        = 7,
--     @PaymentID            = 20,            -- optional (NULL allowed)
--     @PromotionID          = 2,             -- optional (NULL allowed)
--     @SeasonID             = 1,             -- optional (NULL allowed)
--     @SurgeRuleID          = 4,             -- optional (NULL allowed)
--     @RequestTime          = '2025-04-10 08:00:00',
--     @AcceptanceTime       = '2025-04-10 08:02:00',  -- optional (NULL allowed)
--     @PickupTime           = '2025-04-10 08:10:00',  -- optional (NULL allowed)
--     @DropOffTime          = '2025-04-10 08:40:00',  -- optional (NULL allowed)
--     @Status               = 'Completed',
--     @DistanceKM           = 12.50,         -- optional (NULL allowed)
--     @DurationMinutes      = 30,            -- optional (NULL allowed)
--     @BaseFare             = 43.75,         -- optional (NULL allowed)
--     @SeasonalSurgeMultiplier = 1.10,       -- optional (NULL allowed)
--     @TimeSurgeMultiplier  = 1.20,          -- optional (NULL allowed)
--     @DiscountPercentage   = 10.00,         -- optional (NULL allowed)
--     @FinalFare            = 52.00,         -- optional (NULL allowed)
--     @CancellationReason   = NULL,          -- optional (NULL allowed)
--     @CancelledBy          = NULL;          -- optional (NULL allowed)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateTrip
    @TripID               INT,
    @RiderID              INT,
    @DriverID             INT = NULL,
    @PickupZoneID         INT,
    @DropOffZoneID        INT,
    @PaymentID            INT = NULL,
    @PromotionID          INT = NULL,
    @SeasonID             INT = NULL,
    @SurgeRuleID          INT = NULL,
    @RequestTime          DATETIME,
    @AcceptanceTime       DATETIME = NULL,
    @PickupTime           DATETIME = NULL,
    @DropOffTime          DATETIME = NULL,
    @Status               VARCHAR(30),
    @DistanceKM           DECIMAL(8,2) = NULL,
    @DurationMinutes      INT = NULL,
    @BaseFare             DECIMAL(8,2) = NULL,
    @SeasonalSurgeMultiplier DECIMAL(4,2) = NULL,
    @TimeSurgeMultiplier  DECIMAL(4,2) = NULL,
    @DiscountPercentage   DECIMAL(5,2) = NULL,
    @FinalFare            DECIMAL(8,2) = NULL,
    @CancellationReason   VARCHAR(255) = NULL,
    @CancelledBy          VARCHAR(50) = NULL
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot update: Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Rider WHERE RiderID = @RiderID)
    BEGIN
        PRINT 'Cannot update Trip: Rider with ID ' + CAST(@RiderID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @DriverID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Driver WHERE DriverID = @DriverID)
    BEGIN
        PRINT 'Cannot update Trip: Driver with ID ' + CAST(@DriverID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @PickupZoneID)
    BEGIN
        PRINT 'Cannot update Trip: Pickup zone with ID ' + CAST(@PickupZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Zone WHERE ZoneID = @DropOffZoneID)
    BEGIN
        PRINT 'Cannot update Trip: Drop-off zone with ID ' + CAST(@DropOffZoneID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @PaymentID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Payment WHERE PaymentID = @PaymentID)
    BEGIN
        PRINT 'Cannot update Trip: Payment with ID ' + CAST(@PaymentID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @PromotionID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Promotion WHERE PromotionID = @PromotionID)
    BEGIN
        PRINT 'Cannot update Trip: Promotion with ID ' + CAST(@PromotionID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @SeasonID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM SeasonalPatterns WHERE SeasonID = @SeasonID)
    BEGIN
        PRINT 'Cannot update Trip: Seasonal pattern with ID ' + CAST(@SeasonID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @SurgeRuleID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM PeakHourSurgeRules WHERE SurgeRuleID = @SurgeRuleID)
    BEGIN
        PRINT 'Cannot update Trip: Surge rule with ID ' + CAST(@SurgeRuleID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE Trip SET
        RiderID                 = @RiderID,
        DriverID                = @DriverID,
        PickupZoneID            = @PickupZoneID,
        DropOffZoneID           = @DropOffZoneID,
        PaymentID               = @PaymentID,
        PromotionID             = @PromotionID,
        SeasonID                = @SeasonID,
        SurgeRuleID             = @SurgeRuleID,
        RequestTime             = @RequestTime,
        AcceptanceTime          = @AcceptanceTime,
        PickupTime              = @PickupTime,
        DropOffTime             = @DropOffTime,
        Status                  = @Status,
        DistanceKM              = @DistanceKM,
        DurationMinutes         = @DurationMinutes,
        BaseFare                = @BaseFare,
        SeasonalSurgeMultiplier = @SeasonalSurgeMultiplier,
        TimeSurgeMultiplier     = @TimeSurgeMultiplier,
        DiscountPercentage      = @DiscountPercentage,
        FinalFare               = @FinalFare,
        CancellationReason      = @CancellationReason,
        CancelledBy             = @CancelledBy
    WHERE TripID = @TripID;
END
GO
-- EXEC sp_UpdateTrip
--     @TripID               = 100,
--     @RiderID              = 5,
--     @DriverID             = 10,            -- optional (NULL allowed)
--     @PickupZoneID         = 3,
--     @DropOffZoneID        = 7,
--     @PaymentID            = 20,            -- optional (NULL allowed)
--     @PromotionID          = NULL,          -- optional (NULL allowed)
--     @SeasonID             = 1,             -- optional (NULL allowed)
--     @SurgeRuleID          = 4,             -- optional (NULL allowed)
--     @RequestTime          = '2025-04-10 08:00:00',
--     @AcceptanceTime       = '2025-04-10 08:02:00',  -- optional (NULL allowed)
--     @PickupTime           = '2025-04-10 08:10:00',  -- optional (NULL allowed)
--     @DropOffTime          = '2025-04-10 08:45:00',  -- optional (NULL allowed)
--     @Status               = 'Completed',
--     @DistanceKM           = 13.00,         -- optional (NULL allowed)
--     @DurationMinutes      = 35,            -- optional (NULL allowed)
--     @BaseFare             = 45.50,         -- optional (NULL allowed)
--     @SeasonalSurgeMultiplier = 1.10,       -- optional (NULL allowed)
--     @TimeSurgeMultiplier  = 1.20,          -- optional (NULL allowed)
--     @DiscountPercentage   = NULL,          -- optional (NULL allowed)
--     @FinalFare            = 60.06,         -- optional (NULL allowed)
--     @CancellationReason   = NULL,          -- optional (NULL allowed)
--     @CancelledBy          = NULL;          -- optional (NULL allowed)
-- ============================================================
CREATE PROCEDURE sp_DeleteTrip
    @TripID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot delete: Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Trip WHERE TripID = @TripID;
END
GO
-- EXEC sp_DeleteTrip @TripID = 100;

-- ============================================================
-- PAYMENT
-- ============================================================

CREATE PROCEDURE sp_GetPayments
AS
BEGIN
    SELECT * FROM Payment;
END
GO
-- EXEC sp_GetPayments;
-- ============================================================
CREATE PROCEDURE sp_GetPaymentByID
    @PaymentID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Payment WHERE PaymentID = @PaymentID)
    BEGIN
        PRINT 'Payment with ID ' + CAST(@PaymentID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Payment WHERE PaymentID = @PaymentID;
END
GO
-- EXEC sp_GetPaymentByID @PaymentID = 20;
-- ============================================================
CREATE PROCEDURE sp_InsertPayment
    @PaymentID   INT,
    @MethodName  VARCHAR(50),
    @Amount      DECIMAL(10,2),
    @Status      VARCHAR(20)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Payment WHERE PaymentID = @PaymentID)
    BEGIN
        PRINT 'Cannot insert Payment: PaymentID ' + CAST(@PaymentID AS VARCHAR) + ' already exists.';
        RETURN;
    END
    INSERT INTO Payment (PaymentID, MethodName, Amount, Status)
    VALUES (@PaymentID, @MethodName, @Amount, @Status);

END
GO
-- EXEC sp_InsertPayment
--     @PaymentID  = 20,
--     @MethodName = 'Credit Card',
--     @Amount     = 52.00,
--     @Status     = 'Completed';
-- ============================================================
CREATE PROCEDURE sp_UpdatePayment
    @PaymentID   INT,
    @MethodName  VARCHAR(50),
    @Amount      DECIMAL(10,2),
    @Status      VARCHAR(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Payment WHERE PaymentID = @PaymentID)
    BEGIN
        PRINT 'Cannot update: Payment with ID ' + CAST(@PaymentID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE Payment SET
        MethodName = @MethodName,
        Amount     = @Amount,
        Status     = @Status
    WHERE PaymentID = @PaymentID;
END
GO
-- EXEC sp_UpdatePayment
--     @PaymentID  = 20,
--     @MethodName = 'Wallet',
--     @Amount     = 60.06,
--     @Status     = 'Completed';
-- ============================================================
CREATE PROCEDURE sp_DeletePayment
    @PaymentID INT
AS
BEGIN
IF NOT EXISTS (SELECT 1 FROM Payment WHERE PaymentID = @PaymentID)
    BEGIN
        PRINT 'Cannot delete: Payment with ID ' + CAST(@PaymentID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Payment WHERE PaymentID = @PaymentID;
END
GO
-- EXEC sp_DeletePayment @PaymentID = 20;

-- ============================================================
-- COMPLAINT
-- ============================================================

CREATE PROCEDURE sp_GetComplaints
AS
BEGIN
    SELECT * FROM Complaint;
END
GO
-- EXEC sp_GetComplaints;
-- ============================================================
CREATE PROCEDURE sp_GetComplaintByID
    @ComplaintID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Complaint WHERE ComplaintID = @ComplaintID)
    BEGIN
        PRINT 'Complaint with ID ' + CAST(@ComplaintID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Complaint WHERE ComplaintID = @ComplaintID;
END
GO
-- EXEC sp_GetComplaintByID @ComplaintID = 7;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertComplaint
    @ComplaintID     INT,
    @TripID          INT,
    @ComplaintCategory VARCHAR(100),
    @SeverityLevel   VARCHAR(20),
    @Description     VARCHAR(MAX) = NULL,
    @FilingDate      DATE,
    @ResolutionDate  DATE = NULL,
    @ResolutionNotes VARCHAR(MAX) = NULL,
    @Status          VARCHAR(20)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Complaint WHERE ComplaintID = @ComplaintID)
    BEGIN
        PRINT 'Cannot insert Complaint: ComplaintID ' + CAST(@ComplaintID AS VARCHAR) + ' already exists.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot insert Complaint: Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    INSERT INTO Complaint
        (ComplaintID, TripID, ComplaintCategory, SeverityLevel, Description,
         FilingDate, ResolutionDate, ResolutionNotes, Status)
    VALUES
        (@ComplaintID, @TripID, @ComplaintCategory, @SeverityLevel, @Description,
         @FilingDate, @ResolutionDate, @ResolutionNotes, @Status);

END
GO
-- EXEC sp_InsertComplaint
--     @ComplaintID       = 7,
--     @TripID            = 100,
--     @ComplaintCategory = 'Driver Behavior',
--     @SeverityLevel     = 'High',
--     @Description       = 'Driver was rude and took wrong route.',  -- optional (NULL allowed)
--     @FilingDate        = '2025-04-10',
--     @ResolutionDate    = NULL,          -- optional (NULL allowed)
--     @ResolutionNotes   = NULL,          -- optional (NULL allowed)
--     @Status            = 'Open';
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateComplaint
    @ComplaintID     INT,
    @TripID          INT,
    @ComplaintCategory VARCHAR(100),
    @SeverityLevel   VARCHAR(20),
    @Description     VARCHAR(MAX) = NULL,
    @FilingDate      DATE,
    @ResolutionDate  DATE = NULL,
    @ResolutionNotes VARCHAR(MAX) = NULL,
    @Status          VARCHAR(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Complaint WHERE ComplaintID = @ComplaintID)
    BEGIN
        PRINT 'Cannot update: Complaint with ID ' + CAST(@ComplaintID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot update Complaint: Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    UPDATE Complaint SET
        TripID             = @TripID,
        ComplaintCategory  = @ComplaintCategory,
        SeverityLevel      = @SeverityLevel,
        Description        = @Description,
        FilingDate         = @FilingDate,
        ResolutionDate     = @ResolutionDate,
        ResolutionNotes    = @ResolutionNotes,
        Status             = @Status
    WHERE ComplaintID = @ComplaintID;
END
GO
-- EXEC sp_UpdateComplaint
--     @ComplaintID       = 7,
--     @TripID            = 100,
--     @ComplaintCategory = 'Driver Behavior',
--     @SeverityLevel     = 'High',
--     @Description       = 'Driver was rude and took wrong route.',  -- optional (NULL allowed)
--     @FilingDate        = '2025-04-10',
--     @ResolutionDate    = '2025-04-12',           -- optional (NULL allowed)
--     @ResolutionNotes   = 'Driver warned.',        -- optional (NULL allowed)
--     @Status            = 'Resolved';
-- ============================================================
CREATE PROCEDURE sp_DeleteComplaint
    @ComplaintID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Complaint WHERE ComplaintID = @ComplaintID)
    BEGIN
        PRINT 'Cannot delete: Complaint with ID ' + CAST(@ComplaintID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Complaint WHERE ComplaintID = @ComplaintID;
END
GO
-- EXEC sp_DeleteComplaint @ComplaintID = 7;

-- ============================================================
-- RATING
-- ============================================================

CREATE PROCEDURE sp_GetRatings
AS
BEGIN
    SELECT * FROM Rating;
END
GO
-- EXEC sp_GetRatings;
-- ============================================================
CREATE PROCEDURE sp_GetRatingByID
    @RatingID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Rating WHERE RatingID = @RatingID)
    BEGIN
        PRINT 'Rating with ID ' + CAST(@RatingID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Rating WHERE RatingID = @RatingID;
END
GO
-- EXEC sp_GetRatingByID @RatingID = 15;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertRating
    @RatingID    INT,
    @TripID      INT,
    @RatedBy     VARCHAR(20),
    @RatingValue DECIMAL(3,2),
    @Comment     VARCHAR(MAX) = NULL,
    @RatingDate  DATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Rating WHERE RatingID = @RatingID)
    BEGIN
        PRINT 'Cannot insert Rating: RatingID ' + CAST(@RatingID AS VARCHAR) + ' already exists.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot insert Rating: Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

     IF @RatingValue < 1 OR @RatingValue > 5
     BEGIN
        PRINT 'Cannot insert Rating: RatingValue must be between 1 and 5.';
        RETURN;
    END
    INSERT INTO Rating (RatingID, TripID, RatedBy, RatingValue, Comment, RatingDate)
    VALUES (@RatingID, @TripID, @RatedBy, @RatingValue, @Comment, @RatingDate);

END
GO
-- EXEC sp_InsertRating
--     @RatingID    = 15,
--     @TripID      = 100,
--     @RatedBy     = 'Rider',
--     @RatingValue = 4.50,
--     @Comment     = 'Smooth ride, slightly late.',  -- optional (NULL allowed)
--     @RatingDate  = '2025-04-10';
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateRating
    @RatingID    INT,
    @TripID      INT,
    @RatedBy     VARCHAR(20),
    @RatingValue DECIMAL(3,2),
    @Comment     VARCHAR(MAX) = NULL,
    @RatingDate  DATE
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Rating WHERE RatingID = @RatingID)
    BEGIN
        PRINT 'Cannot update: Rating with ID ' + CAST(@RatingID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Trip WHERE TripID = @TripID)
    BEGIN
        PRINT 'Cannot update Rating: Trip with ID ' + CAST(@TripID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @RatingValue < 1 OR @RatingValue > 5
    BEGIN
        PRINT 'Cannot update Rating: RatingValue must be between 1 and 5.';
        RETURN;
    END
    UPDATE Rating SET
        TripID      = @TripID,
        RatedBy     = @RatedBy,
        RatingValue = @RatingValue,
        Comment     = @Comment,
        RatingDate  = @RatingDate
    WHERE RatingID = @RatingID;
END
GO
-- EXEC sp_UpdateRating
--     @RatingID    = 15,
--     @TripID      = 100,
--     @RatedBy     = 'Rider',
--     @RatingValue = 5.00,
--     @Comment     = 'Great driver!',   -- optional (NULL allowed)
--     @RatingDate  = '2025-04-10';
-- ============================================================
CREATE PROCEDURE sp_DeleteRating
    @RatingID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Rating WHERE RatingID = @RatingID)
    BEGIN
        PRINT 'Cannot delete: Rating with ID ' + CAST(@RatingID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Rating WHERE RatingID = @RatingID;
END
GO
-- EXEC sp_DeleteRating @RatingID = 15;

-- ============================================================
-- PEAK HOUR SURGE RULES
-- ============================================================

CREATE PROCEDURE sp_GetPeakHourSurgeRules
AS
BEGIN
    SELECT * FROM PeakHourSurgeRules;
END
GO
-- EXEC sp_GetPeakHourSurgeRules;
-- ============================================================
CREATE PROCEDURE sp_GetPeakHourSurgeRuleByID
    @SurgeRuleID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM PeakHourSurgeRules WHERE SurgeRuleID = @SurgeRuleID)
    BEGIN
        PRINT 'Peak hour surge rule with ID ' + CAST(@SurgeRuleID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM PeakHourSurgeRules WHERE SurgeRuleID = @SurgeRuleID;
END
GO
-- EXEC sp_GetPeakHourSurgeRuleByID @SurgeRuleID = 4;
-- ============================================================
CREATE PROCEDURE sp_InsertPeakHourSurgeRule
    @SurgeRuleID       INT,
    @RuleName          VARCHAR(100),
    @DayType           VARCHAR(20),
    @StartHour         TIME(7),
    @EndHour           TIME(7),
    @TimeSurgeMultiplier DECIMAL(4,2)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM PeakHourSurgeRules WHERE SurgeRuleID = @SurgeRuleID)
    BEGIN
        PRINT 'Cannot insert peak hour surge rule: SurgeRuleID ' + CAST(@SurgeRuleID AS VARCHAR) + ' already exists.';
        RETURN;
    END

    IF @EndHour <= @StartHour
    BEGIN
        PRINT 'Cannot insert Surge Rule: EndHour must be after StartHour.';
        RETURN;
    END
    INSERT INTO PeakHourSurgeRules
        (SurgeRuleID, RuleName, DayType, StartHour, EndHour, TimeSurgeMultiplier)
    VALUES
        (@SurgeRuleID, @RuleName, @DayType, @StartHour, @EndHour, @TimeSurgeMultiplier);

END
GO
-- EXEC sp_InsertPeakHourSurgeRule
--     @SurgeRuleID         = 4,
--     @RuleName            = 'Morning Rush',
--     @DayType             = 'Weekday',
--     @StartHour           = '07:00:00',
--     @EndHour             = '09:00:00',
--     @TimeSurgeMultiplier = 1.50;
-- ============================================================
CREATE PROCEDURE sp_UpdatePeakHourSurgeRule
    @SurgeRuleID       INT,
    @RuleName          VARCHAR(100),
    @DayType           VARCHAR(20),
    @StartHour         TIME(7),
    @EndHour           TIME(7),
    @TimeSurgeMultiplier DECIMAL(4,2)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM PeakHourSurgeRules WHERE SurgeRuleID = @SurgeRuleID)
    BEGIN
        PRINT 'Cannot update: Peak hour surge rule with ID ' + CAST(@SurgeRuleID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @EndHour <= @StartHour
    BEGIN
        PRINT 'Cannot update Surge Rule: EndHour must be after StartHour.';
        RETURN;
    END
    UPDATE PeakHourSurgeRules SET
        RuleName             = @RuleName,
        DayType              = @DayType,
        StartHour            = @StartHour,
        EndHour              = @EndHour,
        TimeSurgeMultiplier  = @TimeSurgeMultiplier
    WHERE SurgeRuleID = @SurgeRuleID;
END
GO
-- EXEC sp_UpdatePeakHourSurgeRule
--     @SurgeRuleID         = 4,
--     @RuleName            = 'Extended Morning Rush',
--     @DayType             = 'Weekday',
--     @StartHour           = '06:30:00',
--     @EndHour             = '09:30:00',
--     @TimeSurgeMultiplier = 1.75;
-- ============================================================
CREATE PROCEDURE sp_DeletePeakHourSurgeRule
    @SurgeRuleID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM PeakHourSurgeRules WHERE SurgeRuleID = @SurgeRuleID)
    BEGIN
        PRINT 'Cannot delete: Peak hour surge rule with ID ' + CAST(@SurgeRuleID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM PeakHourSurgeRules WHERE SurgeRuleID = @SurgeRuleID;
END
GO
-- EXEC sp_DeletePeakHourSurgeRule @SurgeRuleID = 4;

-- ============================================================
-- PROMOTION
-- ============================================================

CREATE PROCEDURE sp_GetPromotions
AS
BEGIN
    SELECT * FROM Promotion;
END
GO
-- EXEC sp_GetPromotions;
-- ============================================================
CREATE PROCEDURE sp_GetPromotionByID
    @PromotionID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Promotion WHERE PromotionID = @PromotionID)
    BEGIN
        PRINT 'Promotion with ID ' + CAST(@PromotionID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    SELECT * FROM Promotion WHERE PromotionID = @PromotionID;
END
GO
-- EXEC sp_GetPromotionByID @PromotionID = 2;
-- ============================================================
CREATE OR ALTER PROCEDURE sp_InsertPromotion
    @PromotionID        INT,
    @PromoCode          VARCHAR(50),
    @Campaign           VARCHAR(150) = NULL,
    @DiscountPercentage DECIMAL(5,2),
    @MaxUsageCount      INT = NULL,
    @StartDate          DATE,
    @EndDate            DATE,
    @Status             VARCHAR(20)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Promotion WHERE PromotionID = @PromotionID)
    BEGIN
        PRINT 'Cannot insert Promotion: PromotionID ' + CAST(@PromotionID AS VARCHAR) + ' already exists.';
        RETURN;
    END

    IF @DiscountPercentage < 0 OR @DiscountPercentage > 100
    BEGIN
        PRINT 'Cannot insert Promotion: DiscountPercentage must be between 0 and 100.';
        RETURN;
    END

    IF @EndDate <= @StartDate
    BEGIN
        PRINT 'Cannot insert Promotion: EndDate must be after StartDate.';
        RETURN;
    END
    INSERT INTO Promotion
        (PromotionID, PromoCode, Campaign, DiscountPercentage, MaxUsageCount, StartDate, EndDate, Status)
    VALUES
        (@PromotionID, @PromoCode, @Campaign, @DiscountPercentage, @MaxUsageCount, @StartDate, @EndDate, @Status);

END
GO
-- EXEC sp_InsertPromotion
--     @PromotionID        = 2,
--     @PromoCode          = 'SUMMER25',
--     @Campaign           = 'Summer Sale 2025',  -- optional (NULL allowed)
--     @DiscountPercentage = 25.00,
--     @MaxUsageCount      = 500,                 -- optional (NULL allowed)
--     @StartDate          = '2025-06-01',
--     @EndDate            = '2025-08-31',
--     @Status             = 'Active';
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdatePromotion
    @PromotionID        INT,
    @PromoCode          VARCHAR(50),
    @Campaign           VARCHAR(150) = NULL,
    @DiscountPercentage DECIMAL(5,2),
    @MaxUsageCount      INT = NULL,
    @StartDate          DATE,
    @EndDate            DATE,
    @Status             VARCHAR(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Promotion WHERE PromotionID = @PromotionID)
    BEGIN
        PRINT 'Cannot update: Promotion with ID ' + CAST(@PromotionID AS VARCHAR) + ' does not exist.';
        RETURN;
    END

    IF @DiscountPercentage < 0 OR @DiscountPercentage > 100
    BEGIN
        PRINT 'Cannot update Promotion: DiscountPercentage must be between 0 and 100.';
        RETURN;
    END

    IF @EndDate <= @StartDate
    BEGIN
        PRINT 'Cannot update Promotion: EndDate must be after StartDate.';
        RETURN;
    END
    UPDATE Promotion SET
        PromoCode          = @PromoCode,
        Campaign           = @Campaign,
        DiscountPercentage = @DiscountPercentage,
        MaxUsageCount      = @MaxUsageCount,
        StartDate          = @StartDate,
        EndDate            = @EndDate,
        Status             = @Status
    WHERE PromotionID = @PromotionID;
END
GO
-- EXEC sp_UpdatePromotion
--     @PromotionID        = 2,
--     @PromoCode          = 'SUMMER25',
--     @Campaign           = 'Extended Summer Sale',  -- optional (NULL allowed)
--     @DiscountPercentage = 30.00,
--     @MaxUsageCount      = 1000,                    -- optional (NULL allowed)
--     @StartDate          = '2025-06-01',
--     @EndDate            = '2025-09-30',
--     @Status             = 'Active';
-- ============================================================
CREATE PROCEDURE sp_DeletePromotion
    @PromotionID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Promotion WHERE PromotionID = @PromotionID)
    BEGIN
        PRINT 'Cannot delete: Promotion with ID ' + CAST(@PromotionID AS VARCHAR) + ' does not exist.';
        RETURN;
    END
    DELETE FROM Promotion WHERE PromotionID = @PromotionID;
END
GO
-- EXEC sp_DeletePromotion @PromotionID = 2;