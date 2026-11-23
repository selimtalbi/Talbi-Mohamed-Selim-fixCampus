# FixIt Campus

Campus fault and maintenance management app: students and staff report faults, technicians handle tickets, the admin manages rooms, users and statistics.

## Prerequisites
- Docker Desktop with Docker Compose
- Git

## Run

```powershell
Copy-Item .env.example .env
docker compose up --build
```

## URLs
- App: http://localhost:4200
- Swagger: http://localhost:5000/swagger

## Swagger screenshot
Add a screenshot to `docs/` when the API is running.

## Structure
- frontend/ : Angular 19/20 (standalone)
- backend/ : Node/Express + Swagger + PostgreSQL
- docs/ : DB schema, screenshots, design
- rapport/ : PDF report
- presentation/ : defense slides
- .agents/skills/ : AI agent skills (OpenAI Codex)
- AGENTS.md : instructions for the AI agent

## Sources
Project documentation and implementation notes can be added here.

## Start the complete stack

```powershell
Copy-Item .env.example .env
docker compose up --build
```

The first build downloads container images and JavaScript dependencies. Stop with `Ctrl+C`; `docker compose down` removes containers while retaining the PostgreSQL volume. `docker compose down -v` also deletes database data.

## Services

| Service | Local address | Purpose |
| --- | --- | --- |
| Frontend | http://localhost:4200 | Angular campus page and service status |
| API | http://localhost:5000/api | Express API overview |
| Swagger | http://localhost:5000/swagger | Interactive API documentation |
| Health check | http://localhost:5000/api/health | API and database readiness |
| PostgreSQL | Internal Docker network | Persistent relational database |

The API creates the initial `rooms`, `tickets`, and `interventions` tables at startup. This setup currently includes readiness and API overview endpoints; resource CRUD and authentication are future application features.

## Local development without Docker

Start PostgreSQL and configure `.env`, then in separate terminals:

```powershell
cd backend
npm install
npm run dev
```

```powershell
cd frontend
npm install
npm start
```

The Angular development server uses `frontend/proxy.conf.json` to forward `/api` requests to `http://localhost:5000`.

## Docker files at a glance

- `frontend/Dockerfile`: builds Angular with Node and serves it using Nginx.
- `backend/Dockerfile`: installs production dependencies and runs Express as the unprivileged `node` user.
- `docker-compose.yml`: starts PostgreSQL, waits for database/API health, and publishes app ports.
- `.env.example`: configuration template. Copy it to `.env`; do not commit `.env`.
