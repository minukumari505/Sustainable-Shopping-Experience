import React from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import logo from "../assets/logo.png"
const Header = () => {
  const [{ basket }, dispatch] = useStateValue();
  
  // you’d probably pull these from context / props in a real app
  const userName = "Vishal";
  const pincode = "831014";

  // pick the right target based on presence of a token
  const accountTarget = localStorage.getItem("jwtToken")
    ? "/dashboard"
    : "/login";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#232F3E",
        padding: "0 16px",
        height: 60,
        color: "white",
        backgroundColor:"black"
      }}
    >
      {/* Logo + deliver-to */}
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img
          src={logo}
          alt="amazon.in"
          style={{
            width: 170,         // bump size up from 80
            objectFit: "contain",
            // marginRight: 12,
            marginLeft:-25
          }}
        />
      </Link>

      
       <div style={{ display: "flex", flexDirection: "column", color: "white", lineHeight: 1.2,alignItems:"center" }}>
  {/* Top line */}
  <div style={{ fontSize: 12, color: "#ccc", marginBottom: 2 }}>
    Deliver to {userName}
  </div>

  {/* Bottom line with pin + bold location */}
  <div style={{ display: "flex", alignItems: "center" }}>
    {/* Inline SVG pin icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="white"
      style={{ marginRight: 4 }}
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>
    <span style={{ fontSize: 13, fontWeight: "bold" }}>
      Jamshedpur 831014
    </span>
  </div>
</div>

    

      {/* Category selector + search */}
      <div
        style={{
          display: "flex",
          flex: 1,
          margin: "0 16px",
          height: 40,
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#fff",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          marginRight:25
        }}
      >
        {/* Category dropdown */}
        <select
          style={{
            border: "none",
            backgroundColor: "#f3f3f3",
            padding: "0 12px",
            fontSize: 12,
            color: "#111",
            outline: "none",
            cursor: "pointer",
            // appearance: "none",      // remove default arrow
            // backgroundImage:
            //   "url(\"data:image/svg+xml;charset=US-ASCII,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3e%3cpath%20fill='%23777'%20d='M2%205L0%200h4z'/%3e%3c/svg%3e\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
            width:"20%",
          
          }}
        >
          <option value="all">All Categories</option>
          <option value="green">Sustainable Products </option>
          <option value="alexa">Alexa Skills</option>
          <option value="devices">Amazon Devices</option>
          <option value="fashion">Amazon Fashion</option>
          <option value="fresh">Amazon Fresh</option>
          <option value="pharmacy">Amazon Pharmacy</option>
          <option value="appliances">Appliances</option>
          <option value="apps-games">Apps & Games</option>
          <option value="audiobooks">Audible Audiobooks</option>
          <option value="baby">Baby</option>
          <option value="beauty">Beauty</option>
          <option value="books">Books</option>
          <option value="car-motorbike">Car & Motorbike</option>
          <option value="clothing-accessories">Clothing & Accessories</option>
          <option value="collectibles">Collectibles</option>
          <option value="computers">Computers & Accessories</option>
          <option value="deals">Deals</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="garden-outdoors">Garden & Outdoors</option>
          {/* …etc */}
        </select>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search Amazon.in"
          style={{
            flex: 1,
            border: "none",
            padding: "0 12px",
            fontSize: 14,
            outline: "none",
            color: "#111",
            
          }}
        />

        {/* Search button */}
        <button
          style={{
            width: 44,
            border: "none",
            backgroundColor: "#febd69",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            viewBox="0 0 24 24"
            fill="#111"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
          </svg>
        </button>
      </div>

      {/* Language selector */}
      <div style={{ display: "flex", alignItems: "center", marginRight: 20, cursor: "pointer" }}>
        <img
          src="data:image/jpeg;base64,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"
          alt="IN"
          style={{ width: 20, marginRight: 5 }}
        />
        <span style={{ fontSize: 12 }}>EN</span>
      </div>

      {/* Account & Lists */}
      <Link
        to={accountTarget}
        style={{ textDecoration: "none", color: "white", marginRight: 20 }}
      >
        <div style={{ fontSize: 13, cursor: "pointer" }}>
          <div>Hello, {userName}</div>
          <div style={{ fontWeight: "bold" }}>Account & Lists ▾</div>
        </div>
      </Link>

      {/* Returns & Orders */}
      <Link to="/orders" style={{ textDecoration: "none", color: "white", marginRight: 20 }}>
        <div style={{ fontSize: 13 }}>
          <div>Returns</div>
          <div style={{ fontWeight: "bold" }}>& Orders</div>
        </div>
      </Link>

      {/* Cart */}
      <Link to="/checkout" style={{ textDecoration: "none", color: "white", display: "flex", alignItems: "center" }}>
        <img
          src="/images/cart_icon.png"
          alt="Cart"
          style={{ width: 40, marginRight: 4 }}
        />
        <span style={{ fontWeight: "bold" }}>{basket?.length || 1}</span>
      </Link>
    </div>
  );
};

export default Header;
