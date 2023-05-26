import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Completion() {
  const { userId } = useParams();

  useEffect(() => {
    const fetchCheckoutAPI = async () => {
      try {
        // Make an API request to your server to perform the checkout
        const response = await fetch(`/api/users/${userId}/checkout`, {
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

    fetchCheckoutAPI();
  }, [userId]);

  return <h1>Thank you!</h1>;
}

export default Completion;
