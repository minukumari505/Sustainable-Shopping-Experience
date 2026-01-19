import React from 'react';
import '../Css/navbargreen.css';
import { Link } from 'react-router-dom';

const AmazonNavigationBarg = () => {
  const defaultColor = '#146eb4';
  const activeColor = '#66BB6A';

  const handleClick = e => {
    // reset all links
    document
      .querySelectorAll('.amazon-nav-list a')
      .forEach(el => el.style.color = "white");
    // highlight the one you clicked
    e.currentTarget.style.color = activeColor;
    // no preventDefault here, so the router can navigate
  };

  return (
    <div className="amazon-nav" >
      <div className="amazon-nav-section">
        <ul className="amazon-nav-list" style={{ display: 'flex', gap: '1em', listStyle: 'none', margin: 0, padding: 0 }}>

          <li>
            <Link
              to="/green"
              onClick={handleClick}
              style={{ color: "white", textDecoration: 'none' }}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/bamboo"
              onClick={handleClick}
              style={{ color: "white", textDecoration: 'none' }}
            >
              Bamboo
            </Link>
          </li>

          <li>
            <Link
              to="/home-kitchen"
              onClick={handleClick}
              style={{ color: "white", textDecoration: 'none' }}
            >
              Home & Kitchen
            </Link>
          </li>

          <li>
            <Link
              to="/gift-cards"
              onClick={handleClick}
              style={{ color: "white", textDecoration: 'none' }}
            >
              Gift cards
            </Link>
          </li>

          <li>
            <Link
              to="/seller"
              onClick={handleClick}
              style={{ color: "white", textDecoration: 'none' }}
            >
              Seller
            </Link>
          </li>

          <li>
            <Link
              to="/education"
              onClick={handleClick}
              style={{ color: "white", textDecoration: 'none' }}
            >
              Educational Section
            </Link>
          </li>

          <li>
            <Link
              to="/sustainability"
              onClick={handleClick}
              style={{ color: "white", textDecoration: 'none' }}
            >
              Sustainability Reports
            </Link>
          </li>

          <li>
            <Link
              to="/more"
              onClick={handleClick}
              style={{ color: "white", textDecoration: 'none' }}
            >
              More
            </Link>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default AmazonNavigationBarg;
