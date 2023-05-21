const pool = require('../models/pool')
  

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


module.exports = { checkout };