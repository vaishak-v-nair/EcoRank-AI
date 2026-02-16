const { AppError } = require('./appError');

const LEADERBOARD_SORT_FIELDS = new Set([
  'rank',
  'overallScore',
  'crisisScore',
  'sustainabilityScore',
  'motivationScore',
  'yearsExperience'
]);

const PROVIDERS = new Set(['mock', 'openai', 'openrouter']);

function parsePositiveInt(value, {
  fieldName,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
  defaultValue = null
} = {}) {
  if (value === undefined || value === null || value === '') {
    if (defaultValue !== null) {
      return defaultValue;
    }

    throw new AppError(`${fieldName} is required`, 400, 'VALIDATION_ERROR');
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new AppError(`${fieldName} must be an integer`, 400, 'VALIDATION_ERROR');
  }

  if (parsed < min || parsed > max) {
    throw new AppError(`${fieldName} must be between ${min} and ${max}`, 400, 'VALIDATION_ERROR');
  }

  return parsed;
}

function parseDirection(value, defaultValue = 'asc') {
  if (!value) {
    return defaultValue;
  }

  const normalized = String(value).toLowerCase();
  if (normalized !== 'asc' && normalized !== 'desc') {
    throw new AppError('direction must be either asc or desc', 400, 'VALIDATION_ERROR');
  }

  return normalized;
}

function parseSortBy(value, defaultValue = 'rank') {
  if (!value) {
    return defaultValue;
  }

  const normalized = String(value);
  if (!LEADERBOARD_SORT_FIELDS.has(normalized)) {
    throw new AppError(
      `sortBy must be one of: ${[...LEADERBOARD_SORT_FIELDS].join(', ')}`,
      400,
      'VALIDATION_ERROR'
    );
  }

  return normalized;
}

function parseProvider(value, defaultValue = 'mock') {
  if (!value) {
    return defaultValue;
  }

  const normalized = String(value).toLowerCase();
  if (!PROVIDERS.has(normalized)) {
    throw new AppError(
      `provider must be one of: ${[...PROVIDERS].join(', ')}`,
      400,
      'VALIDATION_ERROR'
    );
  }

  return normalized;
}

module.exports = {
  parsePositiveInt,
  parseDirection,
  parseSortBy,
  parseProvider
};
