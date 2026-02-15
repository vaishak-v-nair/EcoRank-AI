const { query } = require('../config/db.config');
const { safeJsonParse } = require('./repositoryUtils');

function mapCandidateRow(row) {
  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    location_city: row.location_city,
    location_state: row.location_state,
    location_country: row.location_country,
    years_experience: Number(row.years_experience),
    highest_education: row.highest_education,
    current_role: row.current_role,
    industry_focus: row.industry_focus,
    profile_summary: row.profile_summary,
    skills_json: safeJsonParse(row.skills_json, []),
    latest_evaluation: row.evaluation_id
      ? {
          evaluation_id: row.evaluation_id,
          evaluator_version: row.evaluator_version,
          crisis_score: Number(row.crisis_score),
          sustainability_score: Number(row.sustainability_score),
          motivation_score: Number(row.motivation_score),
          overall_score: Number(row.overall_score),
          evaluated_at: row.evaluated_at,
          rank_position: row.rank_position ? Number(row.rank_position) : null
        }
      : null
  };
}

async function getCandidates({ limit = 40, offset = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 40, 1), 200);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const rows = await query(
    `SELECT
      c.id,
      c.full_name,
      c.email,
      c.phone,
      c.location_city,
      c.location_state,
      c.location_country,
      c.years_experience,
      c.highest_education,
      c.current_role,
      c.industry_focus,
      c.profile_summary,
      c.skills_json,
      le.evaluation_id,
      le.evaluator_version,
      le.crisis_score,
      le.sustainability_score,
      le.motivation_score,
      le.overall_score,
      le.evaluated_at,
      vr.rank_position
    FROM candidates c
    LEFT JOIN vw_candidate_latest_evaluation le
      ON le.candidate_id = c.id
    LEFT JOIN vw_candidate_rankings vr
      ON vr.candidate_id = c.id
    ORDER BY COALESCE(vr.rank_position, 999999), c.id ASC
    LIMIT ? OFFSET ?`,
    [safeLimit, safeOffset]
  );

  return rows.map(mapCandidateRow);
}

async function getCandidateById(candidateId) {
  const rows = await query(
    `SELECT
      c.id,
      c.full_name,
      c.email,
      c.phone,
      c.location_city,
      c.location_state,
      c.location_country,
      c.years_experience,
      c.highest_education,
      c.current_role,
      c.industry_focus,
      c.profile_summary,
      c.skills_json,
      le.evaluation_id,
      le.evaluator_version,
      le.crisis_score,
      le.sustainability_score,
      le.motivation_score,
      le.overall_score,
      le.evaluated_at,
      vr.rank_position
    FROM candidates c
    LEFT JOIN vw_candidate_latest_evaluation le
      ON le.candidate_id = c.id
    LEFT JOIN vw_candidate_rankings vr
      ON vr.candidate_id = c.id
    WHERE c.id = ?
    LIMIT 1`,
    [candidateId]
  );

  if (!rows.length) {
    return null;
  }

  return mapCandidateRow(rows[0]);
}

async function getCandidateSkills(candidateId) {
  const rows = await query(
    `SELECT
      s.id,
      s.skill_name,
      s.category,
      cs.proficiency
    FROM candidate_skills cs
    JOIN skills s
      ON s.id = cs.skill_id
    WHERE cs.candidate_id = ?
    ORDER BY cs.proficiency DESC, s.skill_name ASC`,
    [candidateId]
  );

  return rows.map((row) => ({
    id: row.id,
    skill_name: row.skill_name,
    category: row.category,
    proficiency: Number(row.proficiency)
  }));
}

async function getCandidateWithSkills(candidateId) {
  const [candidate, skills] = await Promise.all([
    getCandidateById(candidateId),
    getCandidateSkills(candidateId)
  ]);

  if (!candidate) {
    return null;
  }

  return {
    ...candidate,
    skills
  };
}

async function getCandidateEvaluationHistory(candidateId, limit = 10) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const rows = await query(
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
    WHERE candidate_id = ?
    ORDER BY evaluated_at DESC, id DESC
    LIMIT ?`,
    [candidateId, safeLimit]
  );

  return rows.map((row) => ({
    id: row.id,
    candidate_id: row.candidate_id,
    evaluator_version: row.evaluator_version,
    crisis_score: Number(row.crisis_score),
    sustainability_score: Number(row.sustainability_score),
    motivation_score: Number(row.motivation_score),
    overall_score: Number(row.overall_score),
    justification_json: safeJsonParse(row.justification_json, {}),
    evaluated_at: row.evaluated_at
  }));
}

module.exports = {
  getCandidates,
  getCandidateById,
  getCandidateSkills,
  getCandidateWithSkills,
  getCandidateEvaluationHistory
};
