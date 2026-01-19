import React, { useState, useRef } from "react";
import { useStateValue } from "../StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import EcopakagingCapsule from "./EcopakagingCapsule"
import { motion, AnimatePresence } from "framer-motion";
import Cartempty from "./Cartempty";
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Navigate, useNavigate } from "react-router-dom";

// ...styles as you have it, unchanged...
const styles = {
  container: {
    // maxWidth: 1100,
    width: "90%",
    margin: "0 auto",
    padding: "40px 0 40px 0",
    minHeight: "100vh",
    background: "linear-gradient(120deg, #f8fbf9 70%, #f3f9f4 100%)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 18,
    color: "#374151",
    background: "rgba(255,255,255,0.80)",
    borderRadius: 18,
    boxShadow: "0 4px 24px #bdebdc33",
    padding: "16px 32px 16px 24px",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backdropFilter: "blur(2px)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 18 },
  checkbox: {
    width: 22,
    height: 22,
    accentColor: "#48BB78",
    borderRadius: 5,
    border: "1.5px solid #bdebdc",
    marginRight: 3,
    transition: "box-shadow 0.15s",
    boxShadow: "0 0 0 1.5px #fff, 0 1px 2px #99c3b9cc",
  },
  productsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
    flex: 1,
    minWidth: 0,
    // marginRight: 18,
   
  },
  productCard: {
    display: "flex",
    gap: 16,
    padding: "10px",
    background: "rgba(255,255,255,0.97)",
    borderRadius: 18,
    boxShadow: "0 4px 24px #bdebdc29, 0 1.5px 6px #d6f5e9a0",
    alignItems: "flex-start",
    // minWidth: 0,
    position: "relative",
    transition: "box-shadow 0.19s, transform 0.13s",
    cursor: "pointer",
    border: "1.5px solid #f2f5f5",
  },
  productCardHover: {
    boxShadow: "0 8px 28px #8be4b130, 0 3px 18px #bdebdc40",
    transform: "translateY(-3px) scale(1.008)",
    borderColor: "#bdebdc",
  },
  sidebar: {
    flexBasis: "34%",
    // minWidth: 320,
    display: "flex",
    flexDirection: "column",
    gap: 26,
    // margin: 50,
    // // marginLeft:50
  },
  section: {
    padding: 26,
    background: "rgba(255,255,255,0.98)",
    borderRadius: 16,
    boxShadow: "0 4px 20px #bdebdc25, 0 1.5px 6px #e6fff1a0",
    marginBottom: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 700,
    color: "#137a4f",
    fontSize: 18,
    letterSpacing: "0.01em",
  },
  input: {
    flex: 1,
    padding: 9,
    border: "1.5px solid #e1f2e7",
    borderRadius: 6,
    outline: "none",
    fontSize: 15,
    background: "#fafdfb",
    transition: "box-shadow 0.15s",
  },
  button: {
    padding: "11px 18px",
    borderRadius: 5,
    cursor: "pointer",
    transition: "all 0.22s",
    fontWeight: 600,
    fontSize: 15,
    border: "none",
    marginLeft: 1,
    boxShadow: "0 2px 8px #e0f7ee12",
  },
  btnApply: {
    background: "#ED64A6",
    color: "#FFF",
    border: "none",
    marginLeft: 2,
  },
  btnRemove: {
    color: "#e53e3e",
    background: "transparent",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: 600,
    marginLeft: 14,
    fontSize: 17,
    letterSpacing: "0.01em",
  },
  btnWishlist: {
    color: "#1a74d4",
    background: "transparent",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 17,
    marginLeft: 10,
  },
  donationBtn: (isActive) => ({
    padding: "6px 12px",
    borderRadius: 22,
    border: "1.3px solid #D2D6DC",
    cursor: "pointer",
    background: isActive ? "#44d7a8" : "transparent",
    color: isActive ? "#FFF" : "#237a53",
    boxShadow: isActive ? "0 2px 8px #44d7a888" : "",
    fontWeight: 600,
    fontSize: 14,
    transition: "all 0.18s",
  }),
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
    color: "#374151",
    fontSize: 15,
    fontWeight: 500,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 14,
    fontWeight: 700,
    fontSize: 21,
    color: "#137a4f",
    letterSpacing: "0.03em",
  },
  actionContainer: { display: "flex", gap: 18, marginTop: 10 },
  btnYellow: {
    flex: 1,
    background: "linear-gradient(91deg, #fee96b 65%, #ffe27b 100%)",
    color: "#222d36",
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    boxShadow: "0 2px 8px #f6e05e11",
  },
  btnGreen: {
    flex: 1,
    background: "linear-gradient(91deg, #36de88 65%, #51e2a4 100%)",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    boxShadow: "0 2px 8px #44d7a811",
  },
};
function Checkout() {
  const [{ basket }, dispatch] = useStateValue();
  const [selectedItems, setSelectedItems] = useState(
    basket.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {})
  );
  const navigate = useNavigate();
  const [ecoPackaging, setEcoPackaging] = useState(false);
  const [savedAddress, setSavedAddress] = useState(""); // NEW
  const [address, setAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [donation, setDonation] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [homeNo, setHomeNo] = useState("");
  const [pincode, setPincode] = useState("");
  const [totalpayment, SettotalPayment] = useState();
  const [blinkCoupon, setBlinkCoupon] = useState(false);
  const couponInputRef = React.useRef(null);
  const [showEcoModal, setShowEcoModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [hoverCreate, setHoverCreate] = useState(false);
  const [hoverJoin, setHoverJoin] = useState(false);
  const couponSectionRef = useRef(null);
  
  const handlePlaceOrder = async () => {
    // 🌱 Confetti burst
    const defaults = {
      origin: { y: 0.6 },
      emojis: ['🌱', '💚', '🍀', '♻'],
      scalar: 1.2,
      spread: 120,
    };
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    confetti({ ...defaults, particleCount: 50, origin: { x: 0.5, y: 0.5 } });
    confetti({ ...defaults, particleCount: 40, origin: { x: 0.2, y: 0.4 } });
    confetti({ ...defaults, particleCount: 40, origin: { x: 0.8, y: 0.4 } });
    const date = new Date();
    date.setDate(date.getDate() + 14);
    const userEmail = localStorage.getItem("email");
    const orderPayload = {
      userEmail,
      items: basket.map((item) => ({
        productId: item.id,
        name: item.title || item.productName,
        description: item.description || '',
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      totalAmount: totalpayment,
      ecoPackaging,
      deliveryDate: `${date.getDate()} ${months[date.getMonth()]}`,
      address:
        'Hostel J, Nit Jamshedpur, JAMSHEDPUR, JHARKHAND, 831014, India',
    };

    try {
      await axios.post('http://localhost:8080/place-order', orderPayload);

      // ✅ Add to global order history and clear basket
      dispatch({ type: 'ADD_TO_HISTORY', items: basket });
      dispatch({ type: 'CLEAR_BASKET' });
      
      setTimeout(() => {
        navigate('/order-confirmation', {
          state: { order: orderPayload },
        });
      }, 700);
    } catch (err) {
      console.error('Order submission failed', err);
      alert('Something went wrong while placing your order.');
    }
  };

  const handleStartGroupOrder = () => {
    setShowGroupModal(true);
  };

  React.useEffect(() => {
    setSelectedItems((prev) => {
      const newSel = {};
      basket.forEach((_, idx) => {
        newSel[idx] = prev[idx] ?? true;
      });
      return newSel;
    });
  }, [basket]);
  

// Now: Early return for empty cart
 

  // Calculate discount and coupon discount
  const totalMRP = basket.reduce((sum, i) => sum + Number(i.price || 0), 0);
  // If your items have individual discountPercent, update this line
  const totalDiscount = basket.reduce(
    (sum, item) =>
      sum +
      ((Number(item.price) || 0) *
        (10)) /
      100,
    0
  );

  const itemTotalAfterDiscount = totalMRP - totalDiscount;

  // Coupon logic: 5% off after MRP discount
  const couponDiscount = couponApplied ? Math.round(itemTotalAfterDiscount * 0.05) : 0;

  // Total payment after discounts
  React.useEffect(() => {
    SettotalPayment(itemTotalAfterDiscount - couponDiscount);
  }, [itemTotalAfterDiscount, couponDiscount, basket]);

  const itemsSelectedCount = Object.keys(selectedItems).filter(
    (idx) => selectedItems[idx]
  ).length;

  const removeSelected = () => {
    const toRemove = Object.keys(selectedItems)
      .filter((idx) => selectedItems[idx])
      .map(Number)
      .sort((a, b) => b - a);
    toRemove.forEach((idx) => {
      dispatch({ type: "REMOVE_FROM_BASKET", idx });
    });
    setSelectedItems({});
  };

  const handleSelectAll = () => {
    const all = itemsSelectedCount !== basket.length;
    const newSel = {};
    basket.forEach((_, idx) => (newSel[idx] = all));
    setSelectedItems(newSel);
  };

  // ---- COUPON HANDLER -----
  const handleApplyCoupon = () => {
    setBlinkCoupon(true);

    // After blink, apply coupon, scroll, and reset blink
    setTimeout(() => {
      setBlinkCoupon(false);
      setCouponApplied(true);
      if (couponSectionRef.current) {
        couponSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      if (couponInputRef.current) {
        couponInputRef.current.focus();
      }
    }, 400); // blink time
  };

  if (basket.length === 0) {
    return <Cartempty />;
  }

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #f8fbf9 70%, #f3f9f4 100%)",
      }}
    >
      <div
        style={{
          ...styles.header,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Left Section */}
        <div style={styles.headerLeft}>
          <input
            type="checkbox"
            checked={itemsSelectedCount === basket.length && basket.length !== 0}
            onChange={handleSelectAll}
            style={styles.checkbox}
          />
          <span style={{ fontWeight: 700, fontSize: 19, letterSpacing: 1 }}>
            {itemsSelectedCount}/{basket.length} ITEMS SELECTED
          </span>
          <button onClick={removeSelected} style={styles.btnRemove}>
            REMOVE
          </button>
          <button style={styles.btnWishlist}>MOVE TO WISHLIST</button>
        </div>

        {/* Capsule Eco Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            marginLeft: 22,
          }}
        >
          {/* <button
    onClick={() => setShowEcoModal(true)}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      background: 'linear-gradient(90deg,#38b24d 65%,#4be98d 100%)',
      color: '#fff',
      fontWeight: 700,
      borderRadius: 32, // capsule effect
      border: 'none',
      padding: '11px 35px 11px 25px',
      fontSize: 16.5,
      cursor: 'pointer',
      boxShadow: '0 2px 12px #aee4b03c',
      minWidth: 0,
      transition: 'box-shadow 0.16s',
      outline: 'none',
      position: 'relative',
      minHeight: 56,
    }}
  >
    <span style={{ fontWeight: 700, fontSize: 16.7, letterSpacing: 0.02 }}>
      Enable Sustainable Packaging
    </span>
    <span style={{ color: '#d0f3e0', fontWeight: 400, fontSize: 13, marginTop: 1 }}>
      Recyclable, minimal, or biodegradable&nbsp;materials
    </span>
    <span style={{ color: '#eafff6', fontSize: 12, fontWeight: 400, marginTop: 2 }}>
      (~2.8 kg CO<sub style={{ fontSize: 10 }}>2</sub> saved)
    </span>
  </button> */}
          <EcopakagingCapsule onClick={() => setShowEcoModal(true)}



          />
        </div>

      </div>
      <div style={styles.container}>
        {/* Selection Header */}
      


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            gap: 30,
            flexWrap: "wrap",
            minHeight: 400,
            alignItems: "flex-start",
            marginTop: 15,
          }}
        >
          {/* Products List */}
          <div style={styles.productsContainer}>
            <AnimatePresence>
              {basket.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{
                    opacity: 1,
                    scale: hoveredIdx === idx ? 1.018 : 1,
                    y: 0,
                    boxShadow:
                      hoveredIdx === idx
                        ? styles.productCardHover.boxShadow
                        : styles.productCard.boxShadow,
                    borderColor:
                      hoveredIdx === idx
                        ? styles.productCardHover.borderColor
                        : styles.productCard.borderColor,
                  }}
                  exit={{ opacity: 0, scale: 0.97, y: 30 }}
                  transition={{ duration: 0.28, type: "spring", stiffness: 180 }}
                  style={{
                    ...styles.productCard,
                    ...(hoveredIdx === idx ? styles.productCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                >
                  <input
                    type="checkbox"
                    checked={!!selectedItems[idx]}
                    onChange={() =>
                      setSelectedItems((prev) => ({
                        ...prev,
                        [idx]: !prev[idx],
                      }))
                    }
                    style={styles.checkbox}
                  />
                  <CheckoutProduct
                    {...item}
                    onRemove={() => {
                      dispatch({
                        type: "REMOVE_FROM_BASKET",
                        id: item.id,
                      });
                      setSelectedItems((prev) => {
                        const updated = { ...prev };
                        delete updated[idx];
                        return updated;
                      });
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Coupons */}
            <motion.div
              ref={couponSectionRef}
              style={styles.section}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h3 style={styles.sectionTitle}>COUPONS</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  ref={couponInputRef}
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Apply Coupons"
                  style={{
                    ...styles.input,
                    boxShadow: blinkCoupon
                      ? "0 0 0 3px #ff60a6"
                      : styles.input.boxShadow,
                    border:
                      blinkCoupon && !couponApplied
                        ? "2px solid #ED64A6"
                        : styles.input.border,
                    transition: "box-shadow 0.2s, border 0.2s",
                  }}
                  disabled={couponApplied}
                />
                <button
                  style={{
                    ...styles.button,
                    ...styles.btnApply,
                    background: couponApplied ? "#44d7a8" : "#ED64A6",
                  }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                >
                  {couponApplied ? "Coupon Applied" : "APPLY"}
                </button>
              </div>
            </motion.div>

            {/* Donation */}
            <motion.div
              style={styles.section}
              initial={{ opacity: 0, x: 45 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.23 }}
            >
              <h3 style={styles.sectionTitle}>
                SUPPORT TRANSFORMATIVE SOCIAL WORK IN INDIA
              </h3>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" style={styles.checkbox} /> Donate and make a difference
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {[10, 20, 50, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => setDonation(val)}
                    style={styles.donationBtn(donation === val)}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Address & Price Details */}
            <motion.div
              style={styles.section}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.31 }}
            >
              <h3 style={styles.sectionTitle}>Delivery Address</h3>
              {savedAddress ? (
                <p>{savedAddress}</p>
              ) : (
                <button
                  onClick={() => setShowAddressModal(true)}
                  style={{
                    ...styles.button,
                    color: "#48BB78",
                    background: "transparent",
                    border: "none",
                    textDecoration: "underline",
                    fontWeight: 700,
                  }}
                >
                  Enter Address
                </button>
              )}

              <h3 style={{ ...styles.sectionTitle, marginTop: 16 }}>
                PRICE DETAILS ({basket.length} Items)
              </h3>
              <div>
                <div style={styles.summaryRow}>
                  <span>Total MRP</span>
                  <span>₹{totalMRP}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Discount on MRP</span>
                  <span style={{ color: "#48BB78" }}>
                    -₹{totalDiscount}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Coupon Discount</span>
                  <span style={{ color: "#ff60a6", fontWeight: 600 }}>
                    {couponApplied
                      ? `-₹${couponDiscount} (5% Off)`
                      : (
                        <span
                          style={{
                            color: "#888",
                            cursor: "pointer",
                            textDecoration: "underline"
                          }}
                          onClick={() => {
                            couponInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                            setBlinkCoupon(true);
                            couponInputRef.current?.focus();
                            setTimeout(() => setBlinkCoupon(false), 600);
                          }}
                        >
                          Apply Coupon
                        </span>
                      )
                    }
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Platform Fee</span>
                  <span style={{ color: "#48BB78" }}>FREE</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Total Amount</span>
                  <span>
                    ₹{(typeof totalpayment === "number" ? totalpayment : itemTotalAfterDiscount).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              style={styles.actionContainer}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 }}
            >
              <button
                style={{ ...styles.button, ...styles.btnYellow }}
                onClick={handlePlaceOrder}
              >
                Place Standard Order
              </button>
              <button
                style={{ ...styles.button, ...styles.btnGreen }}
                onClick={handleStartGroupOrder}
              >
                Start Group Order
              </button>
            </motion.div>

            {/* Group Order Modal */}
            {showGroupModal && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.18)",
                  zIndex: 10000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // clicking outside closes
                }}
                onClick={() => setShowGroupModal(false)}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 8px 38px #9de4b5aa",
                    padding: 32,
                    width: "90%",
                    maxWidth: 360,
                    textAlign: "center",
                    position: "relative",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 style={{ marginBottom: 12 }}>Start Group Order</h2>
                  <p style={{ marginBottom: 20 }}>
                    Choose how you'd like to participate:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* inside your modal JSX */}
                    <button
                      onMouseEnter={() => setHoverCreate(true)}
                      onMouseLeave={() => setHoverCreate(false)}
                      onClick={() => {
                        setShowGroupModal(false);
                        navigate("/group-order-setup", { state: { items: basket } });
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: "pointer",
                        background: hoverCreate
                          ? "yellow"
                          : "#fff",
                        transform: hoverCreate ? "translateY(-2px)" : "translateY(0)",
                        transition: "background 0.2s, transform 0.2s",
                      }}
                    >
                      🛠 Create a Group Order
                    </button>

                    <button
                      onMouseEnter={() => setHoverJoin(true)}
                      onMouseLeave={() => setHoverJoin(false)}
                      onClick={() => {
                        setShowGroupModal(false);
                        navigate("/nearby-groups");
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: "pointer",
                        background: hoverJoin
                          ? 'green'
                          : "#fff",
                        transform: hoverJoin ? "translateY(-2px)" : "translateY(0)",
                        transition: "background 0.2s, transform 0.2s",
                      }}
                    >
                      📍 Join Nearby Groups
                    </button>

                  </div>

                  <button
                    onClick={() => setShowGroupModal(false)}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "transparent",
                      border: "none",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>

        {/* Address Modal */}
        {showAddressModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.19)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 200,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.26 }}
              style={{
                background: "#FFF",
                borderRadius: 16,
                padding: 28,
                width: "100%",
                maxWidth: 420,
                boxShadow: "0 10px 40px #3ad7a422",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 8,
                  letterSpacing: 1,
                  color: "#137a4f",
                }}
              >
                Set Delivery Address
              </h2>
              <input
                type="text"
                value={homeNo}
                onChange={e => setHomeNo(e.target.value)}
                placeholder="Flat / House / Building No."
                style={{
                  width: "100%",
                  padding: 9,
                  border: "1.7px solid #e1f2e7",
                  borderRadius: 8,
                  outline: "none",
                  fontSize: 16,
                  background: "#fafdfb",
                  marginBottom: 8,
                }}
              />
              <input
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="Pincode"
                style={{
                  width: "100%",
                  padding: 9,
                  border: "1.7px solid #e1f2e7",
                  borderRadius: 8,
                  outline: "none",
                  fontSize: 16,
                  background: "#fafdfb",
                  marginBottom: 8,
                }}
              />
              <textarea
                rows={4}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Street, Area, Landmark, City"
                style={{
                  width: "100%",
                  padding: 9,
                  border: "1.7px solid #e1f2e7",
                  borderRadius: 8,
                  outline: "none",
                  fontSize: 16,
                  background: "#fafdfb",
                  resize: "vertical",
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 15,
                  marginTop: 6,
                }}
              >
                <button
                  onClick={() => setShowAddressModal(false)}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 5,
                    background: "#e4f8f1",
                    border: "none",
                    fontWeight: 600,
                    color: "#377",
                    fontSize: 15,
                    marginRight: 5,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const parts = [homeNo, pincode, address].filter(Boolean);
                    setSavedAddress(parts.join(", "));
                    setShowAddressModal(false);
                  }}
                  style={{
                    padding: "9px 15px",
                    borderRadius: 5,
                    background: "#44d7a8",
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: 0.5,
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {showEcoModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.18)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setShowEcoModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 8px 38px #9de4b5aa",
                padding: 38,
                minWidth: 310,
                maxWidth: "90%",
                textAlign: "center",
                position: "relative",
              }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src="https://png.pngtree.com/png-vector/20250115/ourmid/pngtree-an-eco-friendly-green-badge-with-a-leaf-symbolizing-environmental-care-png-image_15194446.png"
                alt="Eco Badge"
                style={{ width: 92, marginBottom: 16, borderRadius: 14 }}
              />
              <h3 style={{ color: '#189755', marginBottom: 6, fontSize: 24, fontWeight: 800 }}>
                🎉 You’ve earned a badge!
              </h3>
              <p style={{ fontWeight: 700, fontSize: 19, color: '#2ab473', marginBottom: 11 }}>
                Eco-Friendly Shopper 🏆
              </p>
              <button
                style={{
                  marginTop: 10,
                  background: "#38b24d",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 7,
                  border: "none",
                  padding: "10px 30px",
                  fontSize: 17,
                  cursor: "pointer",
                }}
                onClick={() => setShowEcoModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Checkout;