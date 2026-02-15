const fs = require('node:fs');
const path = require('node:path');
const { faker } = require('@faker-js/faker');
const {
  SKILL_LIBRARY,
  ROLE_TITLES,
  INDUSTRY_FOCUS,
  EDUCATION_LEVELS,
  SUMMARY_SNIPPETS
} = require('./skillsLibrary');

const CANDIDATE_COUNT = 40;
const EVALUATOR_VERSION = 'v1';

faker.seed(20260215);

function escapeSql(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : 'NULL';
  }

  if (value instanceof Date) {
    return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
  }

  const normalized = String(value).replace(/\\/g, '\\\\').replace(/'/g, "''");
  return `'${normalized}'`;
}

function buildInsert(tableName, columns, rows) {
  const values = rows
    .map((row) => `(${row.map((col) => escapeSql(col)).join(', ')})`)
    .join(',\n');

  return `INSERT INTO ${tableName} (${columns.join(', ')})\nVALUES\n${values};\n`;
}

function weightedEducation() {
  const roll = faker.number.int({ min: 1, max: 100 });
  if (roll <= 20) return EDUCATION_LEVELS[0];
  if (roll <= 65) return EDUCATION_LEVELS[1];
  if (roll <= 90) return EDUCATION_LEVELS[2];
  return EDUCATION_LEVELS[3];
}

function averageProficiency(skills, category) {
  const filtered = skills.filter((skill) => skill.category === category);
  if (filtered.length === 0) {
    return 2.5;
  }

  const total = filtered.reduce((acc, item) => acc + item.proficiency, 0);
  return total / filtered.length;
}

function clampScore(value) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function buildProfileSummary(role, focus, highlights) {
  return `${role} focused on ${focus}. ${highlights.join(' ')} ` +
    'Known for building practical recycling workflows and measurable team outcomes.';
}

function buildScores(yearsExperience, skills) {
  const leadership = averageProficiency(skills, 'Leadership');
  const safety = averageProficiency(skills, 'Safety');
  const compliance = averageProficiency(skills, 'Compliance');
  const sustainability = averageProficiency(skills, 'Sustainability');
  const analytics = averageProficiency(skills, 'Analytics');
  const operations = averageProficiency(skills, 'Operations');

  const crisisScore = clampScore(
    43 + yearsExperience * 1.7 + leadership * 5.2 + safety * 4.4 + operations * 2.1 + faker.number.int({ min: -6, max: 6 })
  );

  const sustainabilityScore = clampScore(
    40 + yearsExperience * 1.4 + sustainability * 6.1 + compliance * 5.0 + analytics * 2.0 + faker.number.int({ min: -6, max: 6 })
  );

  const motivationScore = clampScore(
    44 + yearsExperience * 1.5 + leadership * 6.0 + analytics * 1.3 + faker.number.int({ min: -8, max: 8 })
  );

  return {
    crisisScore,
    sustainabilityScore,
    motivationScore
  };
}

function buildJustification(candidate, selectedSkills, scores) {
  const strongest = [...selectedSkills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 2)
    .map((skill) => skill.name);

  return {
    crisis_management: `${candidate.full_name} demonstrates strong situational control through ${strongest[0]} and ${strongest[1]}, backed by ${candidate.years_experience} years of operational leadership.`,
    sustainability_knowledge: `Candidate applies policy and process knowledge to diversion goals in ${candidate.industry_focus}, with consistent execution on compliance and waste reduction practices.`,
    team_motivation: `Candidate exhibits practical coaching behavior and communication discipline, with evidence of sustaining team engagement during high-variance operating periods.`,
    strengths: strongest,
    scoring_note: `Scores generated using evaluator version ${EVALUATOR_VERSION} with weighted dimensions for crisis, sustainability, and motivation.`
  };
}

function main() {
  const skillRows = SKILL_LIBRARY.map((skill) => [skill.name, skill.category]);
  const skillIdByName = new Map(SKILL_LIBRARY.map((skill, index) => [skill.name, index + 1]));

  const candidateRows = [];
  const candidateSkillRows = [];
  const evaluationRows = [];

  for (let idx = 1; idx <= CANDIDATE_COUNT; idx += 1) {
    const fullName = faker.person.fullName();
    const email = faker.internet.email({
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ').slice(-1)[0],
      provider: 'example.com'
    }).toLowerCase();

    const yearsExperience = faker.number.int({ min: 3, max: 24 }) + faker.number.int({ min: 0, max: 9 }) / 10;
    const role = faker.helpers.arrayElement(ROLE_TITLES);
    const focus = faker.helpers.arrayElement(INDUSTRY_FOCUS);
    const selectedSkillCount = faker.number.int({ min: 5, max: 8 });

    const selectedSkills = faker.helpers
      .shuffle(SKILL_LIBRARY)
      .slice(0, selectedSkillCount)
      .map((skill) => ({
        ...skill,
        proficiency: faker.number.int({ min: 2, max: 5 })
      }));

    const highlights = faker.helpers.shuffle(SUMMARY_SNIPPETS).slice(0, 2);
    const profileSummary = buildProfileSummary(role, focus, highlights);

    const candidate = {
      full_name: fullName,
      email,
      phone: faker.phone.number('###-###-####'),
      location_city: faker.location.city(),
      location_state: faker.location.state(),
      location_country: 'USA',
      years_experience: Number(yearsExperience.toFixed(1)),
      highest_education: weightedEducation(),
      current_role: role,
      industry_focus: focus,
      profile_summary: profileSummary,
      skills_json: JSON.stringify(
        selectedSkills.map((skill) => ({ name: skill.name, category: skill.category, proficiency: skill.proficiency }))
      )
    };

    candidateRows.push([
      candidate.full_name,
      candidate.email,
      candidate.phone,
      candidate.location_city,
      candidate.location_state,
      candidate.location_country,
      candidate.years_experience,
      candidate.highest_education,
      candidate.current_role,
      candidate.industry_focus,
      candidate.profile_summary,
      candidate.skills_json
    ]);

    selectedSkills.forEach((skill) => {
      candidateSkillRows.push([
        idx,
        skillIdByName.get(skill.name),
        skill.proficiency
      ]);
    });

    const scores = buildScores(candidate.years_experience, selectedSkills);
    const justification = buildJustification(candidate, selectedSkills, scores);
    const evaluatedAt = faker.date.recent({ days: 90 });

    evaluationRows.push([
      idx,
      EVALUATOR_VERSION,
      scores.crisisScore,
      scores.sustainabilityScore,
      scores.motivationScore,
      JSON.stringify(justification),
      evaluatedAt
    ]);
  }

  const sqlSections = [
    '-- Seed data generated by backend/generators/fakerGenerator.js',
    '-- Generation date: ' + new Date().toISOString(),
    'USE recycling_manager_selection;',
    '',
    'SET FOREIGN_KEY_CHECKS = 0;',
    'TRUNCATE TABLE rankings;',
    'TRUNCATE TABLE evaluations;',
    'TRUNCATE TABLE candidate_skills;',
    'TRUNCATE TABLE skills;',
    'TRUNCATE TABLE candidates;',
    'SET FOREIGN_KEY_CHECKS = 1;',
    '',
    buildInsert('skills', ['skill_name', 'category'], skillRows),
    buildInsert(
      'candidates',
      [
        'full_name',
        'email',
        'phone',
        'location_city',
        'location_state',
        'location_country',
        'years_experience',
        'highest_education',
        'current_role',
        'industry_focus',
        'profile_summary',
        'skills_json'
      ],
      candidateRows
    ),
    buildInsert('candidate_skills', ['candidate_id', 'skill_id', 'proficiency'], candidateSkillRows),
    buildInsert(
      'evaluations',
      [
        'candidate_id',
        'evaluator_version',
        'crisis_score',
        'sustainability_score',
        'motivation_score',
        'justification_json',
        'evaluated_at'
      ],
      evaluationRows
    )
  ];

  const sqlOutput = `${sqlSections.join('\n')}\n`;
  const outputPath = path.resolve(__dirname, '../db/seed.sql');

  fs.writeFileSync(outputPath, sqlOutput, 'utf8');
  process.stdout.write(`Generated ${CANDIDATE_COUNT} candidate seed records at ${outputPath}\n`);
}

main();
