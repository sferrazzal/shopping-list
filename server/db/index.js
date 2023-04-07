const { Pool } = require('pg')
 
// The pg library automatically checks for environment variables
const pool = new Pool();
 
module.exports = {
  query: (text, params) => pool.query(text, params),
  tx: async (callback) => {
    const client = await pool.connect();
    try {
    await client.query('BEGIN');
      try {
        await callback(client);
        client.query('COMMIT');
      } catch(e) {
        console.error(e);
        client.query('ROLLBACK');
        return e;
      }
    } finally {
      client.release();
    }
  }
}