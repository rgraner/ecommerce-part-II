const express = require('express');
const router = express.Router();
const dbCheckout = require('../controllers/checkout');


router.post('/:userId/checkout', dbCheckout.checkout);


module.exports = router;

