import React, { createContext, useContext, useReducer, useEffect } from "react";

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, loadInitialState(initialState));

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(state.basket));
  }, [state.basket]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

// Load initial basket from localStorage
const loadInitialState = (initialState) => {
  const localBasket = localStorage.getItem("basket");
  return {
    ...initialState,
    basket: localBasket ? JSON.parse(localBasket) : initialState.basket
  };
};

export const useStateValue = () => useContext(StateContext);