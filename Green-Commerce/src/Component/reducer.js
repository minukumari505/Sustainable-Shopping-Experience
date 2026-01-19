import React from "react";

// ✅ Load initial basket from localStorage if available
export const initialState = {
  basket: JSON.parse(localStorage.getItem("basket")) || [],
  history: [],
};

// ✅ Selector Function to Get Total Price
export const getBasketTotal = (basket) =>
  basket?.reduce((amount, item) => item.price + amount, 0);

// ✅ Reducer Function
const Reducer = (state, action) => {
  let newState;

  switch (action.type) {
    case "ADD_TO_BASKET":
      newState = {
        ...state,
        basket: [...state.basket, action.item],
      };
      break;

    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      const newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(`Cannot remove item (id: ${action.id}) — not found.`);
      }

      newState = {
        ...state,
        basket: newBasket,
      };
      break;

    case "ADD_TO_HISTORY":
      newState = {
        ...state,
        history: [...state.history, ...action.items],
      };
      break;

    case "CLEAR_BASKET":
      newState = {
        ...state,
        basket: [],
      };
      break;

    default:
      return state;
  }

  // ✅ Persist basket to localStorage after each change
  localStorage.setItem("basket", JSON.stringify(newState.basket));
  return newState;
};

export default Reducer;