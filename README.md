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

This creates the `AndalusiaAcademyDb` database on your local LocalDB instance, seeds demo data, and starts the API.

The connection string is in `appsettings.Development.json`. It defaults to LocalDB:

`Server=(localdb)\mssqllocaldb;Database=AndalusiaAcademyDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True`

If you're using a different SQL Server instance, update that value before running `dotnet ef database update`.

If you change `SeedData.cs`, drop the database and run `dotnet ef database update` again — seeding only runs on an empty database (`dotnet ef database drop --force` then `dotnet ef database update`).

### JWT configuration

Also in `appsettings.Development.json`, under a `"Jwt"` section: signing key, issuer, audience, and token expiry (minutes). The key shipped in this repo is a **development-only** placeholder — fine for local use, not meant for production.

### API documentation

Once running, open `https://localhost:<port>/swagger` (the exact port is printed in the terminal when `dotnet run` starts). Click **Authorize** and paste a JWT (no `Bearer` prefix needed) to test protected endpoints directly from the Swagger UI.

### Seeded test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@andalusia.academy` | `Admin@12345` |
| Learner | *(register your own via `/api/auth/register`)* | — |

### CORS

The API allows cross-origin requests from `http://localhost:5173` (the Vite dev server) — see the `AddCors`/`UseCors` setup in `Program.cs`.

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
VITE_API_BASE_URL=http://localhost:5120
```
Run the backend first (`dotnet run` from the API project). The example above matches the `http` launch profile — if your backend prints an `https://` URL instead, use that port here.

## Project structure

- `andalusia-academy-backend/AndalusiaAcademy/AndalusiaAcademy/` — API project
  - `Controllers/` — Courses, Programs, CareerPaths, Categories, Auth, Applications, Payments
  - `Repositories/` — EF Core-backed implementations of the Application-layer interfaces
  - `Data/` — `AppDbContext.cs`, `SeedData.cs`, `Migrations/`
- `andalusia-academy-backend/AndalusiaAcademy/Domain/` — Entity models
- `andalusia-academy-backend/AndalusiaAcademy/Application/` — Business logic layer
  - `DTOs/` — request/response shapes
  - `Services/` — Course, Program, CareerPath, Category, Auth, Application, Payment
  - `Repositories/` — repository interfaces
  - `Auth/` — `ITokenService`, `TokenService`, `JwtSettings`
  - `Mapping/` — AutoMapper profile
  - `Common/` — `PagedResult<T>`, filter params, `OperationResult<T>`, `CatalogStatus`
- `andalusia-academy-client/src/pages/` — route-level pages: Home, Courses, Programs, Career Paths, About, Contact, Login, Register, Profile, MyApplications, MyPayments, CourseDetails, ProgramDetails, CareerPathDetails, Checkout, AccessDenied
- `andalusia-academy-client/src/auth/` — `AuthContext`, `AuthProvider`, `ProtectedRoute`, token storage
- `andalusia-academy-client/src/services/` and `src/hooks/` — API client and the `useApi` data-fetching hook
- `andalusia-academy-client/src/sections/` — homepage sections (Hero, Featured Courses, Testimonials, etc.)
- `andalusia-academy-client/src/layout/` — Navbar, Footer, PageLayout
- `andalusia-academy-client/src/components/` — shared UI (Button, Card, Badge, cards, filters, pagination, loading/error/empty states)
- `andalusia-academy-client/src/data/` — static testimonials and partners only (live catalog data now comes from the API)

## API endpoints

Full interactive docs at `/swagger` in Development.

| Endpoint | Auth | Query parameters / notes |
|---|---|---|
| `GET /api/courses` | — | `search`, `categoryId`, `status`, `sortBy` (`title`/`price`/`createdat`), `order` (`asc`/`desc`), `page`, `pageSize` |
| `GET /api/courses/{id}` | — | |
| `GET /api/programs` | — | `search`, `page`, `pageSize`; detail includes included courses |
| `GET /api/programs/{id}` | — | |
| `GET /api/careerpaths` | — | `search`, `page`, `pageSize`; detail includes related programs + recommended courses (derived from programs, no separate table) |
| `GET /api/careerpaths/{id}` | — | |
| `GET /api/categories` | — | |
| `POST /api/auth/register` | — | always creates a Learner account |
| `POST /api/auth/login` | — | returns a JWT |
| `GET /api/auth/me` | Learner+ | current user's profile |
| `GET /api/auth/admin-only` | Admin | demonstrates role-based rejection (401 vs 403) |
| `POST /api/applications` | Learner+ | apply to a course *or* a program (exactly one) |
| `GET /api/applications/my` | Learner+ | |
| `POST /api/payments` | Learner+ | simulated payment; on success, creates Enrollment(s) and marks the application approved |
| `GET /api/payments/my` | Learner+ | |

Draft courses and programs are never returned by the public catalog endpoints. `page`/`pageSize` are validated (400 on invalid values).

## Status — Sprint 1

- [x] Public website navigable (Home, Courses, Programs, Career Paths, About, Contact)
- [x] Homepage sections per scope (Hero, Career Path Discovery, Popular Categories, Featured Courses, Coming Soon, Corporate, Partners, Testimonials, CTA)
- [x] Responsive layout, mobile nav
- [x] Initial database schema (17 tables) via EF Core migrations
- [x] Relational mapping with constraints (unique indexes on Email/Category name/Instructor-User; FK delete behavior set to Restrict to avoid cascade conflicts)

## Status — Sprint 2

- [x] Courses, Programs, Career Paths, Categories — listing + detail endpoints
- [x] Search, filter, sort, pagination (`PagedResult<T>`, whitelisted sort fields, validated page/pageSize)
- [x] Career Path → Program → Course relationship, recommended courses derived from linked programs (no new table)
- [x] Homepage featured/coming-soon courses, career paths and categories now come from the live API
- [x] Loading, error and empty states on every API-driven frontend page
- [x] Draft courses/programs excluded from public API responses
- [x] Swagger (API documentation)
- [x] Seed data (categories, instructors, courses, programs, career paths)
- [x] Layered backend architecture: Controller → Service → Repository → DbContext, AutoMapper DTOs

## Status — Sprint 3

- [x] Registration, login (BCrypt password hashing, JWT issuance)
- [x] Role-based authorization (`[Authorize]`, `[Authorize(Roles = "...")]`); every new registration is a Learner by default
- [x] Learner profile endpoint
- [x] Application module — apply to a course or a program, duplicate-application prevention
- [x] Payment module — self-service simulation (apply → pay → enrolled automatically, no admin approval step this sprint)
- [x] Enrollment creation — one row per course; a program application creates one Enrollment per course in that program
- [x] My Applications / My Payments
- [x] Seeded Admin account + a role-protected endpoint demonstrating 401 vs 403
- [x] CORS enabled for the Vite dev server
- [x] Frontend: Login, Register, Profile, MyApplications, MyPayments pages wired to the live API; `AuthContext`/`ProtectedRoute` guarding authenticated routes

**Known gaps, carried to Sprint 4:**
- No server-side logout / token revocation (JWTs are stateless; the client discards the token, and it also expires on its own)
- No password reset flow
- No admin-approval step before payment (confirmed as self-service for this sprint)