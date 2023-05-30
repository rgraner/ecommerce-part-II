const express = require('express');
const router = express.Router();
const dbOrders = require('../controllers/orders');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', dbOrders.getAllOrders);
router.get('/user/:userId', authMiddleware, dbOrders.getOrdersWithProductsByUserId);
router.get('/:orderId', dbOrders.getOrderById);
router.delete('/:OrderId', dbOrders.deleteOrder);


module.exports = router;
