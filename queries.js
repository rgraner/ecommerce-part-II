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

const getUserByEmail = (email) => {
    return pool.query('SELECT * FROM users WHERE email = $1', [email])
    .then((res) => {
        if (res.rows.length > 0) {
            return res.rows[0];
        } else {
            return null;
        }
    })
    .catch((err) => {
        console.log(err);
        return null;
    });
};

const getUserById = (id) => {
    return pool.query('SELECT * FROM users WHERE id = $1,', [id])
    .then((res) => {
        if (res.rows.length > 0) {
            return res.rows[0];
        } else {
            return null;
        }
    })
    .catch((err) => {
        console.log(err);
        return null;
    });
};


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

// products queries
const getAllProducts = (req, res) => {
    pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
};


const getProductById = (req, res) =>{
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(results.rows[0]);
    });
};
  

const createProduct = (req, res) => {
    const { name, description, price } = req.body;

    pool.query(
   'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING id',
    [name, description, price],
    (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Product added with ID: ${results.rows[0].id}`);
    }
    );
};

const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;

    pool.query(
        'UPDATE products SET name = $1, price = $2, updated_at = NOW() WHERE id = $3',
        [name, price, id],
        (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`Product modified with ID: ${id}`);
        }
    )
};

// const deleteProduct = (req, res) => {
//     const id = parseInt(req.params.id);
  
//     pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
//         if (error) {
//             throw error
//         }
//         res.status(200).send(`Product deleted with ID: ${id}`)
//     })
// }

const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);
  
    pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).send(`Product deleted with ID: ${id}`)
    })
};

  
module.exports = {
    getUsers,
    registerUser,
    getUserByEmail,
    getUserById,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

  