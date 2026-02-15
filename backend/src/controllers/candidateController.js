const { getCandidates, getCandidateEvaluationHistory } = require('../../repositories/candidateRepository');
const { getSkillHeatmap } = require('../../repositories/evaluationRepository');
const { evaluateCandidateById, getCandidateAssessmentSummary } = require('../../services/evaluationService');
const { getDashboardData, getLeaderboardData, getCandidateProfile } = require('../../services/rankingService');
const {
  parsePositiveInt,
  parseDirection,
  parseSortBy,
  parseProvider
} = require('../utils/validators');

function parseId(value, fieldName = 'id') {
  return parsePositiveInt(value, { fieldName, min: 1, max: 10_000_000 });
}

async function getDashboard(req, res, next) {
  try {
    const dashboard = await getDashboardData();
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
}

async function listCandidates(req, res, next) {
  try {
    const limit = parsePositiveInt(req.query.limit, {
      fieldName: 'limit',
      defaultValue: 40,
      min: 1,
      max: 200
    });
    const offset = parsePositiveInt(req.query.offset, {
      fieldName: 'offset',
      defaultValue: 0,
      min: 0,
      max: 10000
    });
    const candidates = await getCandidates({ limit, offset });
    res.json(candidates);
  } catch (error) {
    next(error);
  }
}

async function getCandidateDetail(req, res, next) {
  try {
    const candidateId = parseId(req.params.id, 'candidate id');
    const detail = await getCandidateAssessmentSummary(candidateId, 10);
    res.json(detail);
  } catch (error) {
    next(error);
  }
}

async function getCandidateProfileById(req, res, next) {
  try {
    const candidateId = parseId(req.params.id, 'candidate id');
    const profile = await getCandidateProfile(candidateId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function getCandidateEvaluations(req, res, next) {
  try {
    const candidateId = parseId(req.params.id, 'candidate id');
    const limit = parsePositiveInt(req.query.limit, {
      fieldName: 'limit',
      defaultValue: 10,
      min: 1,
      max: 100
    });
    const evaluations = await getCandidateEvaluationHistory(candidateId, limit);
    res.json(evaluations);
  } catch (error) {
    next(error);
  }
}

async function evaluateCandidate(req, res, next) {
  try {
    const candidateId = parseId(req.params.id, 'candidate id');
    const provider = parseProvider(req.body?.provider, 'mock');
    const evaluatorVersion = String(req.body?.evaluatorVersion || 'v1').trim();

    const result = await evaluateCandidateById(candidateId, {
      provider,
      evaluatorVersion
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function leaderboard(req, res, next) {
  try {
    const limit = parsePositiveInt(req.query.limit, {
      fieldName: 'limit',
      defaultValue: 10,
      min: 1,
      max: 100
    });
    const sortBy = parseSortBy(req.query.sortBy, 'rank');
    const direction = parseDirection(req.query.direction, 'asc');

    const rows = await getLeaderboardData({
      limit,
      sortBy,
      direction
    });

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function skillHeatmap(req, res, next) {
  try {
    const top = parsePositiveInt(req.query.top, {
      fieldName: 'top',
      defaultValue: 10,
      min: 1,
      max: 50
    });
    const heatmap = await getSkillHeatmap(top);
    res.json(heatmap);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  listCandidates,
  getCandidateDetail,
  getCandidateProfileById,
  getCandidateEvaluations,
  evaluateCandidate,
  leaderboard,
  skillHeatmap
};
