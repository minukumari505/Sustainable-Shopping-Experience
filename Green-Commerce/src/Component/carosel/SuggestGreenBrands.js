import React, { useState, useEffect, useRef } from 'react';

export default function SuggestGreenBrands() {
    const brands = [
        { name: 'ZWS Essentials', image: 'https://earthhero.com/cdn/shop/files/zero-waste-essentials_5a1d317d-8ae0-47f4-9c56-8d5d9672baff.jpg?v=1718987779&width=200', description: 'ZWS Essentials crafts sustainable household basics made from recycled materials, delivering eco-friendly quality without compromise.' },
        { name: 'Terracycle', image: 'https://earthhero.com/cdn/shop/files/Terracycle_ee76e604-bddc-4267-90d3-b083ee501eb9.jpg?v=1718899410&width=300', description: 'Terracycle leads recycling innovation, transforming waste into new products through global upcycling programs.' },
        { name: 'Meliora', image: 'https://earthhero.com/cdn/shop/files/meliora.jpg?v=1718894102&width=300', description: 'Meliora offers plant-based cleaning solutions free from harsh chemicals for a safer, greener home.' },
        { name: 'Dropps', image: 'https://earthhero.com/cdn/shop/files/dopps.jpg?v=1718894169&width=300', description: 'Dropps provides water-soluble, plastic-free laundry and dishwasher pods that are powerful yet planet-friendly.' },
        { name: 'BioBag', image: 'https://earthhero.com/cdn/shop/files/biobag.jpg?v=1718894190&width=300', description: 'BioBag produces compostable bags and films made from renewable raw materials to reduce plastic waste.' },
        { name: 'Bumbleride', image: 'https://earthhero.com/cdn/shop/files/Bumbleride_8ece3d66-8dd0-4764-95b0-2572c2acc796.jpg?v=1718899484&width=300', description: 'Bumbleride creates eco-friendly, durable baby strollers and gear designed for urban and outdoor adventures.' },
        { name: 'Un•Paste', image: 'https://earthhero.com/cdn/shop/files/unpaste.jpg?v=1718894221&width=300', description: 'Un•Paste offers toothpaste tablets in plastic-free packaging, promoting zero-waste oral care.' },
        { name: 'Plaine Products', image: 'https://earthhero.com/cdn/shop/files/plaine-products.jpg?v=1718894241&width=300', description: 'Plaine Products provides refillable personal care essentials in aluminum bottles to eliminate single-use plastics.' },
        { name: 'Holy Lamb Organics', image: 'https://earthhero.com/cdn/shop/files/holy-lamb-organics.jpg?v=1718894257&width=300', description: 'Holy Lamb Organics delivers certified organic wool products that are sustainable, cozy, and hypoallergenic.' },
        { name: 'Suds & Eco', image: 'https://earthhero.com/cdn/shop/files/Suds_Eco.jpg?v=1718899502&width=300', description: 'Suds & Eco creates plant-based, cruelty-free body care items packaged in biodegradable materials.' }
    ];

    const visibleCount = 4;
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(brands[0]);
    const intervalRef = useRef(null);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setIndex(i => (i + 1) % brands.length);
        }, 4000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const handlePrev = () => {
        clearInterval(intervalRef.current);
        setIndex(i => (i - 1 + brands.length) % brands.length);
    };
    const handleNext = () => {
        clearInterval(intervalRef.current);
        setIndex(i => (i + 1) % brands.length);
    };

    // Styles
    const section = { backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' };
    const header = { marginBottom: '16px', color: '#333' };
    const carousel = { display: 'flex', alignItems: 'center', margin: '24px 0', position: 'relative' };
    const arrow = { width: 40, height: 40, borderRadius: '50%', border: 'none', backgroundColor: '#2d6a4f', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' };
    const viewport = { overflow: 'hidden', flex: 1 };
    const track = { display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${index * (200 + 16)}px)` };
    const card = { minWidth: 200, marginRight: 16, backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'transform 0.3s, background-color 0.3s', position: 'relative' };
    const img = { width: '100%', height: 'auto', borderRadius: '4px' };
    const label = { marginTop: '12px', fontWeight: 600, color: '#2d6a4f' };
    const overlay = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s', borderRadius: '8px', padding: '16px', boxSizing: 'border-box' };

    return (
        <div style={section}>
            <h2 style={{ ...header, fontSize: 24 }}>Recommended Sustainable Brands</h2>
            <p style={{ ...header, fontSize: 16 }}>Featuring eco-conscious companies making real impact—discover brands championing sustainability.</p>

            <div style={carousel}>
                <button onClick={handlePrev} style={{ ...arrow, marginRight: 8 }}>&lt;</button>
                <div style={viewport}>
                    <div style={track}>
                        {brands.concat(brands.slice(0, visibleCount)).map((b, i) => (
                            <div
                                key={i}
                                style={card}
                                onClick={() => setSelected(b)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    const ov = e.currentTarget.querySelector('.overlay'); if (ov) ov.style.opacity = 1;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    const ov = e.currentTarget.querySelector('.overlay'); if (ov) ov.style.opacity = 0;
                                }}
                            >
                                <img src={b.image} alt={b.name} style={img} />
                                <div style={label}>{b.name}</div>
                                <div className="overlay" style={overlay}>
                                    <p style={{ margin: 0 }}>{b.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleNext} style={{ ...arrow, marginLeft: 8 }}>&gt;</button>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', marginTop: '16px' }}>
                <h3 style={{ margin: 0, color: '#2d6a4f' }}>{selected.name}</h3>
                <p style={{ marginTop: '8px', color: '#555' }}>{selected.description}</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button 
                    onClick={scrollToTop}
                style={{ padding: '12px 24px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Shop All Brands
                </button>
            </div>
        </div>
    );
}