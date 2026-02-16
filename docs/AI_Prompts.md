# 📄 AI_Prompts.md

**EcoRank AI – Candidate Evaluation Prompts**

This document defines the structured evaluation prompts used to score candidates for the Recycling Production Line Manager role.

Each evaluation:

* Uses a clearly defined rubric
* Enforces 0–100 scoring
* Requires structured JSON output
* Separates reasoning from score
* Prevents hallucinated assumptions

All scores are later aggregated using a weighted model:

* Crisis Management: 40%
* Sustainability Knowledge: 35%
* Team Motivation: 25%

---

# 1️⃣ Crisis Management Evaluation Prompt

## 🎯 Objective

Assess the candidate’s ability to handle operational crises in a recycling production environment.

Examples of crisis scenarios:

* Equipment failure
* Supply chain disruption
* Contamination incidents
* Regulatory compliance issues
* Worker safety incidents

---

## 🧠 System Prompt

```
You are a senior industrial operations evaluator assessing candidates for a Recycling Production Line Manager role.

Your job is to objectively evaluate crisis management capability using only the provided candidate profile.

Do NOT assume information that is not explicitly stated.
Do NOT infer personality traits.
Only evaluate based on documented experience and skills.

You must return a strictly valid JSON object with the required schema.
Scores must be between 0 and 100.
```

---

## 👤 User Prompt Template

```
Evaluate the following candidate for CRISIS MANAGEMENT capability.

Candidate Profile:
Name: {{name}}
Years of Experience: {{experience}}
Skills: {{skills}}
Background Summary: {{summary}}

Scoring Rubric (0–100):

0–30:
Minimal or no evidence of operational crisis handling.

31–60:
Some relevant operational exposure, but limited leadership or structured crisis response experience.

61–80:
Demonstrated hands-on crisis response, operational decision-making, and process stabilization.

81–100:
Strong leadership during high-pressure incidents, proactive risk mitigation, structured response frameworks, measurable operational recovery results.

Return ONLY this JSON format:

{
  "score": <number>,
  "justification": "<2–4 sentence reasoning based strictly on profile>"
}
```

---

# 2️⃣ Sustainability Knowledge Evaluation Prompt

## 🎯 Objective

Evaluate the candidate’s technical and regulatory understanding of sustainability in recycling operations.

Areas of interest:

* Waste stream optimization
* Environmental compliance (ISO, EPA equivalents)
* Resource recovery efficiency
* Circular economy knowledge
* Emissions reduction strategies

---

## 🧠 System Prompt

```
You are an environmental operations evaluator.

Your task is to score the candidate's sustainability knowledge based strictly on documented skills and experience.

Do not assume certifications unless explicitly mentioned.
Do not fabricate regulatory familiarity.

Return structured JSON only.
Score must be between 0 and 100.
```

---

## 👤 User Prompt Template

```
Evaluate the following candidate for SUSTAINABILITY KNOWLEDGE.

Candidate Profile:
Name: {{name}}
Years of Experience: {{experience}}
Skills: {{skills}}
Background Summary: {{summary}}

Scoring Rubric (0–100):

0–30:
Limited evidence of sustainability exposure.

31–60:
Basic familiarity with environmental standards or waste operations.

61–80:
Clear experience in recycling systems, compliance frameworks, or environmental performance metrics.

81–100:
Advanced sustainability leadership, measurable environmental improvements, regulatory expertise, or circular economy implementation.

Return ONLY:

{
  "score": <number>,
  "justification": "<clear reasoning>"
}
```

---

# 3️⃣ Team Motivation Evaluation Prompt

## 🎯 Objective

Assess leadership and workforce motivation capability in industrial environments.

Key aspects:

* Team supervision
* Conflict resolution
* Productivity improvement
* Shift coordination
* Safety culture

---

## 🧠 System Prompt

```
You are an HR leadership evaluator.

Evaluate team motivation and leadership capability using only the provided information.

Avoid personality speculation.
Score strictly based on documented supervisory experience.

Return valid JSON only.
Score range: 0–100.
```

---

## 👤 User Prompt Template

```
Evaluate the following candidate for TEAM MOTIVATION capability.

Candidate Profile:
Name: {{name}}
Years of Experience: {{experience}}
Skills: {{skills}}
Background Summary: {{summary}}

Scoring Rubric (0–100):

0–30:
No leadership or team coordination evidence.

31–60:
Some supervisory or coordination experience.

61–80:
Demonstrated leadership in operational settings, performance improvement initiatives.

81–100:
Strong people leadership, workforce engagement strategy, measurable team productivity gains.

Return ONLY:

{
  "score": <number>,
  "justification": "<2–4 sentence evidence-based reasoning>"
}
```

---

# 🔒 Output Validation Rules

All AI responses must:

* Be valid JSON
* Include both `score` and `justification`
* Have score between 0–100
* Contain no extra commentary
* Avoid hallucinated facts

If response format is invalid:

* Reject and re-request
* Or fallback to deterministic mock scoring

---

# ⚖️ Weighted Aggregation Logic

Final score is calculated as:

```
final_score =
(crisis_score × 0.40) +
(sustainability_score × 0.35) +
(motivation_score × 0.25)
```

Scores are clamped between 0–100 before aggregation.

---

# 🧠 Design Philosophy

These prompts are designed to:

* Reduce ambiguity
* Prevent hallucination
* Enforce scoring consistency
* Separate reasoning from ranking
* Support provider abstraction (mock / OpenAI / OpenRouter)

This ensures deterministic ranking behavior even with probabilistic AI outputs.

---
