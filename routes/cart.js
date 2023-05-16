const express = require('express');
const router = express.Router();
const dbCart = require('../controllers/cart');


router.get('/:userId/cart', dbCart.getCartItems);
router.post('/:userId/cart', dbCart.createCartItem);
router.put('/:userId/cart/:itemId', dbCart.updateCartItem);
router.delete('/:userId/cart/:itemId', dbCart.deleteCartItem);
router.post('/checkout', dbCart.checkout);


module.exports = router;

