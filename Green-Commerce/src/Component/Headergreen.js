import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useStateValue } from "../StateProvider";
import logo from "../assets/logo.png";
import GreenProducts from "./GreenProducts";

const Headergreen = () => {
  // what’s typed in the input
  const [searchTerm, setSearchTerm] = useState("");
  // what we actually hand off to GreenProducts (on button-click)
  const [submittedTerm, setSubmittedTerm] = useState("");
  const [{ basket }] = useStateValue();  const userName = "Vishal";
  const accountTarget = localStorage.getItem("jwtToken")
    ? "/greendashboard"
    : "/login";

  // on search-button click → “submit” the current searchTerm
  const showRecommendation = () => {
    const term = searchTerm.trim();
    if (term) {
      setSubmittedTerm(term.toLowerCase());
    }
  };

  return (
    <div>
      {/* ─── HEADER BAR ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgb(96, 192, 103)",
          padding: "0 16px",
          height: 60,
          color: "white",
        }}
      >
        {/* Logo + home link */}
        <Link
          to="/green"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src={logo}
            alt="Eco Logo"
            style={{
              width: 170,
              objectFit: "contain",
              marginLeft: -25,
            }}
          />
        </Link>

        {/* Deliver-to */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            lineHeight: 1.2,
            alignItems: "center",
            marginLeft: 16,
          }}
        >
          <div style={{ fontSize: 12, color: "#ccc", marginBottom: 2 }}>
            Deliver to {userName}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="white"
              style={{ marginRight: 4 }}
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 \
                       0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 \
                       2.5S13.38 11.5 12 11.5z" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: "bold" }}>
              Jamshedpur 831014
            </span>
          </div>
        </div>

        {/* Search bar */}
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
            marginRight: 25,
          }}
        >
          <select
            style={{
              border: "none",
              backgroundColor: "#f3f3f3",
              padding: "0 12px",
              fontSize: 12,
              color: "#111",
              outline: "none",
              cursor: "pointer",
              width: "20%",
            }}
          >
            <option value="all">All Categories</option>
            <option value="green">Sustainable Products</option>
            {/* …other categories… */}
          </select>

          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              padding: "0 12px",
              fontSize: 14,
              outline: "none",
              color: "#111",
            }}
          />

          <button
            onClick={showRecommendation}
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
            <FiSearch size={18} color="#111" />
          </button>
        </div>

        {/* Account & Lists */}
        <Link
          to={accountTarget}
          style={{
            textDecoration: "none",
            color: "white",
            marginRight: 20,
          }}
        >
          <div style={{ fontSize: 13, cursor: "pointer" }}>
            <div>Hello, {userName}</div>
            <div style={{ fontWeight: "bold" }}>Account & Lists ▾</div>
          </div>
        </Link>

        {/* Orders */}
        <Link
          to="/orders"
          style={{ textDecoration: "none", color: "white", marginRight: 20 }}
        >
          <div style={{ fontSize: 13 }}>
            <div>Returns</div>
            <div style={{ fontWeight: "bold" }}>& Orders</div>
          </div>
        </Link>

        {/* Cart */}
        <Link
          to="/checkout"
          style={{
            textDecoration: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/images/cart_icon.png"
            alt="Cart"
            style={{ width: 40, marginRight: 4 }}
          />
          <span style={{ fontWeight: "bold" }}>
            {basket?.length ?? 0}
          </span>
        </Link>
      </div>

      {/* ─── RENDER RECOMMENDATIONS ────────────────────────────────────────────── */}
      {submittedTerm && (
        <GreenProducts description={submittedTerm} topN={5} />
      )}
    </div>
  );
};

export default Headergreen;
