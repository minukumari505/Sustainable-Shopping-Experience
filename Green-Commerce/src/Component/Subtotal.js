// src/Component/Subtotal.js
import React from "react";
import "../Css/Subtotal.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "../StateProvider";
import { getBasketTotal } from "./reducer";
import { Link } from "react-router-dom";

const Subtotal = () => {
  const [{ basket }] = useStateValue();

  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({basket?.length} items): <strong>{value}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" className="checkbox" /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType="text"
        thousandSeparator={true}
        prefix={"₹"}
      />
      {basket.length > 0 ? (
        <Link style={{ textDecoration: "none" }} to="/delivery">
          <button className="proceed">
            Proceed to Buy
          </button>
        </Link>
      ) : (
        <button className="proceed" disabled>
          Proceed to Buy
        </button>
      )}
    </div>
  );
};

export default Subtotal;