# ♻️ EcoRank AI

**AI-Powered Candidate Evaluation & Ranking Platform**

EcoRank AI is a full-stack candidate evaluation system that ranks applicants for a recycling production line manager role using structured database design, AI-driven scoring, and a decision-focused dashboard.

This project demonstrates applied AI systems engineering: controlled model evaluation, deterministic ranking logic, resilient backend architecture, and production-ready frontend UX.

---

## 🚀 Overview

EcoRank AI transforms raw candidate profiles into structured evaluation signals and ranked insights.

**System Flow**

Candidate Data
→ AI Evaluation (Crisis • Sustainability • Motivation)
→ Weighted Score Calculation
→ Ranking Engine
→ Dashboard Visualization

The system is resilient by design. If MySQL is unavailable, deterministic mock evaluation ensures the application remains usable instead of failing.

---

## 🧠 Core Capabilities

### 1️⃣ Structured AI Evaluation

Candidates are evaluated across three dimensions:

* **Crisis Management** (40%)
* **Sustainability Knowledge** (35%)
* **Team Motivation** (25%)

Features:

* Weighted scoring model
* Score normalization and clamping (0–100)
* Structured JSON output validation
* Provider abstraction (`mock`, `openai`, `openrouter`)
* Graceful fallback handling

Evaluation logic is centralized in `backend/ai/evaluator.js`.

---

### 2️⃣ Deterministic Ranking Engine

* Backend-driven sorting and leaderboard generation
* Rank positions exposed as `rank_position`
* Top-N selection for dashboard
* Metrics computed from ranked dataset:

  * Top-10 average score
  * Elite rate
  * Total evaluated count

Ranking logic is separated from AI scoring and UI layers.

---

### 3️⃣ Resilient Backend Architecture

* Express server with layered architecture:

  * Controllers
  * Services
  * Repositories / data access
* Centralized error normalization
* Health check endpoint
* Rate limiting
* Cache invalidation strategy
* Deterministic mock fallback if MySQL unavailable

This ensures development and demo reliability.

---

### 4️⃣ Polished Dashboard (React + Mantine)

* Leaderboard (Top 10 candidates)
* Candidate profile cards
* Skill heatmap visualization
* Theme-aware design
* Dark-mode safe typography and surfaces
* Improved error parsing & recovery UX

Frontend prioritizes clarity and decision usability.

---

## 🗂 Project Structure

```
EcoRank-AI/
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── ai/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── theme/
│   └── vite.config.ts
│
├── .env.example
└── README.md
```

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express
* MySQL
* OpenRouter API
* OpenAI-compatible interface
* Faker.js (candidate generation)

### Frontend

* React
* Vite
* Mantine UI
* TypeScript

---

## ⚙️ Local Development

### 1️⃣ Clone Repository

```bash
git clone https://github.com/vaishak-v-nair/EcoRank-AI.git
cd EcoRank-AI
```

---

### 2️⃣ Configure Environment

Create a `.env` file in the backend directory:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecorank

AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_key
MODEL_NAME=openai/gpt-4o-mini
```

`.env` is intentionally gitignored.

---

### 3️⃣ Install Dependencies

```bash
npm install
```

If backend and frontend are separated:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### 4️⃣ Run Full Stack

```bash
npm run dev
```

This starts:

* Express backend
* React frontend
* Development proxy

---

## 🧪 Health Check

```
GET /health
```

Returns system readiness status.

If database connection fails, the application switches to deterministic mock evaluation mode.

---

## 🗃 Database Design

Core tables:

* `candidates`
* `evaluations`
* `rankings`

Features:

* Foreign key constraints
* Indexed columns for performance
* Weighted score aggregation
* Deterministic ranking derivation

40 realistic candidate profiles generated using Faker.js.

---

## 🤖 AI Prompting Strategy

Each evaluation prompt:

* Defines explicit rubric
* Enforces scoring range (0–100)
* Requests structured JSON output
* Separates reasoning from scoring
* Prevents hallucinated assumptions

Example response schema:

```json
{
  "score": 84,
  "justification": "Demonstrates strong operational crisis leadership and waste management optimization experience."
}
```

Provider abstraction allows switching between OpenRouter and OpenAI seamlessly.

---

## 📊 Evaluation Coverage

| Area            | Implementation                    |
| --------------- | --------------------------------- |
| Database Design | Structured schema + indexing      |
| AI Prompting    | Weighted rubric-driven scoring    |
| Ranking System  | Backend sorting + rank positions  |
| Dashboard       | Decision-focused UI               |
| Reliability     | Graceful fallback + health checks |

---

## 📌 Design Philosophy

EcoRank AI was built as a minimal, production-ready decision engine rather than a demo.

Key principles:

* Separate AI from business logic
* Enforce structured outputs
* Fail gracefully
* Keep ranking deterministic
* Maintain usability under failure conditions

---

## 👤 Author

**VAISHAK V NAIR**

B.Tech Computer Science

AI/ML Engineer | Full-Stack Developer | Applied AI Systems Builder | LLM & Generative AI Explorer

GitHub: [https://github.com/vaishak-v-nair](https://github.com/vaishak-v-nair)
