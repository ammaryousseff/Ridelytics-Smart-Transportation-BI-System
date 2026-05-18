# Ridelytics Website - Technical Specification

## 1. Overview
Ridelytics is a full-stack web application for transportation business intelligence. It provides dashboard analytics, entity management, and AI-assisted insights for admin users.

## 2. Goals
- Provide a clean BI dashboard with KPIs and charts.
- Enable secure admin login and role-based access.
- Allow CRUD management for core transportation entities.
- Offer AI chat insights through a webhook integration.

## 3. System Architecture
- Frontend: Next.js 15 (React 19, Tailwind CSS v3)
- Backend: Express.js REST API
- Database: SQL Server 2025 (Windows Authentication)
- Integration: n8n webhook for AI chat

## 4. Runtime Ports
- Frontend: 3001
- Backend API: 3000
- Database: 1433

## 5. Main Features
- Landing page with product overview
- Admin login and session handling
- Dashboard KPIs and charts
- CRUD management for 12 entities
- AI chat assistant for analysis
- Health endpoint for monitoring

## 6. Frontend Structure
- App Router pages: landing, login, admin dashboard, CRUD entity pages, chat
- Shared UI components: header, sidebar, topbar, modal, skeleton loader
- Client utilities: API wrapper, constants, helpers
- Context providers: auth and toast notifications

## 7. Backend Structure
- Controllers for auth, dashboard, CRUD, and chat
- Services for business logic and data access
- Middleware for auth, validation, rate limiting, and error handling
- Utilities for logging, query building, and admin seeding

## 8. API Endpoints
Auth:
- POST /api/auth/login
- GET /api/auth/me

Dashboard:
- GET /api/dashboard/kpis
- GET /api/dashboard/charts/*

CRUD:
- GET /api/crud/entities
- GET /api/crud/:entity
- GET /api/crud/:entity/:id
- POST /api/crud/:entity
- PUT /api/crud/:entity/:id
- DELETE /api/crud/:entity/:id

Chat:
- POST /api/chat/message

Health:
- GET /api/health

## 9. Database
Database name: RidelyticsOLTP

Entities (12):
- Zone
- Rider
- Driver
- Vehicle
- SeasonalPatterns
- PeakHourSurgeRules
- Payment
- Promotion
- Trip
- Rating
- Complaint
- DriverEarnings

## 10. Security
- JWT-based authentication for protected endpoints
- Password hashing with bcrypt
- Rate limiting on API routes

## 11. Configuration
Backend environment variables include:
- Database connection details
- N8N_CHAT_WEBHOOK_URL for chat integration

Frontend environment variables are stored in .env.local when needed.

## 12. Operational Notes
- Run backend and frontend as separate Node.js processes.
- Ensure SQL Server is configured with Windows Authentication.
- Execute the SQL schema and stored procedures before running the app.
