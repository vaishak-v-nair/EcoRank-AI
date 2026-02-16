const fs = require('node:fs/promises');
const path = require('node:path');
const { runMockEvaluation } = require('./mockAI');

const PROMPT_FILES = {
  crisis: path.resolve(__dirname, 'prompts/crisisPrompt.md'),
  sustainability: path.resolve(__dirname, 'prompts/sustainabilityPrompt.md'),
  motivation: path.resolve(__dirname, 'prompts/motivationPrompt.md')
};

const SCORE_WEIGHTS = {
  crisisManagement: 0.4,
  sustainabilityKnowledge: 0.35,
  teamMotivation: 0.25
};

function clampScore(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(parsed)));
}

function calculateOverallScore(scores) {
  const total =
    scores.crisisManagement * SCORE_WEIGHTS.crisisManagement +
    scores.sustainabilityKnowledge * SCORE_WEIGHTS.sustainabilityKnowledge +
    scores.teamMotivation * SCORE_WEIGHTS.teamMotivation;

  return Number(total.toFixed(2));
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function normalizeModelResponse(payload, provider, model) {
  const scores = {
    crisisManagement: clampScore(payload?.scores?.crisisManagement),
    sustainabilityKnowledge: clampScore(payload?.scores?.sustainabilityKnowledge),
    teamMotivation: clampScore(payload?.scores?.teamMotivation)
  };

  return {
    provider,
    model,
    scores,
    overallScore: calculateOverallScore(scores),
    justification: {
      crisisManagement: String(payload?.justification?.crisisManagement || 'No justification provided.'),
      sustainabilityKnowledge: String(payload?.justification?.sustainabilityKnowledge || 'No justification provided.'),
      teamMotivation: String(payload?.justification?.teamMotivation || 'No justification provided.')
    },
    evidence: payload?.evidence || {
      crisisManagement: [],
      sustainabilityKnowledge: [],
      teamMotivation: []
    },
    confidence: clampScore(payload?.confidence ?? 0)
  };
}

async function loadPromptBundle() {
  const [crisis, sustainability, motivation] = await Promise.all([
    fs.readFile(PROMPT_FILES.crisis, 'utf8'),
    fs.readFile(PROMPT_FILES.sustainability, 'utf8'),
    fs.readFile(PROMPT_FILES.motivation, 'utf8')
  ]);

  return {
    crisis,
    sustainability,
    motivation
  };
}

function joinUrl(baseUrl, pathName) {
  return `${String(baseUrl || '').replace(/\/+$/, '')}${pathName}`;
}

function resolveProviderConfig(provider) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY or OPENROUTER_API_KEY is not set');
  }

  if (provider === 'openrouter') {
    return {
      provider,
      apiKey,
      baseUrl: process.env.OPENROUTER_BASE_URL || process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
      model: process.env.OPENAI_MODEL || 'openai/gpt-4o-mini',
      extraHeaders: {
        ...(process.env.OPENROUTER_SITE_URL ? { 'HTTP-Referer': process.env.OPENROUTER_SITE_URL } : {}),
        'X-Title': process.env.OPENROUTER_APP_NAME || 'recycling-manager-selection'
      }
    };
  }

  return {
    provider: 'openai',
    apiKey,
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    extraHeaders: {}
  };
}

async function callOpenAICompatible(candidate, promptBundle, requestedProvider) {
  const config = resolveProviderConfig(requestedProvider);
  const prompt = [
    'You are evaluating a recycling operations manager candidate. Return JSON only.',
    'Use these three prompts as rubric context:',
    '--- CRISIS ---',
    promptBundle.crisis,
    '--- SUSTAINABILITY ---',
    promptBundle.sustainability,
    '--- MOTIVATION ---',
    promptBundle.motivation,
    'Output format:',
    JSON.stringify({
      scores: {
        crisisManagement: 0,
        sustainabilityKnowledge: 0,
        teamMotivation: 0
      },
      justification: {
        crisisManagement: 'string',
        sustainabilityKnowledge: 'string',
        teamMotivation: 'string'
      },
      evidence: {
        crisisManagement: ['string'],
        sustainabilityKnowledge: ['string'],
        teamMotivation: ['string']
      },
      confidence: 0
    })
  ].join('\n');

  const response = await fetch(joinUrl(config.baseUrl, '/chat/completions'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
      ...config.extraHeaders
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: JSON.stringify(candidate)
        }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`${config.provider} request failed (${response.status}): ${details}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const parsed = safeJsonParse(content || '');

  if (!parsed) {
    throw new Error('Unable to parse model output as JSON');
  }

  return normalizeModelResponse(parsed, config.provider, config.model);
}

async function evaluateCandidate(candidate, options = {}) {
  const requestedProvider = options.provider || process.env.AI_PROVIDER || 'mock';
  const promptBundle = await loadPromptBundle();

  if (requestedProvider === 'openai' || requestedProvider === 'openrouter') {
    try {
      return await callOpenAICompatible(candidate, promptBundle, requestedProvider);
    } catch (error) {
      const fallback = runMockEvaluation(candidate);
      return normalizeModelResponse(
        {
          ...fallback,
          justification: {
            ...fallback.justification,
            crisisManagement: `${fallback.justification.crisisManagement} (Fallback used: ${error.message})`
          }
        },
        'mock-fallback',
        'deterministic-v1'
      );
    }
  }

  const mockResult = runMockEvaluation(candidate);
  return normalizeModelResponse(mockResult, 'mock', 'deterministic-v1');
}

module.exports = {
  evaluateCandidate,
  calculateOverallScore
};
