import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment({ totalPrice }) {
    const { userId } = useParams();
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
      fetch(`/api/payment/${userId}`).then(async (r) => {
        const { publishableKey } = await r.json();
        console.log(publishableKey);
        setStripePromise(loadStripe(publishableKey));
      });
    }, [userId]);

    useEffect(() => {
      if (totalPrice !== 0) {
        fetch(`/api/payment/${userId}/create-payment-intent`, {
          method: "POST",
          body: JSON.stringify({ totalPrice }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (result) => {
          const { clientSecret } = await result.json();
          console.log(clientSecret);
          setClientSecret(clientSecret);
        });
      }    
    }, [userId, totalPrice]);

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