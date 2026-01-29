const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
