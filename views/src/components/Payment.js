import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
    const { userId } = useParams();
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        fetch(`/payment/${userId}`).then(async (r) => {
            const { publishableKey } = await r.json();
            console.log(publishableKey)
            setStripePromise(loadStripe(publishableKey));
        });
    }, []);

    useEffect(() => {
        fetch(`/payment/${userId}/create-payment-intent`, {
            method: "POST",
            body: JSON.stringify({}),
        }).then(async (result) => {
        const { clientSecret } = await result.json();
        console.log(clientSecret)
        setClientSecret(clientSecret);
        });
    }, []);

  return (
    <>
      <h2>Payment</h2>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;