const { Pool } = require('pg')
 
// The pg library automatically checks for environment variables that should
// be supplied in a config object here, leaving our hands clean!
const pool = new Pool();
 
module.exports = {
  query: (text, params) => pool.query(text, params),
}