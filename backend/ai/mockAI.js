function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function average(items) {
  if (!items.length) {
    return 0;
  }

  const total = items.reduce((sum, value) => sum + value, 0);
  return total / items.length;
}

function averageByCategory(skills, category) {
  const values = skills
    .filter((skill) => skill.category === category)
    .map((skill) => Number(skill.proficiency) || 0);

  return average(values);
}

function topSkillNames(skills, count = 2) {
  return [...skills]
    .sort((a, b) => (Number(b.proficiency) || 0) - (Number(a.proficiency) || 0))
    .slice(0, count)
    .map((skill) => skill.skill_name || skill.name);
}

function runMockEvaluation(candidate) {
  const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
  const yearsExperience = Number(candidate.years_experience) || 0;

  const leadership = averageByCategory(skills, 'Leadership');
  const safety = averageByCategory(skills, 'Safety');
  const sustainability = averageByCategory(skills, 'Sustainability');
  const compliance = averageByCategory(skills, 'Compliance');
  const analytics = averageByCategory(skills, 'Analytics');
  const operations = averageByCategory(skills, 'Operations');

  const crisisManagement = clamp(
    42 + yearsExperience * 1.8 + leadership * 5.4 + safety * 4.8 + operations * 2.1
  );

  const sustainabilityKnowledge = clamp(
    40 + yearsExperience * 1.4 + sustainability * 6.2 + compliance * 5.1 + analytics * 2.2
  );

  const teamMotivation = clamp(
    44 + yearsExperience * 1.5 + leadership * 6.4 + operations * 2.0
  );

  const strengths = topSkillNames(skills, 3);

  return {
    provider: 'mock',
    scores: {
      crisisManagement,
      sustainabilityKnowledge,
      teamMotivation
    },
    justification: {
      crisisManagement: `${candidate.full_name} shows practical response readiness with ${strengths[0] || 'operational'} strengths and ${yearsExperience.toFixed(1)} years of relevant experience.`,
      sustainabilityKnowledge: `Profile indicates applied sustainability capability in ${candidate.industry_focus || 'recycling operations'}, supported by compliance and process discipline.`,
      teamMotivation: `Leadership indicators show consistent coaching potential and the ability to maintain team performance under throughput pressure.`
    },
    evidence: {
      crisisManagement: strengths.slice(0, 2),
      sustainabilityKnowledge: strengths.slice(0, 2),
      teamMotivation: strengths.slice(0, 2)
    },
    confidence: 82
  };
}

module.exports = {
  runMockEvaluation
};