import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderedProduct from '../Component/orderedProduct';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get(`http://localhost:8080/my-orders?email=${email}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    }
    fetchOrders();
  }, [email]);

  // Inline style objects
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#ffffff',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: '24px',
  };

  const titleStyle = {
    margin: 0,
    fontSize: '24px',
    fontWeight: 700,
    color: '#26323a',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
  };

  const buttonStyle = {
    background: '#61c13d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
  };

  const buttonHoverStyle = {
    background: '#53ae34',
  };

  return (
    <div className="checkout__left">
      {/* Inline-styled header/navbar */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>Your Orders</h2>
        <div style={actionsStyle}>
          <button
            style={buttonStyle}
            onMouseOver={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={e => Object.assign(e.currentTarget.style, { background: buttonStyle.background })}
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
          {/* <button
            style={buttonStyle}
            onMouseOver={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseOut={e => Object.assign(e.currentTarget.style, { background: buttonStyle.background })}
            onClick={() => alert('Filter coming soon!')}
          >
            Filter
          </button> */}
        </div>
      </div>

      {/* Existing orders list */}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders
          .slice().reverse()
          .flatMap((order) =>
            order.items.map((item, idx) => (
              <OrderedProduct
                key={`${order._id}-${idx}`}
                id={item.productId}
                price={item.price}
                rating={item.rating || 4}
                image={item.image}
                title={item.title}
                badge_id={item.badge_id || 0}
                totalAmount={order.totalAmount}
                quantity={item.quantity}
                deliveryDate={order.deliveryDate}
              />
            ))
          )
      )}
    </div>
  );
}
