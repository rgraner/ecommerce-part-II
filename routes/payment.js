const express = require('express');
const router = express.Router();
const dbPayment = require('../controllers/payment');


router.get('/:userId', dbPayment.paymentConfig);
router.post('/:userId/create-payment-intent', dbPayment.createPaymentIntent);
router.post('/webhook', dbPayment.webhook);


module.exports = router;