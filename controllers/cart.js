const pool = require('../models/pool')


const getCartItems = async (req, res) => {
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all items in the cart with product information
        const cartItems = await pool.query(
            'SELECT c.id, c.quantity, p.name, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
        [userId]
        );
        if (cartItems.rows.length === 0) {
            return res.status(404).json({ message: 'No item in the cart' });
        }
    
        res.status(200).json(cartItems.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messsage: 'Internal server error' });
    }
};
  

const createCartItem = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        // check if the user exists
        const user = await pool.query(
            'SELECT * FROM users WHERE id = $1', 
            [userId]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists
        const product = await pool.query(
            'SELECT * FROM products WHERE id = $1', 
            [productId]
        );
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the item is already in the cart
        const cartItem = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        if (cartItem.rows.length > 0) {
            // Updating the quantity of the existing item
            const updatedCartItem = await pool.query(
                'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
                [quantity, userId, productId]
            );
            res.status(200).json(updatedCartItem.rows[0]);
        } else {
            // Add the new item to cart
            const newCartItem = await pool.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [userId, productId, quantity]
            );
            res.status(201).json(newCartItem.rows[0]);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' })
    }
};
  

const updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    try{
        // Check if the user exusts
        const user = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the cart item exists
        const cartItem = await pool.query(
            'SELECT * FROM cart  WHERE user_id = $1 AND id = $2',
            [userId, itemId]
        );
        if (cartItem.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update the quantity of the existing cart item
        const updatedCartItem = await pool.query(
            'UPDATE cart SET quantity = $1, updated_at = NOW() WHERE user_id = $2 AND id = $3 RETURNING *',
            [quantity, userId, itemId]
        );
        res.status(200).json(updatedCartItem.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error'})
    }
};

const deleteCartItem = async (req, res) => {
    const userId = req.user.id;
    const cartItemId = req.params.itemId;


    try {
        // Check if the user exists
        const user = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the item is in the cart
        const cartItem = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1 AND id = $2',
            [userId, cartItemId]
        );
        if (cartItem.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the item from the cart
        await pool.query(
            'DELETE FROM cart WHERE user_id = $1 AND id = $2',
            [userId, cartItemId]
        );
        res.status(200).send(`Item deleted with ID: ${cartItemId}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  

module.exports = {
    getCartItems,
    createCartItem,
    updateCartItem,
    deleteCartItem
};