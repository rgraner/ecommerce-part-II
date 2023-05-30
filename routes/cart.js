const express = require('express');
const router = express.Router();
const dbCart = require('../controllers/cart');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/:userId/cart', authMiddleware, dbCart.getCartItems);
router.post('/:userId/cart', authMiddleware, dbCart.createCartItem);
router.put('/:userId/cart/:itemId', authMiddleware, dbCart.updateCartItem);
router.delete('/:userId/cart/:itemId', authMiddleware, dbCart.deleteCartItem);


module.exports = router;

