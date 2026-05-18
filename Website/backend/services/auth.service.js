// ============================================
// Ridelytics Backend - Auth Service
// ============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const env = require('../config/env');

async function login(email, password) {
  const result = await query(
    'SELECT * FROM AdminUsers WHERE Email = @email AND IsActive = 1',
    { email }
  );

  if (result.recordset.length === 0) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const user = result.recordset[0];
  const isMatch = await bcrypt.compare(password, user.Password);

  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  // Update last login time
  await query(
    'UPDATE AdminUsers SET LastLoginAt = GETDATE() WHERE AdminID = @id',
    { id: user.AdminID }
  );

  const token = jwt.sign(
    { id: user.AdminID, email: user.Email, role: user.Role, name: user.FullName },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.AdminID,
      email: user.Email,
      name: user.FullName,
      role: user.Role,
    },
  };
}

async function getMe(userId) {
  const result = await query(
    'SELECT AdminID, Email, FullName, Role, CreatedAt, LastLoginAt FROM AdminUsers WHERE AdminID = @id',
    { id: userId }
  );

  if (result.recordset.length === 0) {
    throw Object.assign(new Error('User not found'), { status: 404 });
  }

  const user = result.recordset[0];
  return {
    id: user.AdminID,
    email: user.Email,
    name: user.FullName,
    role: user.Role,
    createdAt: user.CreatedAt,
    lastLogin: user.LastLoginAt,
  };
}

module.exports = { login, getMe };
