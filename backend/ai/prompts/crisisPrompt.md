# Crisis Management Evaluation Prompt

## Objective
Evaluate the candidate's ability to manage operational crises in recycling operations, including safety incidents, processing downtime, contamination spikes, and stakeholder escalation.

## Candidate Input
You will receive a candidate profile JSON with work history, years of experience, skills, and summary.

## Scoring Rubric (0-100)
- 0-20: No practical evidence of crisis ownership or response discipline.
- 21-40: Limited exposure, mostly supportive role, weak decision-making signals.
- 41-60: Moderate operational response capability with partial leadership evidence.
- 61-80: Strong incident management with clear coordination, safety, and containment behavior.
- 81-100: Exceptional crisis leadership, proactive risk controls, and measurable post-incident improvement.

## Evaluation Dimensions
1. Incident triage and prioritization
2. Safety-first decision quality
3. Cross-team communication under pressure
4. Recovery planning and continuity execution
5. Learning loop (root cause and prevention)

## Output Requirements
Return strict JSON only with this schema:

```json
{
  "score": 0,
  "justification": "string",
  "evidence": ["string", "string"],
  "risks": ["string"],
  "confidence": 0
}
```

Rules:
- `score` must be an integer from 0 to 100.
- `justification` must reference profile evidence.
- `evidence` must contain 1-3 concise proof points.
- `risks` should include capability gaps.
- `confidence` must be an integer from 0 to 100.