
import React, { useState, useMemo,useEffect } from 'react';
import { FiSearch, FiMenu } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import '../Css/navbargreen.css';
import { Link } from 'react-router-dom';
import cleaningcloth from "../assets/green products/cleaning/cleaningcloth.png"
import Products from '../assets/Products';
import SustainabilityReportsSection from './Sustainability';
import SuggestGreenCarousel from "../Component/carosel/SuggestGreenCategory_carosel1"
import SuggestGreenBrands from './carosel/SuggestGreenBrands';
const IMAGE_BASE = 'http://localhost:8080/uploads'; 
const leftFilterDefs = [
    { key: 'plasticFree', label: 'Plastic-Free', icon: '🚫🧴' },
    { key: 'fscCertified', label: 'FSC Certified', icon: '🌲' },
    { key: 'carbonNeutral', label: 'Carbon Neutral Shipping', icon: '🚚' },
    { key: 'recycledMaterials', label: 'Recycled Materials', icon: '♻️' },
  ];

const Banner = () => (
    <div style={{
        backgroundColor: 'rgb(133, 191, 137)',
        padding: '1rem',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        animation: 'pulse 3s infinite'
    }}>
        <style>
            {`@keyframes pulse { 0% { transform: scale(1) } 50% { transform: scale(1.02) } 100% { transform: scale(1) } }`}
        </style>
        <h2 style={{ color: '#2E7D32', margin: 0 }}>Green Essentials –</h2>
        <h4 style={{ color: '#2E7D32', margin: 0 }}>Weekly Picks</h4>
    </div>
);
const filterLabels = {
    plasticFree: 'Plastic-Free',
    fscCertified: 'FSC Certified',
    carbonNeutral: 'Carbon Neutral Shipping',
    recycledMaterials: 'Recycled Materials',
};

const ProductCard = ({ p }) => {
    
    // pull the filename off of the full Windows path
    // inside ProductCard:
    const filename = p.productImage?.split(/[/\\]/).pop() || "";
    const src = `${IMAGE_BASE}/${filename}`;
    

    return (
        <div style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1rem',
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
            {p.grade && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: '#C8E6C9',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: '#2E7D32'
                }}>
                    {p.grade}
                </div>
            )}

            <img
                src={p.productImage || src}
                alt={p.productName}
                onError={e => e.currentTarget.src = src}
                style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'contain',
                    marginBottom: '1rem'
                }}
            />
            
            <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                textAlign: 'center',
                margin: '0 0 0.5rem'
            }}>
                {p.productName}
            </h4>

            {/* Dynamic filter tags */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.25rem',
                fontSize: '0.8rem',
                color: '#555',
                flexGrow: 1
            }}>
                {Object.entries(p.filters)
                    .filter(([_, isOn]) => isOn)
                    .map(([key]) => (
                        <span key={key} style={{ color: 'green' }}>
                            {filterLabels[key]}
                        </span>
                    ))
                }
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '0.5rem'
            }}>
                <span style={{ fontWeight: 'bold' }}> ₹ {p.price}</span>
                <button
                    onClick={() => console.log(`Add ${p.name} to cart`)}
                    style={{
                        backgroundColor: '#2E7D32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

  
  

export default function GreenProducts({ description, topN = 5 }) {
  
    const [products, setProducts] = useState([]);
    const [recs, setRecs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [leftFilters, setLeftFilters] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categories = useMemo(
        () => Array.from(new Set(products.map(p => p.category))),
        [products]
    );

    const toggleLeft = key =>
        setLeftFilters(prev => ({ ...prev, [key]: !prev[key] }));

    // const visible = products.filter(p =>
    //     leftFilterDefs.every(f => !leftFilters[f.key] || p.filters[f.key]) &&
    //     (!selectedCategory || p.category === selectedCategory)
    // );
    const productsMap = useMemo(
        () => Object.fromEntries(products.map(p => [p._id, p])),
        [products]
    );

  

    const dataSource =
     !description
            ? products.slice(0,6)
     : recs.map(r => productsMap[r._id]).filter(Boolean);


    
    const visible = dataSource.filter(p =>
        leftFilterDefs.every(f => !leftFilters[f.key] || p.filters[f.key]) &&
        (!selectedCategory || p.category === selectedCategory)
      );
    console.log("🌱 GreenProducts render:", {
        description,
        recs,
    });
     
    useEffect(() => {
        if (!description) return;            // nothing to do until user searches
        setLoading(true);
        fetch('http://localhost:8000/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_name: description,
                top_n: topN
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(body => {
                // your endpoint returns { recommendations: [ { _id, productImage, description }, … ] }
                
                setRecs(body.recommendations);
                console.log("recs ",recs);
            })
            .catch(err => {
                console.error('Recommendation error:', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [description, topN]);

    // if (!description) {
    //     return <p>Type something in search and click the button to get recommendations.</p>;
    // }
    // if (loading) return <p>Loading recommendations…</p>;
    // if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    // if (recs.length === 0) return <p>No recommendations found for “{description}”.</p>;
   
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

    const [expanded, setExpanded] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);

    const visibleCats = expanded ? categories : categories.slice(0,10);
    // — STYLE OBJECTS —
   

    const pillNav = {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.6rem'
    };
    const pillButton = {
        flex: 1,
        padding: '0.6rem 0',
        borderRadius: '999px',
        border: '3px solid #4a8f4a',
        background: 'white',
        color: '#4a8f4a',
        fontWeight: 600,
        textAlign: 'center',
        textDecoration: 'none',
        boxShadow: '0 2px 6px rgba(74,143,74,0.3)',
        transition: 'transform 0.2s, background 0.2s, color 0.2s'
    };
    const pillHover = {
        transform: 'scale(1.05)',
        background: '#4a8f4a',
        color: 'white'
    };

    const sectionTitle = {
        margin: 0,
        fontSize: '1rem',
        color: '#2d5a2d',
        paddingBottom: '0.5rem',
        borderBottom: '1px dashed #4a8f4a'
    };

    const chipsWrap = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginTop: '0.5rem'
    };
    const chipBase = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',          // space between icon & text
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        border: '2px solid #888',
        background: 'white',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        width: '100%',              // fill full sidebar width
boxSizing: 'border-box',    // include padding in width
         whiteSpace: 'nowrap',       // keep text on one line
              overflow: 'hidden',
                  textOverflow: 'ellipsis'  
      };
    const chipActive = {
        borderColor: '#357a38',
        background: '#4a8f4a',
        color: 'white',
        boxShadow: '0 4px 8px rgba(74,143,74,0.4)'
    };
    const chipHover = {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(74,143,74,0.3)'
    };

    const quickTitle = { ...sectionTitle, marginTop: '1rem' };
    const quickWrap = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        maxHeight: '320px',
        overflowY: 'auto',
        paddingRight: '0.2rem'
    };
    const thumb = {
        width: '100%',
        borderRadius: '8px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
    };
    const thumbHover = {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
    };
    const sidebarStyle = {
        width: '220px',
        backgroundColor: '#f3f9f4',
        borderRadius: '12px',
        padding: '1rem',
        boxShadow: expanded
            ? '0 0 20px rgba(74,143,74,0.7)'
            : '0 4px 12px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: '1rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s, transform 0.3s',
        transform: expanded ? 'translateY(-2px)' : 'translateY(0)',
        overflow: 'hidden'
    };

    const headerStyle = {
        fontSize: '1.2rem',
        color: '#2d5a2d',
        marginBottom: '0.75rem',
        borderBottom: '1px solid #d1e7dd',
        paddingBottom: '0.25rem',
    };

    const listContainerStyle = {
        position: 'relative',
        flexGrow: 1,
    };

    const listStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };

    const itemBase = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.2s',
    };

    const radioStyle = {
        accentColor: '#4a8f4a',
    };

    const clearBtnStyle = {
        marginTop: '1rem',
        alignSelf: 'flex-end',
        background: 'transparent',
        border: '1px solid #4a8f4a',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        color: '#4a8f4a',
    };

    const overlayStyle = {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3rem',
        background: 'linear-gradient(transparent, #f3f9f4)',
        display: expanded ? 'none' : 'block',
        pointerEvents: 'none',
    };

    const hintStyle = {
        position: 'absolute',
        bottom: '0.5rem',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#4a8f4a',
        pointerEvents: 'none',
    };

    // const sidebarStyle = {
    //     width: '20%',
    //     backgroundColor: '#ebf6eb',
    //     borderRadius: '12px',
    //     padding: '1rem',
    //     fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif",
    //     boxShadow: '0 2px 6px rgba(74,143,74,0.3)',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     gap: '1.5rem',
    //     position: 'sticky',
    //     top: '1rem'
    // };

    const buttonGroup = {
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'space-between'
    };
    const topButton = {
        flex: 1,
        padding: '0.5rem',
        borderRadius: '999px',
        border: '2px solid #4a8f4a',
        background: 'white',
        color: '#4a8f4a',
        fontWeight: 600,
        textAlign: 'center',
        textDecoration: 'none'
    };
    const topButtonHover = {
        background: '#4a8f4a',
        color: 'white'
    };

    
    const chipsContainer = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
    };
    
    

    const carousel = {
        display: 'flex',
        overflowX: 'auto',
        gap: '0.5rem',
        paddingBottom: '0.5rem',
        marginTop: '0.5rem'
    };
    const thumbStyle = {
        flex: '0 0 45px',
        height: '45px',
        borderRadius: '4px',
        transition: 'transform 0.2s',
        objectFit: 'cover',
        cursor: 'pointer'
      };
    const [hoveredChip, setHoveredChip] = useState(null);
    const [flipped, setFlipped] = useState(null);
    const navItems = [
        { to: '/greendashboard', label: 'Eco Dashboard', icon: '🌿' },
        { to: '/seller', label: 'Seller', icon: '🛍️' },
        { to: '/education', label: 'Education', icon: '🎓' },
        { to: '/sustainability', label: 'Sustainable Reports', icon: '📊' },
      ];
    const sidebar = {
        width: '240px',
        background: 'linear-gradient(160deg, #e8f5e9 0%, #c8e6c9 100%)',
        borderRadius: '16px',
        padding: '1.2rem',
        fontFamily: "'Amazon Ember', Arial, sans-serif",
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    };

    // Flip‐card container
    const cardContainer = {
        display: 'flex',
        flexDirection: 'column',   // stack rows
        gap: '1rem',               // spacing between cards
        alignItems: 'center'       // center them in the sidebar
      };
    // Individual card wrapper for perspective
    const cardWrapper = {
        perspective: '800px',
        width: '72px',
        height: '72px',
    };
    // The inner card that flips
    const cardInner = flippedId => ({
        position: 'relative',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s',
        transform: flipped === flippedId ? 'rotateY(180deg)' : 'rotateY(0deg)'
    });
    const face = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        lineHeight: '72px',
        borderRadius: '12px',
        fontWeight: 600,
        fontSize: '0.9rem',
        backfaceVisibility: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer'
    };
    const frontFace = {
        ...face,
        background: 'white',
        color: '#4a8f4a',
        border: '2px solid #4a8f4a'
    };
    const backFace = {
        ...face,
        background: '#4a8f4a',
        color: 'white',
        transform: 'rotateY(180deg)'
      };
    

    const timelineContainer = {
        position: 'relative',
        paddingLeft: '20px',
        marginBottom: '1rem'
    };
    // the vertical line
    const lineStyle = {
        position: 'absolute',
        left: '9px',
        top: 0,
        bottom: 0,
        width: '2px',
        background: '#4a8f4a'
    };
    const nodeWrapper = {
        position: 'relative',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
    };
    const iconStyle = {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'white',
        border: '2px solid #4a8f4a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        flexShrink: 0,
        zIndex: 1,
        transition: 'transform 0.2s'
    };
    const labelCard = hovered =>
    ({
        marginLeft: '12px',
        padding: '0.4rem 0.8rem',
        background: hovered ? '#4a8f4a' : 'white',
        color: hovered ? 'white' : '#2d5a2d',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'background 0.2s, color 0.2s, transform 0.2s',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)'
    });
    // state for timeline hover
    const [hoveredNav, setHoveredNav] = useState(null);
    // Style helpers
    

  
  
  

    // — style-factory functions (must be functions!) —
    const getIconStyle = hovered => ({
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'white',
        border: '2px solid #4a8f4a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        transform: hovered ? 'scale(1.3)' : 'scale(1)',
        transition: 'transform 0.2s',
    });

    const getLabelStyle = hovered => ({
        marginLeft: '12px',
        padding: '0.4rem 0.8rem',
        background: hovered ? '#4a8f4a' : 'white',
        color: hovered ? 'white' : '#2d5a2d',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'background 0.2s, color 0.2s, transform 0.2s',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
    });

 
   
 
    const thumbBase = {
        width: '100%',
        borderRadius: '8px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    };
   
    
    // state for filter-chip hover
    // const [hoveredChip, setHoveredChip] = useState(null);
    return (
        <div>
            
            <div style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                alignItems: 'stretch',  // make both asides same height as main
                backgroundColor: ' #E8F5E9',
            }}>
                {/* LEFT SIDEBAR: filters + mini picks */}
                <aside style={sidebar}>
                    {/* — Timeline Nav — */}
                    <div style={timelineContainer}>
                        <div style={lineStyle} />
                        {navItems.map(({ to, label, icon }, idx) => {
                            const isNavHover = hoveredNav === idx;
                            return (
                                <div
                                    key={to}
                                    style={nodeWrapper}
                                    onMouseEnter={() => setHoveredNav(idx)}
                                    onMouseLeave={() => setHoveredNav(null)}
                                >
                                    <Link
                                        to={to}
                                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                    >
                                        <span style={getIconStyle(isNavHover)}>{icon}</span>
                                        <span style={getLabelStyle(isNavHover)}>{label}</span>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* — Filters as Chips — */}
                  
                    <h4 style={sectionTitle}>Filters</h4>
                    <div style={chipsWrap}>
                        {leftFilterDefs.map(f => {
                            const active = !!leftFilters[f.key];
                            const isChipHover = hoveredChip === f.key;
                            return (
                                <div
                                    key={f.key}
                                    style={{
                                        ...chipBase,
                                        ...(active ? chipActive : {}),
                                        ...(isChipHover ? chipHover : {})
                                    }}
                                    onClick={() => toggleLeft(f.key)}
                                    onMouseEnter={() => setHoveredChip(f.key)}
                                    onMouseLeave={() => setHoveredChip(null)}
                                >
                                    {/* Icon span */}
                                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>
                                        {f.icon}
                                    </span>
                                    {/* Label */}
                                    <span>{f.label}</span>
                                </div>
                            );
                        })}
                    </div>

                   
                   
                </aside>


                {/* MAIN GRID */}
                <main style={{ flex: 1 }}>
                    <Banner />

                    <div style={{
                        display: 'grid',

                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '1.5rem',
                        gridTemplateColumns: 'repeat(3, 1fr)',  // exactly 3 columns
                        // justifyItems: 'center',      // center each card in its cell
                        // alignItems: 'start',         // cards start at top of cell
                        // padding: '1rem 0'
                        marginRight: '10px',
                        gridAutoFlow: 'row dense',
                    }}

                    >

                        {visible
                            .filter(p => !!p.productImage)
                            // if description, dataSource is full rec list; if no description, it's already sliced to 6
                            .map(p => (
                                <Link key={p._id} to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <ProductCard p={p} />
                                </Link>
                            ))}

                    </div>
                </main>


                {/* RIGHT BAR: category selector */}

                <aside
                    style={{
                        width: '220px',
                        background: 'linear-gradient(160deg, #e8f5e9 0%, #c8e6c9 100%)', // same as left sidebar
                        borderRadius: '12px',
                        padding: '1rem',
                        boxShadow: expanded
                            ? '0 0 20px rgba(74,143,74,0.7)'
                            : '0 4px 12px rgba(0,0,0,0.05)',
                        position: 'sticky',
                        top: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}
                >
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        color: '#2d5a2d',
                        paddingBottom: '0.25rem',
                        borderBottom: '1px solid #d1e7dd'
                    }}>
                        Categories
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {visibleCats.map(cat => {
                            const isActive = selectedCategory === cat;
                            const isHover = hoveredItem === cat;
                            return (
                                <div
                                    key={cat}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '0.6rem 1rem',
                                        borderRadius: '20px',
                                        border: isActive
                                            ? '2px solid #357a38'
                                            : '2px solid #888',
                                        background: isActive
                                            ? '#4a8f4a'
                                            : isHover
                                                ? '#eaf6eb'
                                                : 'white',
                                        color: isActive ? 'white' : '#2d5a2d',
                                        cursor: 'pointer',
                                        boxSizing: 'border-box',
                                        transition: 'background 0.2s, transform 0.2s',
                                        transform: isHover && !isActive
                                            ? 'scale(1.02)'
                                            : 'scale(1)'
                                    }}
                                    onClick={() =>
                                        setSelectedCategory(isActive ? null : cat)
                                    }
                                    onMouseEnter={() => setHoveredItem(cat)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <span>{cat}</span>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={isActive}
                                        readOnly
                                        style={{ accentColor: '#4a8f4a' }}
                                    />
                                </div>
                            );
                        })}

                        {categories.length > 10 && (
                            <div
                                style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '20px',
                                    border: '2px dashed #4a8f4a',
                                    background: 'white',
                                    textAlign: 'center',
                                    color: '#4a8f4a',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => {
                                    if (expanded) {
                                        // collapse & clear
                                        setSelectedCategory(null);
                                        setExpanded(false);
                                    } else {
                                        // expand only
                                        setExpanded(true);
                                    }
                                }}
                            >
                                {expanded
                                    ? 'Collapse ▲'
                                    : 'See more categories ▼'}
                            </div>
                        )}
                    </div>
                </aside>



            </div>
            <SuggestGreenCarousel />
            <SuggestGreenBrands/>
        </div>
       
    );
}
