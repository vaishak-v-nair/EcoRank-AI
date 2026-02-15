const { query } = require('../config/db.config');
const { safeJsonParse } = require('./repositoryUtils');

const SORT_MAP = {
  rank: 'rank_position',
  overallScore: 'overall_score',
  crisisScore: 'crisis_score',
  sustainabilityScore: 'sustainability_score',
  motivationScore: 'motivation_score',
  yearsExperience: 'years_experience'
};

function normalizeDirection(direction) {
  return String(direction).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
}

async function saveEvaluation(candidateId, evaluationPayload) {
  const result = await query(
    `INSERT INTO evaluations (
      candidate_id,
      evaluator_version,
      crisis_score,
      sustainability_score,
      motivation_score,
      justification_json
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      candidateId,
      evaluationPayload.evaluator_version,
      evaluationPayload.crisis_score,
      evaluationPayload.sustainability_score,
      evaluationPayload.motivation_score,
      JSON.stringify(evaluationPayload.justification_json)
    ]
  );

  const insertedRows = await query(
    `SELECT
      id,
      candidate_id,
      evaluator_version,
      crisis_score,
      sustainability_score,
      motivation_score,
      overall_score,
      justification_json,
      evaluated_at
    FROM evaluations
    WHERE id = ?`,
    [result.insertId]
  );

  const row = insertedRows[0];
  return {
    id: row.id,
    candidate_id: row.candidate_id,
    evaluator_version: row.evaluator_version,
    crisis_score: Number(row.crisis_score),
    sustainability_score: Number(row.sustainability_score),
    motivation_score: Number(row.motivation_score),
    overall_score: Number(row.overall_score),
    justification_json: safeJsonParse(row.justification_json, {}),
    evaluated_at: row.evaluated_at
  };
}

async function getLeaderboard({ limit = 10, sortBy = 'rank', direction = 'asc' } = {}) {
  const sortColumn = SORT_MAP[sortBy] || SORT_MAP.rank;
  const orderDirection = normalizeDirection(direction);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const rows = await query(
    `SELECT
      candidate_id,
      full_name,
      current_role,
      location_city,
      location_state,
      years_experience,
      crisis_score,
      sustainability_score,
      motivation_score,
      overall_score,
      evaluator_version,
      evaluated_at,
      rank_position
    FROM vw_candidate_rankings
    ORDER BY ${sortColumn} ${orderDirection}, candidate_id ASC
    LIMIT ?`,
    [safeLimit]
  );

  return rows.map((row) => ({
    candidate_id: row.candidate_id,
    full_name: row.full_name,
    current_role: row.current_role,
    location_city: row.location_city,
    location_state: row.location_state,
    years_experience: Number(row.years_experience),
    crisis_score: Number(row.crisis_score),
    sustainability_score: Number(row.sustainability_score),
    motivation_score: Number(row.motivation_score),
    overall_score: Number(row.overall_score),
    evaluator_version: row.evaluator_version,
    evaluated_at: row.evaluated_at,
    rank_position: Number(row.rank_position)
  }));
}

async function getSkillHeatmap(top = 10) {
  const safeTop = Math.min(Math.max(Number(top) || 10, 1), 50);

  const rows = await query(
    `WITH top_candidates AS (
      SELECT candidate_id
      FROM vw_candidate_rankings
      ORDER BY rank_position ASC, candidate_id ASC
      LIMIT ?
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
    ORDER BY s.category ASC, avg_proficiency DESC, s.skill_name ASC`,
    [safeTop]
  );

  return rows.map((row) => ({
    skill_name: row.skill_name,
    category: row.category,
    avg_proficiency: Number(row.avg_proficiency),
    candidate_count: Number(row.candidate_count)
  }));
}

module.exports = {
  saveEvaluation,
  getLeaderboard,
  getSkillHeatmap
};
