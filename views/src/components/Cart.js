import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

function Cart() {
  const { userId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);

  useEffect(() => {
    // Fetch cart items from the server
    async function fetchCartItems() {
      try {
        const response = await fetch(`/api/users/${userId}/cart`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const items = await response.json();
        setCartItems(items);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    // Calculate the total price whenever cart items change
    const calculateTotalPrice = () => {
      const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      setTotalPrice(totalPrice);
    };
    calculateTotalPrice();
  }, [cartItems]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    // Update the quantity of the cart item
    try {
      const response = await fetch(`/api/users/${userId}/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      // Update the cart items in state with the updated quantity
      const updatedItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    // Remove the cart item
    console.log('item id: ', itemId)
    try {
      const response = await fetch(`/api/users/${userId}/cart/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      // Remove the item from the cart items in state
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedItems);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleCheckout = () => {
  //   // Redirect to the checkout page
  //   navigate(`/payment/${userId}`);
  // };

  return (
    <div>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <p>Product: {item.name}</p>
                <p>Price: £{item.price}</p>
                <p>
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                  />
                </p>
                <button onClick={() => handleRemoveItem(item.id)}>
                  Remove Item
                </button>
              </li>
            ))}
          </ul>
          <p>Total Price: £{totalPrice.toFixed(2)}</p>
          {/* <button onClick={handleCheckout}>Checkout</button> */}
        </div>
      )}
    </div>
  );
}

export default Cart;