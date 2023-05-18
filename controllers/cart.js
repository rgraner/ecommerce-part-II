const pool = require('../models/pool')


const getCartItems = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Check if the user exists
        const user = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all items in the cart
        const cartItem = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1',
            [userId]
        );
        if (cartItem.rows.length === 0) {
            return res.status(404).json({ message: 'No Item in the cart' });
        }
        res.status(200).json(cartItem.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ messsage: 'Internal server error' });
    }
};
  

const createCartItem = async (req, res) => {
    const userId = req.params.userId;
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
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    const { quantity } = req.body;
    console.log('request body: ', req.body);
    console.log('itemId: ', itemId);
    console.log('quantity: ', quantity);

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
    const userId = req.params.userId;
    const productId = req.params.itemId;
    console.log('userId: ', userId);
    console.log('productId: ', productId);

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
            'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        if (cartItem.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the item from the cart
        await pool.query(
            'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        res.status(200).send(`Item deleted with ID: ${productId}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  

const checkout = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Get the user's cart items
        const cartItems = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1',
            [userId]
        );
        console.log('cartItems: ', cartItems.rows);
        
        let totalPrice = 0;
        for (const item of cartItems.rows) {
            const product = await pool.query(
                'SELECT * FROM products WHERE id = $1', 
                [item.product_id]
            );
            totalPrice += product.rows[0].price * item.quantity
        }
        
        // Create a new order
        const newOrder = await pool.query(
            'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *',
            [userId, totalPrice]
        );
        console.log('newOrder: ', newOrder.rows);
        
        // Add the cart items to the order_products
        cartItems.rows.forEach(async (cartItem) => {
            await pool.query(
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
                [newOrder.rows[0].id, cartItem.product_id, cartItem.quantity]
            );
        });
        
        // Clear the user's cart
        await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
        
        res.status(200).json({ message: 'Checkout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    getCartItems,
    createCartItem,
    updateCartItem,
    deleteCartItem,
    checkout
}