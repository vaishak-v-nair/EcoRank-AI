const { AppError } = require('../utils/appError');

function createSimpleRateLimit({
  windowMs = 60_000,
  maxRequests = 30
} = {}) {
  const counters = new Map();

  return function simpleRateLimit(req, _res, next) {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const current = counters.get(key);

    if (!current || now > current.resetAt) {
      counters.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      return next(
        new AppError(
          `Rate limit exceeded. Maximum ${maxRequests} requests per ${Math.floor(windowMs / 1000)} seconds.`,
          429,
          'RATE_LIMIT_EXCEEDED'
        )
      );
    }

    current.count += 1;
    return next();
  };
}

module.exports = {
  createSimpleRateLimit
};
