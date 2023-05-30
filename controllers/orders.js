const pool = require('../models/pool')

// Get all orders
const getAllOrders = async (req, res) => {
    try {
      const orders = await pool.query('SELECT * FROM orders');
  
      res.json(orders.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


// Get order by id
const getOrderById = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId])
        if (order.rows.length === 0) {
            res.status(404).json({ message: `Order with id ${orderId} not found` });
        }
        res.json(order.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get orders with product information by user id
const getOrdersByUserId = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId])
        if (order.rows.length === 0) {
            res.status(404).json({ message: `Orders with user id ${userId} not found` });
        }
        res.json(orders.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get orders with product information by user id
const getOrdersWithProductsByUserId = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const orders = await pool.query(
        `SELECT o.id, o.user_id, o.total_price, o.created_at, o.updated_at,
                p.name, p.description, p.price, p.image
         FROM orders o
         JOIN order_products op ON o.id = op.order_id
         JOIN products p ON op.product_id = p.id
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`,
        [userId]
      );
  
      if (orders.rows.length === 0) {
        return res.status(404).json({ message: `Orders with user id ${userId} not found` });
      }
  
      res.json(orders.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
    
// Delete an order
const deleteOrder = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        if (order.rows.length === 0) {
            res.status(404).json({ message: `Order with id ${orderId} not found` });
        }

        await pool.query('DELETE FROM order_products WHERE order_id = $1', [orderId]);
        await pool.query('DELETE FROM ORDERS where id = $1', [orderId]);
        res.status(204).json() ;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

};

module.exports = {
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    getOrdersWithProductsByUserId,
    deleteOrder
}