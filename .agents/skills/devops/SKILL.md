---
name: devops
description: Docker, docker-compose, environment variables and GitHub workflow for FixIt Campus (Dockerfiles, .dockerignore, .env.example, branches, PRs, Issues, Kanban). Use for containerization and repo management.
---

# devops

## Docker
- frontend/Dockerfile: multi-stage build (Node stage for ng build, then Nginx serving dist/)
- backend/Dockerfile: light Node image, npm ci --omit=dev
- docker-compose.yml: services frontend (4200), api (5000), db (PostgreSQL with volume and healthcheck); api depends on db
- .dockerignore in each folder (node_modules, dist, .env)
- Documented .env.example; no secret in the repo
- Success criterion: docker compose up --build starts everything; app on http://localhost:4200, Swagger on http://localhost:5000/swagger

## GitHub
- Organization: Angluar-ICE4; repo nom-prenom-projet-angular
- One branch per feature (feature/...), Pull Requests, regular commits
- Kanban GitHub Projects "Suivi du projet - FixIt Campus": Backlog, À faire, En cours, En revue, Terminé; one Issue per task
- README: prerequisites, command, URLs, Swagger screenshot, cited sources

## Method
Explain each Dockerfile/compose instruction in one line; check with docker compose config before running.