const pool = require('../models/pool')


const getAllProducts = (req, res) => {
    pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      results.rows.forEach(product => {
        if (product.image !== null) {
          product.image = product.image.toString('base64');
        }
      });
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
        const product = results.rows[0];
        if (product.image !== null) {
        product.image = product.image.toString('base64');
        }
        res.status(200).json(results.rows[0]);
    });
};
  

const createProduct = (req, res) => {
    const { name, description, price, image } = req.body;

    pool.query(
        'INSERT INTO products (name, description, price, image) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, description, price, image],
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
    const { name, description, price, image } = req.body;

    pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, image = $4, updated_at = NOW() WHERE id = $5',
        [name, description, price, image, id],
        (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`Product modified with ID: ${id}`);
        }
    )
};


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
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

  