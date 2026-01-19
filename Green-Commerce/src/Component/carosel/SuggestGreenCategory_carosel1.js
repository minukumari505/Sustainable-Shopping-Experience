import React, { useState, useEffect, useRef } from 'react';

export default function SuggestGreenCarousel() {
    const categories = [
        { image: 'https://earthhero.com/cdn/shop/files/Bathroom_4c111570-ccef-44d2-8aed-b11f77152bcf.jpg?v=1718900352&width=700', label: 'Bathroom' },
        { image: 'https://earthhero.com/cdn/shop/files/beauty.jpg?v=1719251640&width=700', label: 'Clean Beauty' },
        { image: 'https://earthhero.com/cdn/shop/files/Kids_9a29b7e4-14d0-4b30-aa1f-9cf60d4637d2.jpg?v=1718900525&width=700', label: 'Kids' },
        { image: 'https://earthhero.com/cdn/shop/files/Dental_Hygiene1.jpg?v=1718900453&width=700', label: 'Dental Hygiene' },
        { image: 'https://earthhero.com/cdn/shop/files/kitchen_bb6daf84-c7c7-4a04-a299-c163a34537a1.jpg?v=1719251509&width=700', label: 'Home & Kitchen' },
        { image: 'https://earthhero.com/cdn/shop/files/Cleaning_2258b8b5-2451-477e-9e17-4a98941d66c4.jpg?v=1718900423&width=700', label: 'Cleaning' },
        { image: 'https://earthhero.com/cdn/shop/files/Hair_Care.jpg?v=1718900478&width=700', label: 'Hair Care' },
        { image: 'https://earthhero.com/cdn/shop/files/Laundry_4454eeef-e7bc-4379-8cbf-28b8e517a610.jpg?v=1718900548&width=700', label: 'Laundry' },
        { image: 'https://earthhero.com/cdn/shop/files/bathroom_3dfd2ac8-c947-4c6f-a053-079dc6e1864a.jpg?v=1719251972&width=700', label: 'Personal Hygiene' },
        { image: 'https://earthhero.com/cdn/shop/files/pets_8999b726-395f-4f66-85df-5dcaac5ad7ef.jpg?v=1719251763&width=700', label: 'Pet Care' },
        { image: 'https://earthhero.com/cdn/shop/files/Outdoors.jpg?v=1718900566&width=700', label: 'Outdoor Living' }
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
    const track = {
        display: 'flex', transition: 'transform 0.5s ease',
        transform: `translateX(-${index * (250 + 16)}px)`
    };
    const card = {
        minWidth: '250px', marginRight: '16px', borderRadius: '8px', overflow: 'hidden',
        position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer',
        transition: 'transform 0.3s'
    };
    const imgStyle = { width: '100%', height: '200px', objectFit: 'cover' };
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
