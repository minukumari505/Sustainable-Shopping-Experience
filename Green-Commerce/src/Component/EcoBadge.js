import React, { useEffect, useState } from 'react';

export default function EcoBadge() {
    const [scale, setScale] = useState(0);

    useEffect(() => {
        requestAnimationFrame(() => setScale(1));
    }, []);

    // hard-coded sample values; replace with props or real data as needed
    const stats = {
        plasticReduced: 84,
        chemicalUsed: 19,
        co2Reduced: 37,  // NEW: percentage of CO2 emissions reduced
    };

    return (
        <div
            style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.6s cubic-bezier(0.25,1.25,0.5,1)',
                background: '#fff',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                maxWidth: '220px',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, #E8F5E9, #C8E6C9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: '#2E7D32'
                    }}
                >
                    🌿
                </div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>5-LEAF BADGE</h4>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.8rem', margin: '0.5rem 0', lineHeight: 1.3 }}>
                This badge certifies the product’s eco-friendly attributes, verified by Amazon.
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0.75rem 0' }} />

            {/* Parameters */}
            <div style={{ fontSize: '0.8rem' }}>
                {/* Plastic Reduced */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Plastic Reduced</span>
                    <span>{stats.plasticReduced}%</span>
                </div>
                <div
                    style={{
                        height: '6px',
                        background: '#C8E6C9',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        margin: '0.25rem 0 0.75rem'
                    }}
                >
                    <div
                        style={{
                            width: `${stats.plasticReduced}%`,
                            height: '100%',
                            background: '#2E7D32'
                        }}
                    />
                </div>

                {/* Chemical Used */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Chemical Used</span>
                    <span>{stats.chemicalUsed}%</span>
                </div>
                <div
                    style={{
                        height: '6px',
                        background: '#E8F5E9',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        margin: '0.25rem 0 0.75rem'
                    }}
                >
                    <div
                        style={{
                            width: `${stats.chemicalUsed}%`,
                            height: '100%',
                            background: '#689F38'
                        }}
                    />
                </div>

                {/* CO₂ Emissions Reduced */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>CO₂ Emissions Reduced</span>
                    <span>{stats.co2Reduced}%</span>
                </div>
                <div
                    style={{
                        height: '6px',
                        background: '#E8F5E9',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        margin: '0.25rem 0 0.75rem'
                    }}
                >
                    <div
                        style={{
                            width: `${stats.co2Reduced}%`,
                            height: '100%',
                            background: '#4CAF50'  // a fresh green
                        }}
                    />
                </div>

                {/* Recyclable */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Recyclable</span>
                    <span style={{ fontSize: '1.2rem', color: '#2E7D32' }}>♻️</span>
                </div>
            </div>

            {/* Certificates */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNuAhIy2mcMU4vO-0qhCqf6zX0HJN8Oulg4A&s"
                    alt="Fairtrade"
                    width={24}
                />
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHBhtlo4pYS29rC833d5PHjyjrjk_OfwUgbA&s"
                    alt="FSC"
                    width={24}
                />
                <img
                    src="https://icon2.cleanpng.com/20180805/sja/kisspng-logo-brand-product-design-green-5b67224ca77ad1.268867621533485644686.jpg"
                    alt="Green Seal"
                    width={24}
                />
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnv9EEkP3-x_m7ARzcUMKSUxfSwabqJivwRQ&s"
                    alt="Eco Cert"
                    width={24}
                />
            </div>
        </div>
    );
}
