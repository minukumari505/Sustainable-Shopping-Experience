import React from 'react';
import OrderPage from './OrderPage';
import { useStateValue } from '../StateProvider';

export default function OrderPageWrapper() {
  const [{ basket }] = useStateValue();
  return <OrderPage cartItems={basket} />;
}