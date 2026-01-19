import React from "react";
import "../Css/Home.css";
import Product from "./Product";
import Productbutton from "./Productbutton";
import ImageSlider from "./Imageslider";
import products from "../assets/Products";
import { positionalKeys } from "framer-motion";

export default function Home() {
  // Split into rows of 3
  const rows = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  // Common card wrapper style
  const cardStyle = {
    flex: 1,
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: "16px",
    margin: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    position:'relative'
  };

  const imgWrapper = {
    width: "160px",
    height: "160px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  };

  const imgStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  };

  const titleStyle = {
    fontSize: "1.1rem",
    fontWeight: 600,
    textAlign: "center",
    margin: "0 0 8px",
  };

  const priceStyle = {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#2d5a2d",
    margin: "0 0 12px",
  };

  const buttonStyle = {
    marginTop: "auto",       // push to bottom
    background: "#FFC107",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "background 0.2s, transform 0.2s",
  };

  const renderItem = item => {
    const { id, productName, productImage, price, rating, badge_id } = item;
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    const InnerComponent =
      badge_id === 1 ? Productbutton : Product;

    return (
      <div
        key={id}
        style={cardStyle}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div style={titleStyle}>
          {badge_id === 1 ? "BESTSELLER" : ""}
          <br />
          {productName}
        </div>

        <div style={priceStyle}>${numericPrice.toFixed(2)}</div>

        <div style={imgWrapper}>
          <img src={productImage} alt={productName} style={imgStyle} />
        </div>

        <button
          style={buttonStyle}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Add to Cart
        </button>
      </div>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="home__container">
        <ImageSlider />

        {rows.slice(0, 5).map((rowItems, idx) => (
          <div
            className="home__row"
            key={idx}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {rowItems.map(renderItem)}
          </div>
        ))}
      </div>
    </div>
  );
}
