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
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows)
    })
}


const registerUser = (req, res) => {
    const { username, email, password } = req.body;
    pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email],
        (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rows.length > 0) {
                return res.status(409).send('User already exists');
            }
            pool.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
                [username, email, password],
                (error, results) => {
                    if (error) {
                        throw error;
                    }
                    res.status(201).send(`User added with username: ${username}`);
                }
            );
        }
    )    
};
  


module.exports = {
    getUsers,
    registerUser,
}

  