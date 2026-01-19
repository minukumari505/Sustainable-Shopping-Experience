import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import Navbar from './navbar';
import ecohublogo from "../assets/ecohublogo.png";
import SuggestGreenCategory_carosel1 from './carosel/SuggestGreenCategory_carosel1';
import NormalHeader from './NormalHeader';
import SuggestGreenBrands from './carosel/SuggestGreenBrands';
import SustainabilityReportsSection from './Sustainability';
import Educationsection from './Educationsection';

export default function StandardDashboard() {
    const [activeTile, setActiveTile] = useState(null);

    const container = {
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f3f4f6'
    };
    const titleStyle = {
        fontSize: '28px',
        fontWeight: '600',
        marginBottom: '24px',
        color: '#111827'
    };
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px'
    };
    const baseCard = {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
        textDecoration: 'none'
    };
    // Default icon sizing
    const defaultIconStyle = {
        width: '40px',
        height: '40px',
        marginRight: '16px',
        flexShrink: 0
    };
    const cardTitle = { fontSize: '18px', fontWeight: '500', margin: 0, color: '#111827' };
    const cardDesc = { fontSize: '14px', margin: '4px 0 0', color: '#6b7280' };

    const tiles = [
        {
            icon: ecohublogo,
            iconStyle: { width: '80px', height: '80px' },
            title: 'EcoHub Dashboard',
            desc: 'Harness real-time sustainability insights, track carbon savings, and manage eco-friendly purchases',
            link: '/greendashboard'
        },
        {
            icon: 'https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/Box._CB485927553_.png',
            title: 'Your Orders',
            desc: 'Track, return, or buy things again'
        },
        {
            icon: 'https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/sign-in-lock._CB485931504_.png',
            title: 'Login & security',
            desc: 'Edit login, name, and mobile number'
        },
        {
            icon: 'https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/rc_prime._CB485926807_.png',
            title: 'Prime',
            desc: 'View benefits and payment settings'
        },
        {
            icon: 'https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/address-map-pin._CB485934183_.png',
            title: 'Your Addresses',
            desc: 'Edit addresses for orders and gifts'
        },
        {
            icon: 'https://m.media-amazon.com/images/G/31/AmazonBusiness/YAPATF/amazon_business_yap_atf._CB588250268_.jpg',
            title: 'Your business account',
            desc: 'Sign up for free to save up to 28% and purchase on credit'
        },
        {
            icon: 'https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/Payments._CB485926359_.png',
            title: 'Payment options',
            desc: 'Edit or add payment methods'
        },
        {
            icon: 'https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/amazon_pay._CB485946857_.png',
            title: 'Amazon Pay balance',
            desc: 'Add money to your balance'
        },
        {
            icon: 'https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/self-service/contact_us._CB623781998_.png',
            title: 'Contact Us',
            desc: 'Contact service via phone or chat'
        },
    ];

    const handleMouseEnter = e => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'scale(1.02)';
    };
    const handleMouseLeave = e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'scale(1)';
    };

    return (
        <div style={{ backgroundColor: 'white' }}>
            <NormalHeader />
            <Navbar />

            {/* <SustainabilityReportsSection/> */}
            {/* <Educationsection/> */}
            {/* <SuggestGreenCategory_carosel1 /> */}
            {/* <SuggestGreenBrands/> */}

            <div style={container}>
                <h1 style={titleStyle}>Your Account</h1>
                <div style={gridStyle}>
                    {tiles.map(({ icon, iconStyle, title, desc, link }) => {
                        const isActive = activeTile === title;
                        const cardStyle = {
                            ...baseCard,
                            ...(isActive ? { backgroundColor: '#e6ffe6', transform: 'scale(1.02)' } : {})
                        };

                        // Merge default + per-tile icon style
                        const imgStyle = iconStyle
                            ? { ...defaultIconStyle, ...iconStyle }
                            : defaultIconStyle;

                        const content = (
                            <>
                                <img src={icon} alt={title} style={imgStyle} />
                                <div>
                                    <h3 style={cardTitle}>{title}</h3>
                                    <p style={cardDesc}>{desc}</p>
                                </div>
                            </>
                        );

                        if (link) {
                            return (
                                <NavLink
                                    key={title}
                                    to={link}
                                    style={({ isActive: navActive }) => ({
                                        ...cardStyle,
                                        ...(navActive ? { backgroundColor: '#e6ffe6', transform: 'scale(1.02)' } : {})
                                    })}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseDown={() => setActiveTile(title)}
                                    onMouseUp={() => setActiveTile(null)}
                                >
                                    {content}
                                </NavLink>
                            );
                        }

                        return (
                            <div
                                key={title}
                                style={cardStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onMouseDown={() => setActiveTile(title)}
                                onMouseUp={() => setActiveTile(null)}
                            >
                                {content}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
