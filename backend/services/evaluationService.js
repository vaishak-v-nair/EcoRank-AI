const { evaluateCandidate } = require('../ai/evaluator');
const {
  getCandidateWithSkills,
  getCandidateEvaluationHistory
} = require('../repositories/candidateRepository');
const { saveEvaluation } = require('../repositories/evaluationRepository');
const { invalidateRankingCaches } = require('./rankingService');
const { AppError } = require('../src/utils/appError');

const SUPPORTED_PROVIDERS = new Set(['mock', 'openai']);

function normalizeProvider(provider) {
  const normalized = String(provider || 'mock').toLowerCase();
  if (!SUPPORTED_PROVIDERS.has(normalized)) {
    throw new AppError(
      `provider must be one of: ${[...SUPPORTED_PROVIDERS].join(', ')}`,
      400,
      'VALIDATION_ERROR'
    );
  }

  return normalized;
}

async function evaluateCandidateById(candidateId, options = {}) {
  const candidate = await getCandidateWithSkills(candidateId);

  if (!candidate) {
    const error = new Error(`Candidate ${candidateId} was not found`);
    error.statusCode = 404;
    throw error;
  }

  const provider = normalizeProvider(options.provider);
  const evaluatorVersion = String(options.evaluatorVersion || 'v1').trim().slice(0, 32) || 'v1';

  const aiResult = await evaluateCandidate(candidate, { provider });

  const savedEvaluation = await saveEvaluation(candidateId, {
    evaluator_version: evaluatorVersion,
    crisis_score: aiResult.scores.crisisManagement,
    sustainability_score: aiResult.scores.sustainabilityKnowledge,
    motivation_score: aiResult.scores.teamMotivation,
    justification_json: {
      provider: aiResult.provider,
      confidence: aiResult.confidence,
      evidence: aiResult.evidence,
      dimensions: aiResult.justification
    }
  });

  invalidateRankingCaches();

  return {
    candidate_id: candidateId,
    evaluation: savedEvaluation
  };
}

async function getCandidateAssessmentSummary(candidateId, historyLimit = 10) {
  const candidate = await getCandidateWithSkills(candidateId);

  if (!candidate) {
    const error = new Error(`Candidate ${candidateId} was not found`);
    error.statusCode = 404;
    throw error;
  }

  const history = await getCandidateEvaluationHistory(candidateId, historyLimit);

  return {
    candidate,
    evaluations: history
  };
}

module.exports = {
  evaluateCandidateById,
  getCandidateAssessmentSummary
};
