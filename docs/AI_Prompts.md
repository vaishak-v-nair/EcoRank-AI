# AI Evaluation Prompts

This document mirrors the production prompt assets used by `backend/ai/evaluator.js`.

## 1. Crisis Management Prompt

### Goal
Score a candidate's ability to stabilize operations during incidents such as contamination spikes, facility downtime, and safety events.

### Rubric (0-100)
- 0-20: No evidence of crisis ownership.
- 21-40: Limited exposure; weak response behaviors.
- 41-60: Adequate operational response with partial leadership.
- 61-80: Strong incident control and communication.
- 81-100: Exceptional crisis leadership with measurable prevention outcomes.

### Required JSON Output
```json
{
  "score": 0,
  "justification": "string",
  "evidence": ["string", "string"],
  "risks": ["string"],
  "confidence": 0
}
```

## 2. Sustainability Knowledge Prompt

### Goal
Score applied sustainability capability across circular-economy strategy, diversion programs, compliance, and data-informed improvements.

### Rubric (0-100)
- 0-20: Minimal sustainability literacy.
- 21-40: Basic conceptual awareness.
- 41-60: Working knowledge with moderate application.
- 61-80: Strong applied sustainability execution.
- 81-100: Advanced strategic capability with impact orientation.

### Required JSON Output
```json
{
  "score": 0,
  "justification": "string",
  "evidence": ["string", "string"],
  "knowledge_gaps": ["string"],
  "confidence": 0
}
```

## 3. Team Motivation Prompt

### Goal
Score leadership behaviors that sustain motivation, retention, accountability, and team performance in high-pressure operations.

### Rubric (0-100)
- 0-20: No leadership evidence.
- 21-40: Weak people-management indicators.
- 41-60: Adequate baseline with uneven impact.
- 61-80: Strong coaching and morale stabilization signals.
- 81-100: Exceptional culture-building and performance enablement.

### Required JSON Output
```json
{
  "score": 0,
  "justification": "string",
  "evidence": ["string", "string"],
  "development_priorities": ["string"],
  "confidence": 0
}
```

## Unified Evaluator Output
The backend normalizes provider responses into:

```json
{
  "provider": "mock|openai|mock-fallback",
  "model": "string",
  "scores": {
    "crisisManagement": 0,
    "sustainabilityKnowledge": 0,
    "teamMotivation": 0
  },
  "overallScore": 0,
  "justification": {
    "crisisManagement": "string",
    "sustainabilityKnowledge": "string",
    "teamMotivation": "string"
  },
  "evidence": {
    "crisisManagement": ["string"],
    "sustainabilityKnowledge": ["string"],
    "teamMotivation": ["string"]
  },
  "confidence": 0
}
```