USE recycling_manager_selection;

DROP VIEW IF EXISTS vw_candidate_latest_evaluation;
CREATE VIEW vw_candidate_latest_evaluation AS
WITH ordered_evaluations AS (
  SELECT
    e.id AS evaluation_id,
    e.candidate_id,
    e.evaluator_version,
    e.crisis_score,
    e.sustainability_score,
    e.motivation_score,
    e.overall_score,
    e.justification_json,
    e.evaluated_at,
    ROW_NUMBER() OVER (PARTITION BY e.candidate_id ORDER BY e.evaluated_at DESC, e.id DESC) AS rn
  FROM evaluations e
)
SELECT
  oe.evaluation_id,
  oe.candidate_id,
  oe.evaluator_version,
  oe.crisis_score,
  oe.sustainability_score,
  oe.motivation_score,
  oe.overall_score,
  oe.justification_json,
  oe.evaluated_at
FROM ordered_evaluations oe
WHERE oe.rn = 1;

DROP VIEW IF EXISTS vw_candidate_rankings;
CREATE VIEW vw_candidate_rankings AS
SELECT
  c.id AS candidate_id,
  c.full_name,
  c.current_role,
  c.location_city,
  c.location_state,
  c.years_experience,
  le.crisis_score,
  le.sustainability_score,
  le.motivation_score,
  le.overall_score,
  le.evaluator_version,
  le.evaluated_at,
  DENSE_RANK() OVER (ORDER BY le.overall_score DESC, c.years_experience DESC, c.id ASC) AS rank_position
FROM candidates c
JOIN vw_candidate_latest_evaluation le
  ON le.candidate_id = c.id;

DROP VIEW IF EXISTS vw_skill_heatmap_top10;
CREATE VIEW vw_skill_heatmap_top10 AS
WITH top_candidates AS (
  SELECT candidate_id
  FROM vw_candidate_rankings
  ORDER BY rank_position ASC, candidate_id ASC
  LIMIT 10
)
SELECT
  s.skill_name,
  s.category,
  ROUND(AVG(cs.proficiency), 2) AS avg_proficiency,
  COUNT(*) AS candidate_count
FROM top_candidates tc
JOIN candidate_skills cs
  ON cs.candidate_id = tc.candidate_id
JOIN skills s
  ON s.id = cs.skill_id
GROUP BY s.skill_name, s.category
ORDER BY s.category, avg_proficiency DESC, s.skill_name;