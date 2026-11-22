# FixIt Campus

Campus fault and maintenance management app: students and staff report faults, technicians handle tickets, the admin manages rooms, users and statistics.

## Prerequisites
- Docker and Docker Compose
- Git

## Run
    cp .env.example .env
    docker compose up --build

## URLs
- App: http://localhost:4200
- Swagger: http://localhost:5000/swagger

## Swagger screenshot
To add in docs/ then reference here.

## Structure
- frontend/ : Angular 19/20 (standalone)
- backend/ : Node/Express + Swagger + PostgreSQL
- docs/ : DB schema, screenshots, design
- rapport/ : PDF report
- presentation/ : defense slides
- .agents/skills/ : AI agent skills (OpenAI Codex)
- AGENTS.md : instructions for the AI agent

## Sources
To complete (documentation, tutorials, AI tools used).