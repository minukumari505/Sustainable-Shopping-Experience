import { useLocation } from 'react-router-dom';
import OrderConfirmation from './OrderConfirmation';

const OrderConfirmationWrapper = () => {
  const { state } = useLocation();
  return <OrderConfirmation order={state?.order} />;
};
export default OrderConfirmationWrapper;