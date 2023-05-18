import React from 'react';
import { useParams } from 'react-router-dom';
import Cart from './Cart';

function CartPage() {
  const { userId } = useParams();

  return (
    <div>
      <Cart userId={userId} />
    </div>
  );
}

export default CartPage;


