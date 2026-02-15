const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { pool, pingDatabase } = require('../config/db.config');
const { attachRequestId, requestLogger } = require('./middleware/requestId');
const { asAppError } = require('./utils/appError');
const routes = require('./routes/candidateRoutes');

const app = express();
const port = Number(process.env.PORT || 4000);

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(attachRequestId);
app.use(requestLogger);

app.get('/health', async (_req, res) => {
  const db = await pingDatabase();
  const healthy = db.status === 'up';

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    service: 'recycling-manager-selection-backend',
    database: db
  });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    statusCode: 404,
    requestId: req.requestId
  });
});

app.use((err, req, res, _next) => {
  const normalizedError = asAppError(err);
  const statusCode = normalizedError.statusCode || 500;

  if (statusCode >= 500) {
    process.stderr.write(`[${req.requestId}] ${normalizedError.stack || normalizedError.message}\n`);
  }

  res.status(statusCode).json({
    error: normalizedError.message || 'Unexpected server error',
    code: normalizedError.code || 'INTERNAL_ERROR',
    details: normalizedError.details || undefined,
    statusCode,
    requestId: req.requestId
  });
});

const server = app.listen(port, () => {
  process.stdout.write(`Backend service listening on port ${port}\n`);
});

async function shutdown(signal) {
  process.stdout.write(`\nReceived ${signal}. Shutting down backend...\n`);

  server.close(async () => {
    try {
      await pool.end();
    } catch (_error) {
      // no-op, shutdown best effort
    }
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 5_000).unref();
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
