// src/components/ProductPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
// import products from '../assets/Products';
import cleaningcloth from "../assets/green products/cleaning/cleaningcloth.png"
import EcoWheel from './EcoWheel';
import EcoBadge from './EcoBadge';
import Headergreen from './Headergreen';
import Rewards from './Rewards';
import { useEffect } from 'react';
import { useStateValue } from '../StateProvider';

const IMAGE_BASE = 'http://localhost:8080/uploads'; 



export default function ProductPage() {
    const [products, setProducts] = useState([]);
        const [error, setError] = useState(null);
        const [, dispatch] = useStateValue();
        const addToBasket = () => {
            dispatch({
              type: "ADD_TO_BASKET",
              item: {
                id: product._id,
                title: product.productName,
                image: product.productImage || src,
                price: product.price,
                rating: 4, // You can replace this with actual rating data if available
                badge_id: product.badge_id || "", // if this is in your data
                subtitle:product.category,
                originalPrice: product.price,
                discountPercent:20
              },
            });
          
            console.log("Product added to basket:", product.productName);
          };
    
        useEffect(() => {
            // define an async fetcher
            const fetchProducts = async () => {
                try {
                    const res = await fetch("http://localhost:8080/getproducts");
                    if (!res.ok) {
                        throw new Error(`Server responded ${res.status}`);
                    }
                    const data = await res.json();
                    setProducts(data);
                    console.log("products are : ", products);
                } catch (err) {
                    console.error("Failed to fetch products:", err);
                    setError(err.message);
                }
            };
    
            fetchProducts();
        }, []); // re-run whenever `third` changes
    
    const { id } = useParams();
    const product =  products.find((p) => p._id === id);
   

    if (!product) {
        return (
            <div style={{ padding: '2rem', fontSize: '1.2rem', color: '#777' }}>
                Sorry, that product doesn’t exist.
            </div>
        );
    }
   
    const filename = product.productImage?.split(/[/\\]/).pop() || "";
    const src = `${IMAGE_BASE}/${filename}`;
    return (
        <div>

            <Headergreen/>

            <div
                style={{
                    display: 'flex',
                    padding: '2rem',
                    background: '#fff',
                    alignItems: 'flex-start'
                }}
            >
                {/* LEFT: Product Image */}
                <div style={{ flex: '0 0 200px' }}>
                    <img
                        src={product.productImage || src}
                        alt={product.productName}
                        onError={e => e.currentTarget.src = src}
                        // onError={e => e.currentTarget.src = cleaningcloth}
                        style={{ width: '100%', objectFit: 'contain' }}
                    />
                </div>

                {/* CENTER: Textual Info */}
                <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column' }}>
                    {/* Title */}
                    <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#222' }}>
                        {product.productName}
                    </h1>

                    {/* Eco Rating Badge */}
                    {product.grade && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                margin: '0.75rem 0'
                            }}
                        >
                            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#2E7D32' }}>
                                Eco Rating
                            </span>
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'radial-gradient(circle at 30% 30%, #E8F5E9, #C8E6C9)',
                                    color: '#2E7D32',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    animation: 'ecoPulse 1.2s ease-in-out infinite'
                                }}
                            >
                                {product.grade}
                            </div>
                            <style>{`
              @keyframes ecoPulse {
                0%   { transform: scale(1);    box-shadow: none; }
                50%  { transform: scale(1.2);  box-shadow: 0 0 8px rgba(46,125,50,0.5); }
                100% { transform: scale(1);    box-shadow: none; }
              }
            `}</style>
                        </div>
                    )}

                    {/* Reviews */}
                    <div style={{ margin: '0.5rem 0 1rem', color: '#555', fontSize: '0.9rem' }}>
                        ★★★★☆ (4.4) &nbsp;|&nbsp; (26,759 reviews)
                    </div>

                    {/* Price & Discount */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}
                    >
                        <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>-30%</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}> {' '}  ₹{product.price}</span>
                        <span style={{ textDecoration: 'line-through', color: '#999' }}>
                            ₹{product.price - 30 * product.price / 100}
                        </span>
                    </div>

                    {/* Offers */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                            Save Extra with 3 offers
                        </h3>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#444' }}>
                            <li style={{ marginBottom: '0.3rem', fontSize: '0.95rem' }}>
                                Cashback: 5% back with Amazon Pay ICICI Bank credit card
                            </li>
                            <li style={{ marginBottom: '0.3rem', fontSize: '0.95rem' }}>
                                Bank Offer: Flat ₹50 Instant Discount on SBI Debit Card
                            </li>
                            <li style={{ fontSize: '0.95rem' }}>
                                …and <Link style={{ color: 'blue' }}>more offers</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Add to Cart */}
                    <button
                        style={{
                            backgroundColor: '#fadb14',
                            border: 'none',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            alignSelf: 'flex-start'
                        }}
                        onClick={() => addToBasket()}
                    >
                        Add to cart
                    </button>

                    {/* Rewards You Can Earn */}
                    <Rewards />
                </div>

                {/* RIGHT: Eco Wheel & Badge */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        marginLeft: '-1rem'
                    }}
                >
                    <EcoWheel grade={product.grade} />
                    <EcoBadge />
                </div>
            </div>
        </div>
        
        
    );
}
