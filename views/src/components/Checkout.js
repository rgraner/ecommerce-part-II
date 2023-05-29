import { useLocation } from 'react-router-dom';
import Payment from './Payment';

const Checkout = () => {
  const location = useLocation();
  const totalPrice = new URLSearchParams(location.search).get('totalPrice');
  console.log('totalPrice from checkout page:', totalPrice);

  return (
    <>
    <p>Total price: £{totalPrice}</p>
      <Payment totalPrice={totalPrice} />
    </>
  );
};

export default Checkout;

