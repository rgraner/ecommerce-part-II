const bcrypt = require('bcrypt')
const pool = require('../models/pool')


// Get all users
const getAllUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows)
    })
}

// Create a new user
// const createUser = (req, res) => {
//     const { username, email, password } = req.body;

//     pool.query(
//         'SELECT * FROM users WHERE email = $1',
//         [email],
//         async (error, results) => {
//             if (error) {
//                 throw error;
//             }
//             if (results.rows.length > 0) {
//                 return res.status(409).send('User already exists');
//             }
//             try {
//                 const hashedPassword = await bcrypt.hash(password, 10);
//                 pool.query(
//                     'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
//                     [username, email, hashedPassword],
//                     (error, results) => {
//                         if (error) {
//                             throw error;
//                         }
//                         res.status(201).send(`User added with username: ${username}`);
//                     }
//                 );
//             } catch (err) {
//                 console.log(err);
//                 res.status(500).send('Internal server error');
//             }
//         }
//     );
// };

const createUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const queryText = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
      const { rows } = await pool.query(queryText, [username, email, hashedPassword]);
      const user = rows[0];
  
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserById = (req, res) =>{
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results.rows[0]);
    });
};

const getUserByEmail = (req, res) =>{
    const email = req.query.email;

    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results.rows[0]);
    });
};

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { username, email } = req.body;
  
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (!rows.length) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const queryText = 'UPDATE users SET username = $1, email = $2, updated_at = $3 WHERE id = $4';
      const values = [username, email, new Date(), id];
  
      await pool.query(queryText, values);
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User deleted with ID: ${id}`);
    });
  };
  
  

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
}


  