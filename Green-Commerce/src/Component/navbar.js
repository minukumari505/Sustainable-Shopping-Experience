import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AmazonNavigationBar() {
  const [showPopover, setShowPopover] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
 
  // Close the popover forever
  const closePopover = () => {
    setDontShowAgain(true);
    setShowPopover(false);
  };

  // Show/hide popover on scroll, but never if dontShowAgain is true
  useEffect(() => {
    const item = document.getElementById('itemToTrack');
    if (!item) return;

    const handleScroll = () => {
      // 1) Don’t ever re-show if they clicked “Got It”
      if (dontShowAgain) return;

      // 2) Otherwise do your normal in-view check
      const rect = item.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 70;
      setShowPopover(isVisible);
    };

    window.addEventListener('scroll', handleScroll);

    // init once on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dontShowAgain]);   // ← re-run and re-attach listener when dontShowAgain changes

  // Inline styles...
  const navBar = {
    backgroundColor: '#252f3e',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    zIndex: 1000,
  };
  const list = {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
  };
  const item = {
    margin: '0 12px',
    fontSize: 14,
    color: '#fff',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  };
  const popoverWrapper = {
    position: 'relative',
    marginLeft: 'auto',    // push this item to the far right
  };
  const greenBtn = {
    backgroundColor: '#279843',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 20,
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: '16px',
    display: 'inline-block',
  };
  const popover = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#fff',
    color: '#000',
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: 8,
    width: 180,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  };
  const triangle = {
    position: 'absolute',
    top: -6,
    right: 12,
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '6px solid #fff',
  };
  const gotIt = {
    background: '#febd69',
    border: 'none',
    padding: '4px 8px',
    fontSize: 12,
    cursor: 'pointer',   // ← here’s the fix
    borderRadius: 3,
  };
  const labels = [
    'Fresh', 'Amazon Pay', 'MX Player', 'Sell',
    'Bestsellers', 'Keep Shopping for', 'Buy Again', "Today's Deals"
  ];
  
  return (
    <nav style={navBar}>
      <ul style={list}>
        {/* All + hamburger */}
        <li style={item}>
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#fff', marginRight: 4 }}>
            <rect y="4" width="24" height="2" />
            <rect y="11" width="24" height="2" />
            <rect y="18" width="24" height="2" />
          </svg>
          All
        </li>

        {labels.map(l => (
          <li key={l} style={item}>{l}</li>
        ))}

        {/* Prime + chevron */}
        <li style={item}>
          Prime
          <svg viewBox="0 0 20 20" style={{ width: 10, height: 10, fill: '#fff', marginLeft: 4 }}>
            <path d="M5 8l5 5 5-5z" />
          </svg>
        </li>

        {/* Other items */}
        <li style={item}>Customer Service</li>
        <li style={item}>Mobiles</li>
        <li style={item}>New Releases</li>

        {/* Greenovation Zone + popover */}
        <li style={popoverWrapper}>
          <Link to="/green" id="itemToTrack" style={greenBtn}>
            Green store
          </Link>
          {/* {showPopover && !dontShowAgain && (
            <div style={popover}>
              <div style={triangle} />
              <p style={{ margin: '0 0 8px', fontSize: 12, lineHeight: 1.3 }}>
                Introducing our brand new section<br />
                Green store
              </p>
              <button onClick={closePopover} style={gotIt}>
                Got It
              </button>
            </div>
          )} */}
        </li>
      </ul>
    </nav>
  );
}
