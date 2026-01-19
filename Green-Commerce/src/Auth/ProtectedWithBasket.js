// src/Auth/ProtectedWithBasket.js
import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import BasketProtectedRoute from "./BasketProtectedRoute";

const ProtectedWithBasket = ({ children }) => {
  return (
    <ProtectedRoute>
      <BasketProtectedRoute>{children}</BasketProtectedRoute>
    </ProtectedRoute>
  );
};

export default ProtectedWithBasket;