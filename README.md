# recycling-manager-selection

End-to-end candidate selection platform for recycling manager roles with a MySQL-backed ranking model, AI-assisted evaluation workflow, and a React dashboard.

## Project Structure

```text
recycling-manager-selection/
├── backend/
│   ├── ai/
│   ├── config/
│   ├── db/
│   ├── generators/
│   ├── repositories/
│   ├── services/
│   └── src/
├── frontend/
│   ├── public/
│   └── src/
├── docs/
├── .gitignore
├── package.json
└── README.md
```

## Architecture Decisions

- Layered backend design:
  - `repositories/` handles raw SQL and row mapping.
  - `services/` contains business logic (evaluation and ranking).
  - `src/controllers + src/routes` expose HTTP endpoints.
  - `src/utils` and `src/middleware` enforce validation, request IDs, and structured errors.
- Database ranking maturity:
  - Enforced score bounds (0-100) via check constraints and triggers.
  - `evaluations -> candidates` foreign key with indexed query paths.
  - Dedicated `rankings` table auto-refreshed from evaluation triggers.
  - `vw_candidate_rankings` computes rank from each candidate's latest evaluation.
- Backend hardening:
  - `helmet` + `compression` middleware enabled.
  - Database outage errors mapped to `503 DATABASE_UNAVAILABLE`.
  - Lightweight rate limiting on evaluation endpoint.
  - In-memory caching for dashboard/leaderboard/heatmap with invalidation on new evaluations.
- AI abstraction:
  - Prompt assets stored in `backend/ai/prompts/`.
  - `backend/ai/evaluator.js` normalizes provider output.
  - `mockAI.js` supports deterministic local runs without external dependency.
- Frontend organization:
  - `components/` for presentation.
  - `services/` for API access.
  - `hooks/` for fetch lifecycle.
  - `utils/` for score and heatmap helpers.

## Prerequisites

- Node.js 20+
- npm 10+
- MySQL 8.0+

## 1. Database Setup and Seed

1. Create schema/tables:
   - `mysql -u <user> -p < backend/db/schema.sql`
2. Create views:
   - `mysql -u <user> -p < backend/db/views.sql`
3. Create triggers:
   - `mysql -u <user> -p < backend/db/triggers.sql`
4. Install backend dependencies and generate seed SQL:
   - `npm install --workspace backend`
   - `npm run generate:seed --workspace backend`
5. Load seed data:
   - `mysql -u <user> -p < backend/db/seed.sql`

## 2. Run Backend Services

1. Configure environment:
   - `cp backend/.env.example backend/.env` (or create manually on Windows)
   - Update DB credentials.
2. Start API:
   - `npm run dev --workspace backend`
3. Health check:
   - `GET http://localhost:4000/health`

## 3. Run Frontend

1. Install frontend dependencies:
   - `npm install --workspace frontend`
2. Start Vite app:
   - `npm run dev --workspace frontend`
3. Open:
   - `http://localhost:5173`

## Key Backend Endpoints

- `GET /api/dashboard`
- `GET /api/leaderboard?limit=10&sortBy=rank&direction=asc`
- `GET /api/heatmap?top=10`
- `GET /api/candidates`
- `GET /api/candidates/:id`
- `POST /api/candidates/:id/evaluate`

## Documentation Artifacts

- Prompt specs: `docs/AI_Prompts.md`
- ERD image: `docs/ERD.png`
- Dashboard capture placeholder: `docs/Dashboard_Screenshot.png`
- Figma workflow note: `docs/FIGMA_MCP_NOTES.md`

## Notes

- The seed pipeline generates 40 realistic candidate records with role history, location, education, skills, and initial evaluation data.
- The frontend dashboard includes:
  - Sortable Top 10 leaderboard.
  - Skill heatmap for top-ranked candidates.
  - Candidate cards with detail navigation and share action.
