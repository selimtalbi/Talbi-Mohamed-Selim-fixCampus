# Product Backlog - FixIt Campus

Priority: MUST = required by the assignment, SHOULD = important, COULD = bonus.
Each story = one GitHub Issue = one branch `feature/...`.

## Definition of Done (applies to every story)
- Code builds (`ng build` / backend starts) and acceptance criteria are met
- No secret in the repo; config goes through `.env.example`
- Every API endpoint is documented in Swagger
- Tests added when the story says so
- Committed on a `feature/...` branch, merged through a Pull Request
- The student can explain every line of the code

## Roles
- Member: student or staff (creates and follows their own tickets)
- Technician: takes charge of tickets and updates statuses
- Admin: manages rooms, users and statistics

---

## EPIC 1 - Database (PostgreSQL)

US-01 (MUST) As a developer, I want a PostgreSQL schema so that all data is stored reliably.
- Tables: users (role member/technician/admin), rooms, tickets, interventions
- Tickets: title, description, priority (low/medium/high/critical), status (open/in_progress/resolved/closed), room_id, created_at, author_id, technician_id (nullable)
- Rooms: name, building, floor, equipment_type
- Foreign keys, NOT NULL and CHECK constraints on priority and status
- File `backend/db/init.sql` runs automatically at first DB start
- Seed data: 1 admin, 1 technician, 1 member, 5 rooms, 10 tickets

## EPIC 2 - Backend API (Node/Express)

US-02 (MUST) Express project setup: structure routes/controllers/services, PostgreSQL connection through env variables, CORS for http://localhost:4200, global error handler.

US-03 (MUST) Swagger setup (swagger-jsdoc + swagger-ui-express) served on `/swagger`.
- Each endpoint: description, parameters, request body, response codes

US-04 (MUST) Authentication: `POST /api/auth/register`, `POST /api/auth/login` (JWT, hashed passwords with bcrypt), `GET /api/auth/me`.

US-05 (MUST) Role middleware: `requireAuth` and `requireRole(...)`; 401 if no token, 403 if wrong role.

US-06 (MUST) CRUD tickets: `GET /api/tickets` (filters: status, priority, room_id, mine=true), `GET /api/tickets/:id`, `POST`, `PUT`, `DELETE`.
- Validation: title required; critical priority requires description of at least 30 characters
- Members see and edit only their own tickets; technicians and admins see all
- Codes: 200, 201, 400, 401, 403, 404

US-07 (MUST) Ticket workflow: `PATCH /api/tickets/:id/status` and `PATCH /api/tickets/:id/assign`.
- Technician takes a ticket: status open -> in_progress, technician_id set
- Allowed transitions only: open -> in_progress -> resolved -> closed; otherwise 400

US-08 (MUST) CRUD rooms: `GET/POST /api/rooms`, `GET/PUT/DELETE /api/rooms/:id`, `GET /api/rooms/:id/tickets`. Write operations reserved to admin. Deleting a room with tickets returns 409.

US-09 (MUST) CRUD users (admin only): list, get, update role, delete.

US-10 (COULD) CRUD interventions: `GET/POST /api/tickets/:id/interventions`, `PUT/DELETE /api/interventions/:id` (ticket, technician, date, comment). Technicians and admins only.

US-11 (SHOULD) Statistics: `GET /api/stats` (admin) returns ticket counts per status and per priority, and per room.

## EPIC 3 - Docker

US-12 (MUST) `backend/Dockerfile` (light Node image) and `backend/.dockerignore`.

US-13 (MUST) `frontend/Dockerfile` multi-stage (Node build, then Nginx) with SPA fallback config, and `frontend/.dockerignore`.

US-14 (MUST) `docker-compose.yml` with `frontend` (4200), `api` (5000), `db` (volume + healthcheck); `api` waits for `db`.
- `docker compose up --build` starts everything from a clean clone
- App on http://localhost:4200, Swagger on http://localhost:5000/swagger
- All config from `.env` (copied from `.env.example`)

## EPIC 4 - Frontend foundation (Angular standalone)

US-15 (MUST) Angular project in `frontend/` (standalone components, routing, strict TypeScript), folders `core/`, `features/`, `shared/`, `models/`.

US-16 (MUST) Models: Ticket, Room, Intervention, User, plus union types for priority and status.

US-17 (MUST) Environment config for the API URL (no hardcoded URL in components) and a layout shell (header with navigation, router outlet).

## EPIC 5 - Authentication and roles (frontend)

US-18 (MUST) `AuthService` with login, logout, current user in a Signal, token stored in the browser.

US-19 (MUST) Login page with a reactive form (email required and valid, password required).

US-20 (SHOULD) Auth guard and role guard on routes (technician and admin pages protected).

US-21 (SHOULD) HTTP interceptor that adds the token to requests, and an error interceptor (401 redirects to login, error message displayed).

## EPIC 6 - Tickets (frontend)

US-22 (MUST) `TicketService` with HttpClient: full CRUD, filters, status change, assign.

US-23 (MUST) State with Signals: tickets signal, loading and error signals, `computed` counters per status.

US-24 (MUST) Reusable components with @Input/@Output: `ticket-card`, `status-badge` (color per status), `priority-badge`, `ticket-filter` (emits filter changes).

US-25 (MUST) Custom pipe `timeAgo` (e.g. "2 hours ago") used in ticket cards, and `priorityLabel` pipe if time allows.

US-26 (MUST) Ticket list page using `@for` and `@if` (empty state, loading state), filters by status, priority and room.

US-27 (MUST) Ticket detail page on route `/tickets/:id` (route parameter): all fields, status history if available, edit and delete buttons depending on role.

US-28 (MUST) Create/edit ticket form (reactive form) with a custom validator: a "critical" ticket requires a description of at least 30 characters; error messages shown under the fields.

US-29 (MUST) Technician actions on a ticket: take charge, change status (only allowed transitions shown).

US-30 (SHOULD) "My tickets" view for members (tickets they authored).

US-31 (COULD) Kanban view with columns open / in progress / resolved / closed; changing the status moves the card.

## EPIC 7 - Rooms and equipment (frontend)

US-32 (MUST) `RoomService` and rooms list page with full CRUD (admin only for create, edit, delete).

US-33 (MUST) Page on route `/salles/:id/tickets` listing the tickets of one room, reusing `ticket-card`.

## EPIC 8 - Admin

US-34 (SHOULD) Users management page (list, change role, delete) for admin.

US-35 (SHOULD) Statistics dashboard: counters per status (computed Signals) and per priority.

US-36 (COULD) Interventions section on the ticket detail page: list and add (technician).

## EPIC 9 - Tests

US-37 (MUST) Unit tests for `TicketService` (HttpTestingController): get, create, update, delete.

US-38 (MUST) Unit tests for the `ticket-card` component: inputs displayed, output emitted on click.

US-39 (SHOULD) Tests for the custom validator (critical + under 30 characters is invalid), the `timeAgo` pipe, and the status `computed` counters.

US-40 (SHOULD) API checks of the CRUD routes (200/201/400/401/403/404) with curl or Swagger, results noted in `docs/`.

## EPIC 10 - Documentation and delivery

US-41 (MUST) README: prerequisites, command, URLs, Swagger screenshot (saved in `docs/`), cited sources.

US-42 (MUST) GitHub: Kanban "Suivi du projet - FixIt Campus" up to date, one Issue per story, regular commits, Pull Requests.

US-43 (MUST) Report PDF in `rapport/`: context, design (DB schema, architecture), Angular principles used with code examples, Docker, tests, difficulties, sources.

US-44 (MUST) Presentation in `presentation/` and a live demo script (login as member, create ticket, technician takes it, admin sees stats).

US-45 (MUST) Defense preparation: for each Angular principle, a 1-minute explanation of where it is in the code and why.

---

## Suggested order

- Sprint 1 - Foundations: US-01, 02, 03, 12, 13, 14, 15, 16, 17
- Sprint 2 - Backend features: US-04, 05, 06, 07, 08, 09, 11
- Sprint 3 - Frontend features: US-18, 19, 22, 23, 24, 25, 26, 27, 28, 29, 32, 33
- Sprint 4 - Quality and delivery: US-20, 21, 30, 34, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45
- Bonus if time allows: US-10, 31, 36