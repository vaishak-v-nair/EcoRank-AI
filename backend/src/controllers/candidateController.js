const { getCandidates, getCandidateEvaluationHistory } = require('../../repositories/candidateRepository');
const { getSkillHeatmap } = require('../../repositories/evaluationRepository');
const { evaluateCandidateById, getCandidateAssessmentSummary } = require('../../services/evaluationService');
const { getDashboardData, getLeaderboardData, getCandidateProfile } = require('../../services/rankingService');
const mockStore = require('../../mock/mockStore');
const {
  parsePositiveInt,
  parseDirection,
  parseSortBy,
  parseProvider
} = require('../utils/validators');
const { AppError } = require('../utils/appError');

const USE_MOCK_FALLBACK = process.env.USE_MOCK_FALLBACK !== 'false';

function isDatabaseUnavailableError(error) {
  return error?.code === 'DATABASE_UNAVAILABLE' || error?.statusCode === 503;
}

async function withDbFallback(primaryFn, fallbackFn) {
  try {
    return await primaryFn();
  } catch (error) {
    if (USE_MOCK_FALLBACK && isDatabaseUnavailableError(error)) {
      return fallbackFn();
    }
    throw error;
  }
}

function parseId(value, fieldName = 'id') {
  return parsePositiveInt(value, { fieldName, min: 1, max: 10_000_000 });
}

async function getDashboard(req, res, next) {
  try {
    const dashboard = await withDbFallback(
      async () => getDashboardData(),
      async () => mockStore.getDashboard()
    );
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
    const candidates = await withDbFallback(
      async () => getCandidates({ limit, offset }),
      async () => mockStore.getCandidates(limit, offset)
    );
    res.json(candidates);
  } catch (error) {
    next(error);
  }
}

async function getCandidateDetail(req, res, next) {
  try {
    const candidateId = parseId(req.params.id, 'candidate id');
    const detail = await withDbFallback(
      async () => getCandidateAssessmentSummary(candidateId, 10),
      async () => {
        const mockDetail = mockStore.getCandidateDetail(candidateId);
        if (!mockDetail) {
          throw new AppError(`Candidate ${candidateId} was not found`, 404, 'NOT_FOUND');
        }
        return mockDetail;
      }
    );
    res.json(detail);
  } catch (error) {
    next(error);
  }
}

async function getCandidateProfileById(req, res, next) {
  try {
    const candidateId = parseId(req.params.id, 'candidate id');
    const profile = await withDbFallback(
      async () => getCandidateProfile(candidateId),
      async () => {
        const mockDetail = mockStore.getCandidateDetail(candidateId);
        if (!mockDetail) {
          throw new AppError(`Candidate ${candidateId} was not found`, 404, 'NOT_FOUND');
        }
        return mockDetail.candidate;
      }
    );
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
    const evaluations = await withDbFallback(
      async () => getCandidateEvaluationHistory(candidateId, limit),
      async () => {
        const mockDetail = mockStore.getCandidateDetail(candidateId);
        return mockDetail?.evaluations || [];
      }
    );
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

    const result = await withDbFallback(
      async () => evaluateCandidateById(candidateId, {
        provider,
        evaluatorVersion
      }),
      async () => {
        const evaluated = await mockStore.evaluateCandidateById(candidateId, provider, evaluatorVersion);
        if (!evaluated) {
          throw new AppError(`Candidate ${candidateId} was not found`, 404, 'NOT_FOUND');
        }
        return evaluated;
      }
    );

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

    const rows = await withDbFallback(
      async () => getLeaderboardData({
        limit,
        sortBy,
        direction
      }),
      async () => mockStore.getLeaderboard(limit, sortBy, direction)
    );

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
    const heatmap = await withDbFallback(
      async () => getSkillHeatmap(top),
      async () => mockStore.getHeatmap(top)
    );
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
