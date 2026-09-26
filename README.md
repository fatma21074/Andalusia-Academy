# Andalusia Academy — Phase 1 MVB

React + ASP.NET Core LMS for Andalusia Academy. This repo contains two projects:

- `andalusia-academy-client` — React + TypeScript frontend (Vite)
- `andalusia-academy-backend` — ASP.NET Core Web API + EF Core + SQL Server

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (LTS version)
- SQL Server LocalDB (installed with Visual Studio, or standalone via [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads))
- EF Core CLI tools: `dotnet tool install --global dotnet-ef`

## Backend setup

```bash
cd andalusia-academy-backend/AndalusiaAcademy/AndalusiaAcademy
dotnet restore
dotnet ef database update
dotnet run
```

This creates the `AndalusiaAcademyDb` database on your local LocalDB instance and starts the API.

The connection string is in `appsettings.Development.json`. It defaults to LocalDB:

`Server=(localdb)\mssqllocaldb;Database=AndalusiaAcademyDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True`

If you're using a different SQL Server instance, update that value before running `dotnet ef database update`.

## Frontend setup

In a separate terminal:

```bash
cd andalusia-academy-client
npm install
npm run dev
```

Open the local URL Vite prints in the terminal (typically `http://localhost:5173`).

## Project structure

- `andalusia-academy-backend/AndalusiaAcademy/AndalusiaAcademy/` — API project (Program.cs, Data/AppDbContext.cs, Migrations/)
- `andalusia-academy-backend/AndalusiaAcademy/Domain/` — Entity models
- `andalusia-academy-backend/AndalusiaAcademy/Application/` — DTOs
- `andalusia-academy-client/src/pages/` — route-level pages (Home, Courses, Programs, Career Paths, About, Contact)
- `andalusia-academy-client/src/sections/` — homepage sections (Hero, Featured Courses, Testimonials, etc.)
- `andalusia-academy-client/src/layout/` — Navbar, Footer, PageLayout
- `andalusia-academy-client/src/components/` — shared UI (Button, Card, Badge, CourseCard)
- `andalusia-academy-client/src/data/` — mock data (placeholder until Sprint 2 connects the real API)

## Status — Sprint 1

- [x] Public website navigable (Home, Courses, Programs, Career Paths, About, Contact)
- [x] Homepage sections per scope (Hero, Career Path Discovery, Popular Categories, Featured Courses, Coming Soon, Corporate, Partners, Testimonials, CTA)
- [x] Responsive layout, mobile nav
- [x] Initial database schema (17 tables) via EF Core migrations
- [x] Relational mapping with constraints (unique indexes on Email/Category name/Instructor-User; FK delete behavior set to Restrict to avoid cascade conflicts)

Course/Program/Career Path pages currently render mock data (`src/data/mockData.ts`) — Sprint 2 replaces this with live API calls.