const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentConfig = async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
};

const createPaymentIntent = async (req, res) => {
    const { totalPrice } = req.body;
    const { userId } = req.params;
    const roundedTotalPrice = Math.round((totalPrice).toFixed(2) * 100);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "GBP",
            amount: roundedTotalPrice,
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: userId, // Include the userId in the metadata
            },
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


const webhook = async (req, res) => {
    // Verify the Stripe webhook signature
    const event = req.body;

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!');
            const userId = paymentIntent.metadata.userId;
            console.log('userId webhook: ', userId);
            // Trigger the checkout API here
            await fetchCheckoutAPI(req.get('host'), userId);
            break;

        case 'payment_intent.failed':
            // Handle failed payment
            // ...
            break;
            // Handle other event types as needed

        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({received: true});
};

const fetchCheckoutAPI = async (baseURL, userId) => {
    console.log('baseURL: ', baseURL)
    console.log('userId fetchCheckoutAPI: ', userId)
    // Extract the necessary information from the paymentIntent object
  
    try {
      // Make the API request to trigger the checkout
      const response = await fetch(`http://${baseURL}/api/users/${userId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Include any necessary data for the checkout
        }),
      });
  
      if (response.ok) {
        // Checkout API call successful
        console.log('Checkout API call successful');
        // Perform additional actions (e.g., display order summary, clear cart, etc.)
      } else {
        // Error handling for the API call
        console.log('Checkout API call failed');
        // Handle the error accordingly
      }
    } catch (error) {
      // Error handling for network or other unexpected errors
      console.log('An error occurred during the checkout API call:', error);
      // Handle the error accordingly
    }
  };


module.exports = {
    paymentConfig,
    createPaymentIntent,
    webhook,
    fetchCheckoutAPI
};


