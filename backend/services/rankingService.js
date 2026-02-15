const { getCandidates, getCandidateWithSkills } = require('../repositories/candidateRepository');
const { getLeaderboard, getSkillHeatmap } = require('../repositories/evaluationRepository');
const { getOrSetCache, invalidateByPrefix } = require('./cacheService');

const CACHE_TTL_MS = {
  dashboard: 30_000,
  leaderboard: 20_000,
  heatmap: 20_000
};

async function getLeaderboardData(options = {}) {
  const key = `leaderboard:${JSON.stringify(options)}`;
  return getOrSetCache(key, CACHE_TTL_MS.leaderboard, async () => getLeaderboard(options));
}

async function getDashboardData() {
  return getOrSetCache('dashboard:v1', CACHE_TTL_MS.dashboard, async () => {
    const [leaderboard, heatmap, candidates] = await Promise.all([
      getLeaderboard({ limit: 10, sortBy: 'rank', direction: 'asc' }),
      getSkillHeatmap(10),
      getCandidates({ limit: 40, offset: 0 })
    ]);

    return {
      leaderboard,
      heatmap,
      candidates
    };
  });
}

async function getCandidateProfile(candidateId) {
  const candidate = await getCandidateWithSkills(candidateId);
  if (!candidate) {
    const error = new Error(`Candidate ${candidateId} was not found`);
    error.statusCode = 404;
    throw error;
  }

  return candidate;
}

function invalidateRankingCaches() {
  invalidateByPrefix('dashboard:');
  invalidateByPrefix('leaderboard:');
  invalidateByPrefix('heatmap:');
}

module.exports = {
  getLeaderboardData,
  getDashboardData,
  getCandidateProfile,
  invalidateRankingCaches
};
