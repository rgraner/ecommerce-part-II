require('dotenv').config();

const PASSWORD = process.env.DB_PASSWORD;
const USER = process.env.DB_USER;
const DATABASE = process.env.DB_DATABASE;
const PORT = process.env.DB_PORT;

const Pool = require('pg').Pool;
const pool = new Pool({
  user: USER,
  host: 'localhost',
  database: DATABASE,
  password: PASSWORD,
  port: PORT,
});

module.exports = pool;
