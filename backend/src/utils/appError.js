class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }
}

function asAppError(error) {
  if (error instanceof AppError) {
    return error;
  }

  const dbUnavailableCodes = new Set([
    'ECONNREFUSED',
    'PROTOCOL_CONNECTION_LOST',
    'ER_ACCESS_DENIED_ERROR',
    'ETIMEDOUT'
  ]);

  if (dbUnavailableCodes.has(error?.code)) {
    return new AppError(
      'Database is unavailable. Verify MySQL is running and backend DB config is correct.',
      503,
      'DATABASE_UNAVAILABLE'
    );
  }

  return new AppError(error?.message || 'Unexpected server error');
}

module.exports = {
  AppError,
  asAppError
};
