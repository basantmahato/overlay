const { Pool } = require('pg');

async function run() {
  const url = 'postgresql://postgres:root@localhost:5432/postgres';
  const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 2000 });
  try {
    const res = await pool.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log('Databases:', res.rows.map(r => r.datname));
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
  } finally {
    await pool.end();
  }
}

run();
