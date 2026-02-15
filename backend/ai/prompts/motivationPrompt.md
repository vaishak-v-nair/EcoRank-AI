# Team Motivation Evaluation Prompt

## Objective
Evaluate the candidate's ability to motivate, retain, and align frontline and supervisory teams in demanding recycling operations.

## Candidate Input
You will receive profile JSON with leadership skills, role description, and operational context.

## Scoring Rubric (0-100)
- 0-20: No evidence of team leadership or motivation capabilities.
- 21-40: Limited team influence; communication and coaching signals are weak.
- 41-60: Adequate people-management baseline with inconsistent impact.
- 61-80: Strong leadership behaviors with clear engagement and accountability practices.
- 81-100: Exceptional team builder with scalable culture, retention, and performance impact.

## Evaluation Dimensions
1. Coaching and development behavior
2. Communication clarity and trust building
3. Conflict handling and morale stabilization
4. Accountability and recognition balance
5. Motivation under stress and operational variability

## Output Requirements
Return strict JSON only with this schema:

```json
{
  "score": 0,
  "justification": "string",
  "evidence": ["string", "string"],
  "development_priorities": ["string"],
  "confidence": 0
}
```

Rules:
- `score` must be an integer from 0 to 100.
- `justification` must reference candidate evidence.
- `evidence` must contain 1-3 concise indicators.
- `development_priorities` should identify practical next steps.
- `confidence` must be an integer from 0 to 100.