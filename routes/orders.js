const express = require('express');
const router = express.Router();
const dbOrders = require('../controllers/orders');


router.get('/', dbOrders.getAllOrders);
router.get('/:orderId', dbOrders.getOrderById);
router.delete('/:OrderId', dbOrders.deleteOrder);


module.exports = router;
