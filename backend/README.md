# Backend: recycling-manager-selection

## Overview
Node.js + Express backend with MySQL persistence, deterministic Faker seed generation, and an AI evaluation abstraction layer (mock + optional OpenAI mode).

## Runtime Hardening
- Strict validation for route params/query/body input
- Structured app errors (`VALIDATION_ERROR`, `DATABASE_UNAVAILABLE`, `RATE_LIMIT_EXCEEDED`)
- `helmet` security headers and `compression` response compression
- Request IDs added to every response via `x-request-id`
- In-memory cache for dashboard/leaderboard/heatmap with invalidation after new evaluations
- Rate limiting on `POST /api/candidates/:id/evaluate`

## Folder Map
- `db/` - schema, views, triggers, and generated seed SQL
- `generators/` - Faker-driven candidate + evaluation seed generator
- `ai/` - prompt assets, evaluator, and mock AI logic
- `repositories/` - raw database access layer
- `services/` - business logic for ranking and evaluation
- `src/` - HTTP API routes and server bootstrap
- `config/` - database connection configuration

## Prerequisites
- Node.js 20+
- MySQL 8.0+

## Setup
1. Install packages:
   - `npm install`
2. Configure environment:
   - Copy `.env.example` to `.env`
   - Update DB credentials
3. Initialize DB objects:
   - `mysql -u <user> -p < backend/db/schema.sql`
   - `mysql -u <user> -p < backend/db/views.sql`
   - `mysql -u <user> -p < backend/db/triggers.sql`
4. Generate and apply seed data:
   - `npm run generate:seed`
   - `mysql -u <user> -p < backend/db/seed.sql`
5. Run API service:
   - `npm run dev`

## API Endpoints
- `GET /health`
- `GET /api/dashboard`
- `GET /api/leaderboard?limit=10&sortBy=rank&direction=asc`
- `GET /api/heatmap?top=10`
- `GET /api/candidates?limit=40&offset=0`
- `GET /api/candidates/:id`
- `GET /api/candidates/:id/profile`
- `GET /api/candidates/:id/evaluations?limit=10`
- `POST /api/candidates/:id/evaluate` with body `{ "provider": "mock" | "openai", "evaluatorVersion": "v1" }`

## Notes
- Ranking is calculated from `vw_candidate_rankings` using each candidate's latest evaluation.
- Score constraints are enforced by both schema checks and triggers.
- `AI_PROVIDER=mock` is the default for deterministic local testing.
- `/health` includes database reachability and returns `503` when DB is down.
