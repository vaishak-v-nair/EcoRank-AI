const crypto = require('node:crypto');

function attachRequestId(req, res, next) {
  req.requestId = crypto.randomUUID();
  res.setHeader('x-request-id', req.requestId);
  next();
}

function requestLogger(req, _res, next) {
  const startedAt = Date.now();
  const method = req.method;
  const url = req.originalUrl;
  const requestId = req.requestId;

  req.on('close', () => {
    const durationMs = Date.now() - startedAt;
    process.stdout.write(`[${requestId}] ${method} ${url} ${durationMs}ms\n`);
  });

  next();
}

module.exports = {
  attachRequestId,
  requestLogger
};
