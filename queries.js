// create a pool of connections
require('dotenv').config();

const PASSWORD = process.env.DB_PASSWORD;
const USER = process.env.DB_USER;
const DATABASE = process.env.DB_DATABASE;
const PORT = process.env.DB_PORT;

const Pool = require('pg').Pool
const pool = new Pool({
    user: USER,
    host: 'localhost',
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
})

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
      if (err) {
        throw err
      }
      res.status(200).json(results.rows)
    })
  }

  module.exports = {
    getUsers,
  }