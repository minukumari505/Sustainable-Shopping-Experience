import React, { useState, useEffect } from 'react';

export default function RewardEarned() {
    const rewards = [
        {
            title: 'Amazon Gift Card',
            icon:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYOkNDNBZZJmV9HiW_cGMqzunncAZNr8f43Q&s',
        },
        {
            title: 'Discount Coupon',
            icon:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm9CcnIyTcLTMPFjOpedbLv1-yE7ymVcY7kw&s',
        },
        {
            title: 'Free Shipping',
            icon:
                'https://png.pngtree.com/png-vector/20210710/ourmid/pngtree-black-free-shipping-png-image_3577608.jpg',
        },
        {
            title: 'Prime Membership',
            icon:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKD-Dzfs9yxzvDv-503bDDSWFuUAQO8zZUVg&s',
        },
    ];

    const VISIBLE_COUNT = 3;
    const total = rewards.length;
    const [index, setIndex] = useState(0);
    const [showSpark, setShowSpark] = useState(false);

    // styles lifted from Dashboard.js
    const titleStyle = {
        fontSize: 18,
        fontWeight: 600,
        color: '#111',
        marginBottom: 8,
    };
    const labelStyle = {
        fontSize: 14,
        color: '#374151',
    };

    // compute the slice of 3 to show
    const visibleRewards = Array.from({ length: VISIBLE_COUNT }, (_, i) =>
        rewards[(index + i) % total]
    );

    const prev = () => setIndex((idx) => (idx - 1 + total) % total);
    const next = () => setIndex((idx) => (idx + 1) % total);

    // auto-rotate every 3s
    useEffect(() => {
        const timer = setInterval(next, 2000);
        return () => clearInterval(timer);
    }, []);

    // A simple sparkle overlay
    const SparkOverlay = () => {
        useEffect(() => {
            const t = setTimeout(() => setShowSpark(false), 2000);
            return () => clearTimeout(t);
        }, []);

        return (
            <div
                onClick={() => setShowSpark(false)}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
            >
                <style>{`
          @keyframes spark {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(3); }
          }
        `}</style>
                {Array.from({ length: 30 }).map((_, i) => {
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;
                    const delay = Math.random();
                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: `${left}vw`,
                                top: `${top}vh`,
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#FFD700',
                                animation: `spark 0.8s ease-out ${delay}s forwards`,
                            }}
                        />
                    );
                })}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 600,
                        textShadow: '0 0 8px rgba(0,0,0,0.7)',
                    }}
                >
                    🎉 Redeemed Successfully! 🎉
                </div>
            </div>
        );
    };

    return (
        <div>
            <h3 style={{ ...titleStyle }}>Redeem Your Rewards</h3>

            <div
                style={{
                    position: 'relative',
                    display: 'inline-block',
                    padding: '0.5rem',
                    borderRadius: 8,
                }}
            >
                <button
                    onClick={prev}
                    style={{
                        position: 'absolute',
                        left: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        fontSize: 18,
                        cursor: 'pointer',
                        color: '#22c55e',
                    }}
                >
                    ‹
                </button>

                <div style={{ display: 'flex', gap: 8 }}>
                    {visibleRewards.map((r, i) => (
                        <div
                            key={i}
                            style={{
                                flex: '0 0 90px',
                                background: '#F0FDF4',    // <— Soft Mint background
                                borderRadius: 6,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                padding: 8,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src={r.icon}
                                    alt={r.title}
                                    style={{ width: 24, height: 24, objectFit: 'contain' }}
                                />
                            </div>
                            <span style={labelStyle}>{r.title}</span>
                            <button
                                onClick={() => setShowSpark(true)}
                                style={{
                                    marginTop: 'auto',
                                    background: '#22c55e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                Redeem
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={next}
                    style={{
                        position: 'absolute',
                        right: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        fontSize: 18,
                        cursor: 'pointer',
                        color: '#22c55e',
                    }}
                >
                    ›
                </button>
            </div>

            {showSpark && <SparkOverlay />}
        </div>
    );
}
