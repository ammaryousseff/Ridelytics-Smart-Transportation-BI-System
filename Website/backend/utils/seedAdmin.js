// ============================================
// Ridelytics Backend - Admin User Seeder
// Creates AdminUsers table and default admin user
// ============================================
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const logger = require('./logger');

async function seedAdmin() {
  try {
    // Create AdminUsers table if it doesn't exist
    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AdminUsers' AND xtype='U')
      BEGIN
        CREATE TABLE AdminUsers (
          AdminID     INT IDENTITY(1,1) PRIMARY KEY,
          Email       VARCHAR(150)  NOT NULL UNIQUE,
          Password    VARCHAR(255)  NOT NULL,
          FullName    VARCHAR(100)  NOT NULL,
          Role        VARCHAR(50)   NOT NULL DEFAULT 'admin',
          IsActive    BIT           NOT NULL DEFAULT 1,
          CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
          LastLoginAt DATETIME      NULL
        );
      END
    `);

    // Check if default admin exists
    const result = await query(
      `SELECT COUNT(*) as count FROM AdminUsers WHERE Email = @email`,
      { email: 'admin@ridelytics.com' }
    );

    if (result.recordset[0].count === 0) {
      // Hash password and insert default admin
      const hashedPassword = await bcrypt.hash('Admin123', 12);
      await query(
        `INSERT INTO AdminUsers (Email, Password, FullName, Role)
         VALUES (@email, @password, @fullName, @role)`,
        {
          email: 'admin@ridelytics.com',
          password: hashedPassword,
          fullName: 'System Administrator',
          role: 'admin',
        }
      );
      logger.info('Default admin user created: admin@ridelytics.com');
    } else {
      logger.info('Admin user already exists');
    }
  } catch (err) {
    logger.error('Failed to seed admin user:', err.message);
    // Don't throw — allow server to start even if seeding fails
  }
}

module.exports = seedAdmin;
