const { faker } = require('@faker-js/faker');
const {
  SKILL_LIBRARY,
  ROLE_TITLES,
  INDUSTRY_FOCUS,
  EDUCATION_LEVELS,
  SUMMARY_SNIPPETS
} = require('../generators/skillsLibrary');
const { evaluateCandidate } = require('../ai/evaluator');

faker.seed(20260215);

const state = {
  candidates: [],
  evaluations: [],
  nextEvaluationId: 1
};

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function weightedEducation() {
  const roll = faker.number.int({ min: 1, max: 100 });
  if (roll <= 20) return EDUCATION_LEVELS[0];
  if (roll <= 65) return EDUCATION_LEVELS[1];
  if (roll <= 90) return EDUCATION_LEVELS[2];
  return EDUCATION_LEVELS[3];
}

function computeOverall(crisis, sustainability, motivation) {
  return Number((crisis * 0.4 + sustainability * 0.35 + motivation * 0.25).toFixed(2));
}

function rankCandidates(candidates) {
  const scored = candidates
    .filter((candidate) => candidate.latest_evaluation)
    .sort((a, b) => {
      const delta = b.latest_evaluation.overall_score - a.latest_evaluation.overall_score;
      if (delta !== 0) return delta;
      const expDelta = b.years_experience - a.years_experience;
      if (expDelta !== 0) return expDelta;
      return a.id - b.id;
    });

  let lastScore = null;
  let rank = 0;
  scored.forEach((candidate, index) => {
    if (candidate.latest_evaluation.overall_score !== lastScore) {
      rank = index + 1;
      lastScore = candidate.latest_evaluation.overall_score;
    }
    candidate.latest_evaluation.rank_position = rank;
  });
}

function buildInitialData() {
  const candidates = [];
  const evaluations = [];

  for (let idx = 1; idx <= 40; idx += 1) {
    const fullName = faker.person.fullName();
    const role = faker.helpers.arrayElement(ROLE_TITLES);
    const focus = faker.helpers.arrayElement(INDUSTRY_FOCUS);
    const selectedSkills = faker.helpers.shuffle(SKILL_LIBRARY).slice(0, faker.number.int({ min: 5, max: 8 }))
      .map((skill) => ({
        id: SKILL_LIBRARY.findIndex((s) => s.name === skill.name) + 1,
        skill_name: skill.name,
        category: skill.category,
        proficiency: faker.number.int({ min: 2, max: 5 })
      }));

    const yearsExperience = Number((faker.number.int({ min: 3, max: 24 }) + faker.number.int({ min: 0, max: 9 }) / 10).toFixed(1));
    const leadership = avg(selectedSkills.filter((s) => s.category === 'Leadership').map((s) => s.proficiency));
    const sustainability = avg(selectedSkills.filter((s) => s.category === 'Sustainability').map((s) => s.proficiency));
    const safety = avg(selectedSkills.filter((s) => s.category === 'Safety').map((s) => s.proficiency));
    const compliance = avg(selectedSkills.filter((s) => s.category === 'Compliance').map((s) => s.proficiency));
    const operations = avg(selectedSkills.filter((s) => s.category === 'Operations').map((s) => s.proficiency));
    const analytics = avg(selectedSkills.filter((s) => s.category === 'Analytics').map((s) => s.proficiency));

    const crisis = clamp(Math.round(43 + yearsExperience * 1.7 + leadership * 5.2 + safety * 4.4 + operations * 2.1 + faker.number.int({ min: -6, max: 6 })), 0, 100);
    const sustain = clamp(Math.round(40 + yearsExperience * 1.4 + sustainability * 6.1 + compliance * 5 + analytics * 2 + faker.number.int({ min: -6, max: 6 })), 0, 100);
    const motivation = clamp(Math.round(44 + yearsExperience * 1.5 + leadership * 6 + analytics * 1.3 + faker.number.int({ min: -8, max: 8 })), 0, 100);
    const overall = computeOverall(crisis, sustain, motivation);
    const evaluatedAt = faker.date.recent({ days: 90 }).toISOString();

    const candidate = {
      id: idx,
      full_name: fullName,
      email: faker.internet.email({ firstName: fullName.split(' ')[0], lastName: fullName.split(' ').slice(-1)[0], provider: 'example.com' }).toLowerCase(),
      phone: faker.phone.number('###-###-####'),
      location_city: faker.location.city(),
      location_state: faker.location.state(),
      location_country: 'USA',
      years_experience: yearsExperience,
      highest_education: weightedEducation(),
      current_role: role,
      industry_focus: focus,
      profile_summary: `${role} focused on ${focus}. ${faker.helpers.shuffle(SUMMARY_SNIPPETS).slice(0, 2).join(' ')} Known for strong program execution and team stability.`,
      skills_json: selectedSkills.map((s) => ({ name: s.skill_name, category: s.category, proficiency: s.proficiency })),
      skills: selectedSkills,
      latest_evaluation: {
        evaluation_id: idx,
        evaluator_version: 'v1',
        crisis_score: crisis,
        sustainability_score: sustain,
        motivation_score: motivation,
        overall_score: overall,
        evaluated_at: evaluatedAt,
        rank_position: null
      }
    };

    candidates.push(candidate);
    evaluations.push({
      id: idx,
      candidate_id: idx,
      evaluator_version: 'v1',
      crisis_score: crisis,
      sustainability_score: sustain,
      motivation_score: motivation,
      overall_score: overall,
      justification_json: {
        provider: 'mock',
        confidence: 82,
        dimensions: {
          crisis_management: `${fullName} demonstrates operational composure and incident response readiness.`,
          sustainability_knowledge: `${fullName} applies sustainability best practices with measurable discipline.`,
          team_motivation: `${fullName} exhibits stable coaching behaviors in high-pressure operations.`
        }
      },
      evaluated_at: evaluatedAt
    });
  }

  rankCandidates(candidates);
  state.candidates = candidates;
  state.evaluations = evaluations.sort((a, b) => new Date(b.evaluated_at) - new Date(a.evaluated_at));
  state.nextEvaluationId = evaluations.length + 1;
}

function getLeaderboard(limit = 10, sortBy = 'rank', direction = 'asc') {
  const fieldMap = {
    rank: 'rank_position',
    overallScore: 'overall_score',
    crisisScore: 'crisis_score',
    sustainabilityScore: 'sustainability_score',
    motivationScore: 'motivation_score',
    yearsExperience: 'years_experience'
  };
  const field = fieldMap[sortBy] || 'rank_position';
  const dir = direction === 'desc' ? -1 : 1;

  return state.candidates
    .filter((candidate) => candidate.latest_evaluation)
    .map((candidate) => ({
      candidate_id: candidate.id,
      full_name: candidate.full_name,
      current_role: candidate.current_role,
      location_city: candidate.location_city,
      location_state: candidate.location_state,
      years_experience: candidate.years_experience,
      crisis_score: candidate.latest_evaluation.crisis_score,
      sustainability_score: candidate.latest_evaluation.sustainability_score,
      motivation_score: candidate.latest_evaluation.motivation_score,
      overall_score: candidate.latest_evaluation.overall_score,
      evaluator_version: candidate.latest_evaluation.evaluator_version,
      evaluated_at: candidate.latest_evaluation.evaluated_at,
      rank_position: candidate.latest_evaluation.rank_position
    }))
    .sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    })
    .slice(0, limit);
}

function getHeatmap(top = 10) {
  const topCandidates = getLeaderboard(top, 'rank', 'asc');
  const selectedIds = new Set(topCandidates.map((entry) => entry.candidate_id));
  const grouped = new Map();

  state.candidates
    .filter((candidate) => selectedIds.has(candidate.id))
    .forEach((candidate) => {
      candidate.skills.forEach((skill) => {
        const key = `${skill.category}:${skill.skill_name}`;
        const row = grouped.get(key) || {
          skill_name: skill.skill_name,
          category: skill.category,
          total: 0,
          count: 0
        };
        row.total += skill.proficiency;
        row.count += 1;
        grouped.set(key, row);
      });
    });

  return [...grouped.values()]
    .map((row) => ({
      skill_name: row.skill_name,
      category: row.category,
      avg_proficiency: Number((row.total / row.count).toFixed(2)),
      candidate_count: row.count
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || b.avg_proficiency - a.avg_proficiency || a.skill_name.localeCompare(b.skill_name));
}

function getCandidates(limit = 40, offset = 0) {
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const safeOffset = Math.max(offset, 0);
  return state.candidates
    .slice()
    .sort((a, b) => {
      const ra = a.latest_evaluation?.rank_position || 999999;
      const rb = b.latest_evaluation?.rank_position || 999999;
      return ra - rb || a.id - b.id;
    })
    .slice(safeOffset, safeOffset + safeLimit)
    .map((candidate) => ({
      ...candidate,
      skills: undefined
    }));
}

function getCandidateDetail(candidateId) {
  const candidate = state.candidates.find((row) => row.id === candidateId);
  if (!candidate) return null;

  const evaluations = state.evaluations
    .filter((row) => row.candidate_id === candidateId)
    .sort((a, b) => new Date(b.evaluated_at) - new Date(a.evaluated_at))
    .slice(0, 10);

  return {
    candidate,
    evaluations
  };
}

async function evaluateCandidateById(candidateId, provider = 'mock', evaluatorVersion = 'v1') {
  const candidate = state.candidates.find((row) => row.id === candidateId);
  if (!candidate) return null;

  const aiResult = await evaluateCandidate(candidate, { provider });
  const now = new Date().toISOString();
  const evaluation = {
    id: state.nextEvaluationId++,
    candidate_id: candidateId,
    evaluator_version: evaluatorVersion,
    crisis_score: aiResult.scores.crisisManagement,
    sustainability_score: aiResult.scores.sustainabilityKnowledge,
    motivation_score: aiResult.scores.teamMotivation,
    overall_score: computeOverall(
      aiResult.scores.crisisManagement,
      aiResult.scores.sustainabilityKnowledge,
      aiResult.scores.teamMotivation
    ),
    justification_json: {
      provider: aiResult.provider,
      confidence: aiResult.confidence,
      dimensions: aiResult.justification
    },
    evaluated_at: now
  };

  state.evaluations.push(evaluation);
  candidate.latest_evaluation = {
    evaluation_id: evaluation.id,
    evaluator_version: evaluation.evaluator_version,
    crisis_score: evaluation.crisis_score,
    sustainability_score: evaluation.sustainability_score,
    motivation_score: evaluation.motivation_score,
    overall_score: evaluation.overall_score,
    evaluated_at: evaluation.evaluated_at,
    rank_position: null
  };
  rankCandidates(state.candidates);

  return {
    candidate_id: candidateId,
    evaluation
  };
}

function getDashboard() {
  return {
    leaderboard: getLeaderboard(10, 'rank', 'asc'),
    heatmap: getHeatmap(10),
    candidates: getCandidates(40, 0)
  };
}

buildInitialData();

module.exports = {
  getDashboard,
  getLeaderboard,
  getHeatmap,
  getCandidates,
  getCandidateDetail,
  evaluateCandidateById
};
