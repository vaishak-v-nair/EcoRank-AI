const express = require('express');
const { createSimpleRateLimit } = require('../middleware/simpleRateLimit');
const {
  getDashboard,
  listCandidates,
  getCandidateDetail,
  getCandidateProfileById,
  getCandidateEvaluations,
  evaluateCandidate,
  leaderboard,
  skillHeatmap
} = require('../controllers/candidateController');

const router = express.Router();
const evaluateRateLimit = createSimpleRateLimit({ windowMs: 60_000, maxRequests: 20 });

router.get('/dashboard', getDashboard);
router.get('/leaderboard', leaderboard);
router.get('/heatmap', skillHeatmap);
router.get('/candidates', listCandidates);
router.get('/candidates/:id', getCandidateDetail);
router.get('/candidates/:id/profile', getCandidateProfileById);
router.get('/candidates/:id/evaluations', getCandidateEvaluations);
router.post('/candidates/:id/evaluate', evaluateRateLimit, evaluateCandidate);

module.exports = router;
