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

The client reads the API address from `andalusia-academy-client/.env.development`:

```
VITE_API_BASE_URL=https://localhost:7200
```

Run the backend first, using the `https` launch profile. If you use the `http` profile, set the value to `http://localhost:5120`.
The API allows CORS from `http://localhost:5173` (see `Program.cs`).

## Project structure

- `andalusia-academy-backend/AndalusiaAcademy/AndalusiaAcademy/` — API project (Program.cs, Data/AppDbContext.cs, Migrations/)
- `andalusia-academy-backend/AndalusiaAcademy/Domain/` — Entity models
- `andalusia-academy-backend/AndalusiaAcademy/Application/` — DTOs, services, repository interfaces, mapping
- `andalusia-academy-client/src/pages/` — route-level pages (Home, Courses, Programs, Career Paths, About, Contact)
- `andalusia-academy-client/src/sections/` — homepage sections (Hero, Featured Courses, Testimonials, etc.)
- `andalusia-academy-client/src/layout/` — Navbar, Footer, PageLayout
- `andalusia-academy-client/src/components/` — shared UI (Button, Card, Badge, cards, filters, pagination, loading/error/empty states)
- `andalusia-academy-client/src/services/` and `src/hooks/` — API client and the `useApi` data-fetching hook
- `andalusia-academy-client/src/data/` — static testimonials and partners only (until the CMS sprint)
- `docs/ERD-v2.md` — database diagram (Mermaid)

## Status — Sprint 1

- [x] Public website navigable (Home, Courses, Programs, Career Paths, About, Contact)
- [x] Homepage sections per scope (Hero, Career Path Discovery, Popular Categories, Featured Courses, Coming Soon, Corporate, Partners, Testimonials, CTA)
- [x] Responsive layout, mobile nav
- [x] Initial database schema (17 tables) via EF Core migrations
- [x] Relational mapping with constraints (unique indexes on Email/Category name/Instructor-User; FK delete behavior set to Restrict to avoid cascade conflicts)

## Status — Sprint 2

- [x] Courses: list with search, category/status filter, sorting and pagination; course details
- [x] Programs: list with search and pagination; details with included courses
- [x] Career Paths: list with search and pagination; details with recommended skills, related programs and recommended courses
- [x] Homepage featured / coming-soon courses, career paths and categories come from the API
- [x] Loading, error and empty states on every API-driven page
- [x] Draft courses and programs are never returned by the public API
- [x] Page / pageSize validation (400 on invalid values) and stable sorting
- [x] Seed data, Swagger, ERD v2 (`docs/ERD-v2.md`)

## API endpoints (Swagger: `/swagger` in Development)

| Endpoint | Query parameters |
| --- | --- |
| `GET /api/courses` | `search`, `categoryId`, `status`, `sortBy` (`title`/`price`/`createdat`), `order` (`asc`/`desc`), `page`, `pageSize` |
| `GET /api/courses/{id}` | |
| `GET /api/programs` | `search`, `page`, `pageSize` |
| `GET /api/programs/{id}` | |
| `GET /api/careerpaths` | `search`, `page`, `pageSize` |
| `GET /api/careerpaths/{id}` | |
| `GET /api/categories` | |

If you change `SeedData.cs`, drop the database and run `dotnet ef database update` again — the seed only runs on an empty database.
