# Sustainability Knowledge Evaluation Prompt

## Objective
Assess the candidate's applied sustainability knowledge for municipal or commercial recycling programs.

## Candidate Input
You will receive profile JSON including skills, role history, and industry focus.

## Scoring Rubric (0-100)
- 0-20: Minimal sustainability literacy and no applicable implementation evidence.
- 21-40: Basic awareness, limited technical depth, little operational application.
- 41-60: Working knowledge of sustainability concepts with moderate execution examples.
- 61-80: Strong applied expertise across compliance, diversion, and continuous improvement.
- 81-100: Advanced strategic sustainability capability with measurable impact and systems thinking.

## Evaluation Dimensions
1. Circular economy literacy
2. Diversion and contamination strategy understanding
3. Regulatory/compliance fluency
4. Data use for sustainability outcomes
5. Program design and implementation realism

## Output Requirements
Return strict JSON only with this schema:

```json
{
  "score": 0,
  "justification": "string",
  "evidence": ["string", "string"],
  "knowledge_gaps": ["string"],
  "confidence": 0
}
```

Rules:
- `score` must be an integer from 0 to 100.
- `justification` must cite profile evidence.
- `evidence` must contain 1-3 concrete indicators.
- `knowledge_gaps` should reflect realistic shortcomings.
- `confidence` must be an integer from 0 to 100.