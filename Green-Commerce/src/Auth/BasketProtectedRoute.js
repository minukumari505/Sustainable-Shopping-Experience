import React from "react";
import { Navigate } from "react-router-dom";
import { useStateValue } from "../StateProvider";

const BasketProtectedRoute = ({ children }) => {
  const [{ basket }] = useStateValue();

  return basket.length > 0 ? children : <Navigate to="/green" />;
};

export default BasketProtectedRoute;