import React from 'react';

export default function Rewards() {
    const rewards = [
        {
            title: 'Amazon Gift Card',
            icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYOkNDNBZZJmV9HiW_cGMqzunncAZNr8f43Q&s'
        },
        {
            title: 'Discount Coupon',
            icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm9CcnIyTcLTMPFjOpedbLv1-yE7ymVcY7kw&s'
        },
        {
            title: 'Free Shipping',
            icon: 'https://png.pngtree.com/png-vector/20210710/ourmid/pngtree-black-free-shipping-png-image_3577608.jpg'
        },
        {
            title: 'Prime Membership',
            icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKD-Dzfs9yxzvDv-503bDDSWFuUAQO8zZUVg&s'
        },
    ];

    return (
        <div>
            <h3 style={{ marginTop: '10px', fontSize: '1.25rem', color: '#333' }}>
                Reward You Can Earn
            </h3>

            {/* Wrap only the cards in this pale-green box */}
            <div
                style={{
                    display: 'inline-block',       // shrink to fit the 4 cards
                    padding: '0.5rem',
                    background: '#E8F5E9',         // light green
                    borderRadius: '8px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                    }}
                >
                    {rewards.map((r, i) => (
                        <div
                            key={i}
                            style={{
                                flex: '0 0 90px',
                                background: '#fff',
                                borderRadius: '6px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                padding: '0.4rem',
                                textAlign: 'center',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    margin: '0 auto 0.4rem',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src={r.icon}
                                    alt={r.title}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.2 }}>
                                {r.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
