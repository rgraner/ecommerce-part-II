const express = require('express');
const router = express.Router();
const dbCart = require('../controllers/cart');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/user/:userId', authMiddleware, dbCart.getCartItems);
router.post('/user/:userId', authMiddleware, dbCart.createCartItem);
router.put('/user/:userId/item/:itemId', authMiddleware, dbCart.updateCartItem);
router.delete('/user/:userId/item/:itemId', authMiddleware, dbCart.deleteCartItem);


module.exports = router;

