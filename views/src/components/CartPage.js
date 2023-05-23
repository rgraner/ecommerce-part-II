import React from 'react';
import { useParams } from 'react-router-dom';
import Cart from './Cart';
import Payment from './Payment';

function CartPage() {
  const { userId } = useParams();

  return (
    <div>
      <Cart userId={userId} />
      <Payment />
    </div>
  );
}

export default CartPage;


