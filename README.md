# ♻️ Recycling Production Line Manager Selection System

A full-stack candidate evaluation system designed to rank applicants for a Recycling Production Line Manager role using structured database design, AI-driven scoring, and a decision-support dashboard.

This project demonstrates production-aware architecture, AI abstraction, database automation, and a polished UI built with React and Mantine.

---

## 🚀 Overview

This system:

* Stores and manages 40 realistic candidate profiles
* Evaluates candidates across three competency dimensions using AI
* Automatically ranks candidates based on evaluation scores
* Visualizes results through a modern dashboard
* Supports both OpenRouter and OpenAI providers
* Includes robust fallback and error-handling mechanisms

The system is intentionally designed to emphasize:

* Clean database modeling
* Structured AI prompting
* Failure-safe backend behavior
* Clear and usable decision interface

---

## 🏗 Architecture

### Backend Responsibilities

* MySQL-compatible schema management
* Candidate generation using Faker
* AI evaluation abstraction layer
* Provider validation and fallback logic
* Ranking computation using SQL view or trigger
* Safe error handling for DB and API failures

### Frontend Responsibilities

* Leaderboard display for top-ranked candidates
* Skill heatmap visualization
* Detailed candidate cards
* Actionable error states
* Theme-aware dark mode styling

---

## 📂 Project Structure

```
recycling-manager-selection/
│
├── backend/
│   ├── db/
│   │   ├── schema.sql
│   │   ├── views.sql
│   │   ├── triggers.sql
│   │   └── seed.sql
│   │
│   ├── generators/
│   │   ├── fakerGenerator.js
│   │   └── skillsLibrary.js
│   │
│   ├── ai/
│   │   ├── prompts/
│   │   ├── evaluator.js
│   │   └── mockAI.js
│   │
│   ├── services/
│   ├── config/
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   │
│   └── vite.config.ts
│
├── docs/
│   ├── AI_Prompts.md
│   ├── ERD.png
│   └── Dashboard_Screenshot.png
│
└── README.md
```

---

## 🗄 Database Design

Three core tables:

### `candidates`

* id
* full_name
* years_experience
* skills
* education_level
* location
* created_at

### `evaluations`

* id
* candidate_id
* crisis_score
* sustainability_score
* motivation_score
* evaluation_version
* evaluated_at

### `rankings`

* Auto-computed via SQL view or trigger
* Average score used for sorting

Indexes and constraints ensure performance and data integrity.

---

## 🤖 AI Evaluation Design

Candidates are evaluated on:

1. Crisis Management
2. Sustainability Knowledge
3. Team Motivation

Each prompt:

* Defines a clear evaluation rubric
* Enforces structured JSON output
* Returns a score between 0 and 100
* Provides justification text

### AI Provider Support

* Native OpenRouter support
* OpenAI compatibility retained
* Provider validation included
* Automatic fallback to mock evaluation if API is unavailable

The AI layer is abstracted to allow provider swapping without frontend changes.

---

## 📊 Dashboard Features

### 🥇 Leaderboard

* Top 10 ranked candidates
* Sortable table
* Experience and score visibility

### 🔥 Skill Heatmap

* Visual intensity mapping of evaluation scores
* Quick pattern recognition for decision-making

### 👤 Candidate Cards

* Profile summary
* Evaluation breakdown
* Average score
* Share simulation button

---

## 🛡 Reliability & Stability Enhancements

* Backend environment validation
* Safe DB fallback if schema missing
* Controlled API error handling
* Actionable frontend error states
* Full dark mode contrast optimization
* Centralized provider validation
* Type-safe frontend data flow

The application fails safely instead of crashing.

---

## ⚙️ Local Setup

### 1️⃣ Clone Repository

```
git clone <repo-url>
cd recycling-manager-selection
```

---

### 2️⃣ Backend Setup

Create `.env` inside `backend/`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=recycling_db

AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_key
OPENAI_API_KEY=optional_key
```

---

### 3️⃣ Initialize Database

Run:

```
mysql -u root -p < backend/db/schema.sql
mysql -u root -p < backend/db/seed.sql
```

---

### 4️⃣ Install Dependencies

From project root:

```
npm install
```

---

### 5️⃣ Run Development Environment

Single command:

```
npm run dev
```

This starts both:

* Backend server
* Frontend Vite app

---

## 🧪 Evaluation Workflow

1. Candidate data seeded into database
2. Evaluation service processes candidates
3. Scores stored in evaluations table
4. Ranking computed automatically
5. Dashboard fetches ranked results
6. User interacts with leaderboard and detail views

AI evaluation does not run in the UI path to ensure performance and determinism.

---

## 📤 Submission Contents

* Full GitHub repository
* SQL schema and sample dataset
* AI prompt documentation
* Dashboard screenshots
* Setup instructions

---

## 🎯 Evaluation Criteria Alignment

| Area            | Implementation Approach                          |
| --------------- | ------------------------------------------------ |
| Database Design | Normalized schema, indexes, ranking logic        |
| AI Prompting    | Structured rubric-based prompts with JSON output |
| Dashboard       | Mantine-based responsive UI                      |
| Random Data     | Faker-generated realistic candidate profiles     |

---

## 💡 Design Philosophy

This system prioritizes:

* Deterministic ranking logic
* AI abstraction and provider flexibility
* Safe degradation under failure
* Clean separation of concerns
* Readable and decision-focused UI

It is designed to reflect production-level thinking rather than demo-level scripting.
