const path = require('node:path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const { asAppError } = require('../src/utils/appError');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'recycling_manager_selection',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  queueLimit: 0,
  timezone: 'Z'
});

async function query(sql, params = []) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    throw asAppError(error);
  }
}

async function pingDatabase(timeoutMs = 1500) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      const timeoutError = new Error(`Database ping timed out after ${timeoutMs}ms`);
      timeoutError.code = 'ETIMEDOUT';
      reject(timeoutError);
    }, timeoutMs);
  });

  const pingPromise = (async () => {
    const connection = await pool.getConnection();
    try {
      await connection.ping();
      return { status: 'up' };
    } finally {
      connection.release();
    }
  })();

  try {
    return await Promise.race([pingPromise, timeoutPromise]);
  } catch (error) {
    return {
      status: 'down',
      error: asAppError(error).message
    };
  }
}

module.exports = {
  pool,
  query,
  pingDatabase
};
