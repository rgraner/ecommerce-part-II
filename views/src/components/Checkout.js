import { useLocation } from 'react-router-dom';
import Payment from './Payment';

const Checkout = () => {
  const location = useLocation();
  const totalPrice = parseFloat(new URLSearchParams(location.search).get('totalPrice'));

  return (
    <>
    <p>Total price: £{totalPrice.toFixed(2)}</p>
      <Payment totalPrice={totalPrice} />
    </>
  );
};

export default Checkout;

