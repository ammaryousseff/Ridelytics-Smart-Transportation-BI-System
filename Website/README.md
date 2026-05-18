# 🚗 Ridelytics — Smart Transportation Business Intelligence System

A modern, production-ready full-stack web application for transportation business intelligence.

## Architecture

| Layer | Technology | Port |
|-------|-----------|------|
| Frontend | Next.js 15 + React 19 + Tailwind CSS v3 | 3001 |
| Backend API | Express.js + mssql | 3000 |
| Database | SQL Server 2025 (Windows Auth) | 1433 |

## Prerequisites

- **Node.js** 18+ (Download: https://nodejs.org)
- **SQL Server 2025** with the `RidelyticsOLTP` database created
- **Windows Authentication** enabled on SQL Server

## Quick Start

### 1. Database Setup

Run the SQL schema in your SQL Server:
```sql
-- In SSMS or Azure Data Studio:
-- CREATE DATABASE RidelyticsOLTP;
-- GO
-- USE RidelyticsOLTP;
-- GO
-- Then execute: Queries/OLTP Creating Tables.sql
-- Then execute: Queries/Stored_Procedures.sql
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

The API server starts at `http://localhost:3000`.

Default admin credentials:
- **Email:** admin@ridelytics.com
- **Password:** Admin123

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The web app starts at `http://localhost:3001`.

## Project Structure

```
Ridelytics Website/
├── backend/           # Express API
│   ├── config/        # Database, env, webhooks
│   ├── controllers/   # Request handlers
│   ├── middleware/     # Auth, error handling, rate limiting
│   ├── models/        # Entity configurations (12 tables)
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   └── utils/         # Logger, query builder, admin seeder
│
├── frontend/          # Next.js app
│   └── src/
│       ├── app/       # Pages (App Router)
│       ├── components/# React components
│       ├── context/   # Auth & Toast providers
│       ├── hooks/     # Custom hooks
│       ├── lib/       # API client, constants, utils
│       └── styles/    # CSS + Tailwind
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | /api/health | No | Server health check |
| POST | /api/auth/login | No | Admin login |
| GET | /api/auth/me | Yes | Current user info |
| GET | /api/dashboard/kpis | No | Dashboard KPIs |
| GET | /api/dashboard/charts/* | No | Chart data |
| GET | /api/crud/entities | Yes | List all entities |
| GET | /api/crud/:entity | Yes | List records (paginated) |
| GET | /api/crud/:entity/:id | Yes | Get record by ID |
| POST | /api/crud/:entity | Yes | Create record |
| PUT | /api/crud/:entity/:id | Yes | Update record |
| DELETE | /api/crud/:entity/:id | Yes | Delete record |
| POST | /api/chat/message | Yes | AI chat message |

## Database Tables (12 Entities)

Zone, Rider, Driver, Vehicle, SeasonalPatterns, PeakHourSurgeRules, Payment, Promotion, Trip, Rating, Complaint, DriverEarnings

## n8n Integration

Update the webhook URL in `backend/.env`:
```
N8N_CHAT_WEBHOOK_URL=http://localhost:5678/webhook/your-chat-workflow
```

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS v3
- **Backend:** Express.js, mssql (tedious), JWT, bcryptjs
- **Database:** SQL Server 2025 with stored procedures
- **Auth:** JWT-based with bcrypt password hashing
- **Design:** Glassmorphism, animations, responsive SaaS dashboard

## License

Built for ITI BI Track Graduation Project © 2026
