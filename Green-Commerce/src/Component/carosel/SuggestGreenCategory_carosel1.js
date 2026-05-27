import React, { useState, useEffect, useRef } from 'react';
import cat1 from '../../assets/SuggestGreenCategory_carosel/Bathroom.png';
import cat2 from '../../assets/SuggestGreenCategory_carosel/Clean Beauty.png';
import cat3 from '../../assets/SuggestGreenCategory_carosel/Dental Hygiene.png';
import cat4 from '../../assets/SuggestGreenCategory_carosel/Kids.png';
import cat5 from '../../assets/SuggestGreenCategory_carosel/Home Kitchen.png';
import cat6 from '../../assets/SuggestGreenCategory_carosel/Cleaning.png';
import cat7 from '../../assets/SuggestGreenCategory_carosel/Hair Care.png';
import cat8 from '../../assets/SuggestGreenCategory_carosel/Laundry.png';
import cat9 from '../../assets/SuggestGreenCategory_carosel/Personal Hygiene.png';
import cat10 from '../../assets/SuggestGreenCategory_carosel/Pet Care.png';
import cat11 from '../../assets/SuggestGreenCategory_carosel/Outdoor Living.png';

export default function SuggestGreenCarousel() {
    const categories = [
        { image: cat1, label: 'Bathroom' },
        { image: cat2, label: 'Clean Beauty' },
        { image: cat3, label: 'Dental Hygiene' },
        { image: cat4, label: 'Kids' },
        { image: cat5, label: 'Home & Kitchen' },
        { image: cat6, label: 'Cleaning' },
        { image: cat7, label: 'Hair Care' },
        { image: cat8, label: 'Laundry' },
        { image: cat9, label: 'Personal Hygiene' },
        { image: cat10, label: 'Pet Care' },
        { image: cat11, label: 'Outdoor Living' }
    ];

    const visibleCount = 3;
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        startAutoSlide();
        return () => clearInterval(intervalRef.current);
    }, []);

    const startAutoSlide = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setIndex(i => (i + 1) % categories.length);
        }, 3000);
    };

    const handlePrev = () => {
        clearInterval(intervalRef.current);
        setIndex(i => (i - 1 + categories.length) % categories.length);
    };

    const handleNext = () => {
        clearInterval(intervalRef.current);
        setIndex(i => (i + 1) % categories.length);
    };

    // Updated wrapper: white background and lifted up slightly
    const wrapper = {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        margin: '24px 0',
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        transform: 'translateY(-10px)' // Lifts the carousel up
    };
    const arrowStyle = {
        width: '40px', height: '40px', borderRadius: '50%', border: 'none',
        backgroundColor: '#006600', color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    };
    const viewport = { overflow: 'hidden', flex: 1 };
    const itemWidth = 250; // px
    const gap = 16; // px
    const track = {
        display: 'flex', transition: 'transform 0.5s ease',
        transform: `translateX(-${index * (itemWidth + gap)}px)`
    };
    const card = {
        minWidth: `${itemWidth}px`, marginRight: `${gap}px`, borderRadius: '8px', overflow: 'hidden',
        position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer',
        transition: 'transform 0.3s'
    };
    const imgStyle = { width: '100%', height: `${itemWidth}px`, objectFit: 'cover', imageRendering: 'auto' };
    const labelStyle = {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        color: '#fff', fontSize: '20px', textShadow: '0 2px 6px rgba(0,0,0,0.6)', textAlign: 'center'
    };

    return (
        <div style={wrapper}>
            <button onClick={handlePrev} style={{ ...arrowStyle, marginRight: '8px' }}>&lt;</button>
            <div style={viewport}>
                <div style={track}>
                    {categories.concat(categories.slice(0, visibleCount)).map((cat, i) => (
                        <div key={i} style={card}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                            <img src={cat.image} alt={cat.label} style={imgStyle} />
                            <span style={labelStyle}>{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleNext} style={{ ...arrowStyle, marginLeft: '8px' }}>&gt;</button>
        </div>
    );
}
