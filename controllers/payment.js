const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentConfig = async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
};

const createPaymentIntent = async (req, res) => {
    const { totalPrice } = req.body;
    const roundedTotalPrice = (totalPrice).toFixed(2) * 100;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "GBP",
            amount: roundedTotalPrice,
            automatic_payment_methods: { enabled: true },
        });
      
        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        return res.status(400).send({
            error: {
              message: error.message,
            },
        });
    }
};

module.exports = {
    paymentConfig,
    createPaymentIntent
};