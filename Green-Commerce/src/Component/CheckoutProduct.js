import React from "react";
const IMAGE_BASE = 'http://localhost:8080/uploads';

export default function CheckoutProduct({
  id,
  image,
  title,
  price,
  rating,
  badge_id,
  brand = "SpotIt!!",
  subtitle = "Travel",
  size = "medium",
  qty = 1,
  stock = 5,
  originalPrice,
  discountPercent,
  returnWindow = "14 days",
  onRemove,
}) {
  // Correct discount logic
  let calcDiscount = null;
  if (originalPrice && price) {
    calcDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const filename = image?.split(/[/\\]/).pop() || "";
  const src = `${IMAGE_BASE}/${filename}`;

  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        padding: "22px 16px 20px 10px",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #0001",
        alignItems: "flex-start",
        margin:10,
        minWidth: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 110,
          // minWidth: 110,
          // height: 116,
          borderRadius: 9,
          background: "#f5f5f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "1.5px solid #eee",
        }}
      >
        <img
          src={image || src}
          alt={title}
          onError={e => e.currentTarget.src = src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: "#222",
              fontSize: 15,
              letterSpacing: "0.04em",
              marginBottom: 2,
            }}
          >
            {brand}
          </span>
          <button
            onClick={onRemove}
            title="Remove"
            style={{
              background: "none",
              border: "none",
              color: "#666",
              fontSize: 25,
              cursor: "pointer",
              marginRight: 2,
              transition: "color 0.2s",
            }}
          >
            ×
          </button>
        </div>

        {/* Title and subtitle */}
        <div
          style={{
            fontSize: 16,
            color: "#25272a",
            margin: "2px 0 0 0",
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={title}
        >
          {title}
        </div>
        <div
          style={{
            color: "#9e9e9e",
            fontSize: 13,
            marginBottom: 4,
            marginTop: 1,
            maxWidth: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subtitle}
        </div>

        {/* Size, Qty, Stock row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 14,
            margin: "8px 0",
          }}
        >
          <div>
            <label style={{ marginRight: 4, fontWeight: 500, color: "#444" }}>
              Size:
            </label>
            <select
              defaultValue={size}
              style={{
                padding: "2px 8px",
                border: "1px solid #ddd",
                borderRadius: 5,
                fontSize: 14,
              }}
              disabled
            >
              <option value={size}>{size}</option>
            </select>
          </div>
          <div>
            <label style={{ marginRight: 4, fontWeight: 500, color: "#444" }}>
              Qty:
            </label>
            <select
              defaultValue={qty}
              style={{
                padding: "2px 8px",
                border: "1px solid #ddd",
                borderRadius: 5,
                fontSize: 14,
              }}
              disabled
            >
              <option value={qty}>{qty}</option>
            </select>
          </div>
          <span
            style={{
              color: "#fc6236",
              background: "#fff5ee",
              border: "1px solid #faad98",
              borderRadius: 4,
              fontSize: 12,
              padding: "2px 7px",
              marginLeft: 6,
            }}
          >
            {stock} left
          </span>
        </div>

        {/* Price row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 3,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: "bold", color: "#222", letterSpacing: "0.04em" }}>
            ₹{price}
          </span>
          {originalPrice && (
            <span style={{ color: "#9e9e9e", textDecoration: "line-through", fontSize: 15 }}>
              ₹{originalPrice}
            </span>
          )}
          {calcDiscount && (
            <span style={{ color: "#fc6236", fontWeight: 600, fontSize: 15 }}>
              {calcDiscount}% OFF
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 8,
          }}
        >
          <span style={{ color: "#222", fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}>
            <b>{returnWindow}</b> return available
          </span>
          <div style={{ fontSize: 16, color: "#ffd600", marginTop: 2, marginLeft: 3, letterSpacing: "1.5px" }}>
            {Array(Number(rating))
              .fill()
              .map((_, i) => (
                <span key={i}>⭐</span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
