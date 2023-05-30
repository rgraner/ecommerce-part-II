import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

function Orders() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/orders/user/${userId}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const orders = await response.json();
        setOrders(orders);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders();
  }, [userId]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <div>
      <h2>Orders</h2>
        {orders.map(order => (
          <div key={`${order.id}-${order.price}`}>
            <p>Order ID: {order.id}</p>
            <p>Product Name: {order.name}</p>
            <p>Product Price: £{order.price}</p>
            <img src={order.image} alt="Product" />
            <p>Total Price: £{order.total_price}</p>
            <p>Order placed at: {formatDate(order.created_at)}</p>
            <hr/>
          </div>
        ))}
    </div>
  );
}

export default Orders;