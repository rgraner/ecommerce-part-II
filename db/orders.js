const pool = require('./pool')

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
    deleteOrder
}