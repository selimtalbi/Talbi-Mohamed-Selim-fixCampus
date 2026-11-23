# AGENTS.md - FixIt Campus

## Context
Individual project for the Angular Development module. Campus fault management app.
The student must be able to explain and justify ALL the code in the defense: write simple, readable code, comment when useful, and briefly explain your choices.

## Stack
- Frontend: Angular 24, standalone components, Signals (signal, computed)
- Backend: Node/Express, swagger-jsdoc + swagger-ui-express (route /swagger)
- Database: PostgreSQL
- Deployment: Docker (docker compose up --build)

## Domain
- Entities: Tickets (title, description, priority low/medium/high/critical, status open/in progress/resolved/closed, room, creation date, author, assigned technician), Rooms/Equipment (name, building, floor, equipment type), Interventions (optional: ticket, technician, date, comment)
- Roles: student/staff, technician, admin
- Full CRUD on every entity

## Repo structure
frontend/, backend/, docs/, rapport/, presentation/, docker-compose.yml, .env.example

## Conventions
- Git: one branch per feature (feature/...), regular commits with clear messages (e.g. feat: add ticket-card), Pull Request to main, one Issue per task
- Never any secret in the repo: everything goes through .env (ignored) and .env.example
- Every API endpoint documented in Swagger: description, parameters, request body, response codes
- Angular: one service per resource (TicketService, RoomService, AuthService), no HTTP calls inside components
- Naming: kebab-case files, PascalCase classes

## Available skills (.agents/skills/)
- dev-angular: frontend development
- testing: unit tests and API checks
- devops: Docker, docker-compose, GitHub

## Design Philosophy

Ce projet suit une esthétique inspirée d'Apple.

### UI Principles
- Minimaliste et élégante
- Beaucoup d'espace blanc
- Hiérarchie visuelle claire
- Interface premium
- Lisibilité maximale
- Pas de surcharge visuelle

### Typography
- SF Pro Display pour les titres
- SF Pro Text ou Inter pour le contenu
- Font weights: 400, 500, 600

### Colors
- #FFFFFF
- #F5F5F7
- #1D1D1F
- #6E6E73

### Components
- Coins arrondis entre 12px et 20px
- Ombres très légères
- Animations fluides et subtiles
- Design mobile-first

### Avoid
- Style Bootstrap
- Dashboards SaaS génériques
- Couleurs fluo
- Ombres lourdes
- Trop de cartes
- Trop de boutons

### Frontend Requirement
Chaque composant doit sembler conçu par Apple :
clean, minimal, premium et cohérent.

## Working rule
Before coding a feature: state the plan in a few lines, create the feature/... branch, code, test, then propose the commit.