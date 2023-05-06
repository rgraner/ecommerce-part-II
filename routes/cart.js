const express = require('express');
const router = express.Router();
const dbCart = require('../controllers/cart');


router.get('/', dbCart.getCartItems);
router.post('/', dbCart.createCartItem);
router.put('/:itemId', dbCart.updateCartItem);
router.delete('/:itemId', dbCart.deleteCartItem);
router.post('/checkout', dbCart.checkout);


module.exports = router;
