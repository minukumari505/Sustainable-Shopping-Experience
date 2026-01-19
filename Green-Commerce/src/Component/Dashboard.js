import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  YAxis,
} from 'recharts';
import RewardEarned from "../Component/RewardEarned";
import { CarbonDial } from '../Component/CarbonDial';

// src/components/Dashboard.js

import badge1 from '../assets/badge1.png';
import badge2 from '../assets/badge22.png';
import badge3 from '../assets/badge3.png';
import badge4 from '../assets/badge4.png';

  // Modal and confetti styles for badge modal

  const overlayStyle = { position:'fixed', top:0,left:0,right:0,bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 };
  const modalStyle = { background:'#fff', padding: '24px', borderRadius:'8px', textAlign:'center', position:'relative', minWidth: 300, minHeight: 250 };
  const medalStyle = { width: '80px', height:'80px', marginBottom:'16px' };
  const closeBtnStyle = { marginTop:'16px', padding:'8px 16px', background:'#2d6a4f', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer' };
  const confettiContainerStyle = { position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'hidden', pointerEvents:'none' };
  function randomConfettiStyle() {
    const size = Math.random()*8+4;
    return {
      position:'absolute',
      top: Math.random()*100+'%',
      left:Math.random()*100+'%',
      width:size+'px',
      height:size+'px',
      background: ['#fde68a','#bbf7d0','#fecdd3'][Math.floor(Math.random()*3)],
      opacity: Math.random(),
      borderRadius:'50%',
      animation:`drop${Math.random()*2+2}s linear infinite`
    };
  }

const LoadingSpinner = () => (
  <div style={{
    padding: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6'
  }}>
    <div style={{
      border: '6px solid #e5e7eb',
      borderTop: '6px solid #22c55e',
      borderRadius: '50%',
      width: 48,
      height: 48,
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default function Dashboard() {
  // Pull email from localStorage instead of URL
  const email = localStorage.getItem('email');

  const [plasticData, setPlasticData]     = useState([]);
  // Filter out negative-percentage items for the eco-chart
  const filteredPlasticData = plasticData.filter(item => item.percentage >= 0);
  // Use productId for chart labels
  const chartDataById = filteredPlasticData.map(item => ({
    ...item,
    displayId: item.productId || item.id || item.name  // fallback if id is missing
  }));
  const [ecoTrend, setEcoTrend]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [totalCo2Saved, setTotalCo2Saved] = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [carbonModalOpen, setCarbonModalOpen] = useState(false);
  const [topContributors, setTopContributors] = useState([]);

  const badges = [
    { name: 'Eco Rookie',          icon: badge1 },
    { name: 'Green Advocate',      icon: badge2 },
    { name: 'Sustainability Star', icon: badge3 },
    { name: 'Planet Guardian',     icon: badge4 },
  ];
  const [totalProductsOrdered, setTotalProductsOrdered] = useState(0);
  const [badgeScore, setBadgeScore] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);

  useEffect(() => {
    if (!email) {
      setError('No user email found in localStorage');
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/user-dashboard?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const json = await res.json();
         
        setPlasticData(json.plasticReductionList || []);
        // Sort months Jan→Dec
        const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        setEcoTrend((json.ecoTrend || []).sort((a,b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)));
        setCategories(json.categoryStats || []);
        setTotalCo2Saved(json.totalCo2Saved || 0);
        setTotalProductsOrdered(json.totalProductsOrdered || 0);
        setBadgeScore(json.badgeScore || 0);
        setTotalGroups(json.totalGroups || 0);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchLeaderboard() {
      try {
        const res = await fetch('http://localhost:5000/top-badge-scores');
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        const sortedData = [...data].sort((a, b) => b.totalCo2Saved - a.totalCo2Saved);
        setTopContributors(sortedData);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      }
    }

    loadDashboard();
    fetchLeaderboard();
  }, [email]);

  if (loading) return <LoadingSpinner />;
  if (error)   return <p style={{ padding: 24, color: 'red' }}>Error: {error}</p>;

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    gap: 32,
    margin: '16px 0'
  };
  const titleStyle = {
    fontSize: 18,
    fontWeight: 600,
    color: '#111',
    marginBottom: 8
  };


  const Dial = ({ pct, label }) => {
    const radius = 36;
    const stroke = 8;
    const r = radius - stroke / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={radius * 2} height={radius * 2}>
          <circle
            cx={radius}
            cy={radius}
            r={r}
            stroke="#dcfce7"
            fill="none"
            strokeWidth={stroke}
          />
          <circle
            cx={radius}
            cy={radius}
            r={r}
            stroke="#22c55e"
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#111"
          >
            {pct}%
          </text>
        </svg>
        <div style={{ marginTop: 8, color: '#374151' }}>{label}</div>
      </div>
    );
  };

  // Normalize group contribution (maxing at 5 groups)
  const groupWeight = Math.min(totalGroups / 5, 1);
  // Final badge metric: give groups highest weight (60%) -- Ensure a minimum baseline of 10%
  // Ensure a minimum baseline of 10%
  const finalBadgeMetric = Math.max(0.1, groupWeight * 0.6 + badgeScore * 0.4);
  // Compute badge tier dynamically based on finalBadgeMetric
  let currentBadgeIndex = 0;
  if (finalBadgeMetric >= 0.8) currentBadgeIndex = 3;
  else if (finalBadgeMetric >= 0.5) currentBadgeIndex = 2;
  else if (finalBadgeMetric >= 0.2) currentBadgeIndex = 1;

  return (
    <div
      style={{
        padding: 0,
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* 1. Gauge + AreaChart */}
      <div style={cardStyle}>
        <div
          style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setCarbonModalOpen(true)}
        >
          <div style={titleStyle}>Total Carbon Saved this Month</div>
          <CarbonDial
            value={totalCo2Saved}
            goal={100} // adjust your target as needed
            label="Total CO₂ Saved"
          />
        </div>

        {/* AreaChart */}
        <div style={{ flex: 1, height: 200 }}>
          <div style={titleStyle}>Monthly Eco-Purchase Trends</div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={ecoTrend} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                stroke="#374151"
                padding={{ left: 10, right: 10 }}
              />
              <Tooltip
                contentStyle={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#chart-gradient)"
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 6, fill: '#22c55e' }}
                activeDot={{ r: 8 }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Rewards */}
        <RewardEarned badges={badges} currentIndex={currentBadgeIndex} totalOrders={totalProductsOrdered} />
      </div>

      {/* 2 & 3. Category and Badge Tracker side by side */}
      <div style={{ display: 'flex', marginTop: '-35px', gap: '16px' }}>
        {/* Category Dials */}
        <div style={{ ...cardStyle, width: '40%', alignItems: 'center', marginLeft: '16px' }}>
          <div style={titleStyle}>Category Wise Distribution</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {
              // Show top 5 categories with non-negative percentages, sorted descending
              (() => {
                const filteredCategories = categories
                  .filter(c => c.pct >= 0)
                  .sort((a, b) => b.pct - a.pct)
                  .slice(0, 5);
                return filteredCategories.map((c, idx) => (
                  <Dial key={c.label || idx} pct={c.pct} label={c.label} />
                ));
              })()
            }
          </div>
        </div>

        {/* Badge Tracker */}
        <div style={{ ...cardStyle, alignItems: 'center', width: '55%', paddingRight: '12px' }}>
          <div style={titleStyle}>Badge tracker</div>
          <style>{`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          `}</style>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: badges
                .map((_, i) => (i < badges.length - 1 ? '48px 100px' : '48px'))
                .join(' '),
              gridTemplateRows: '48px auto',
              alignItems: 'center',
              rowGap: 8,
              marginTop: 18,
              marginRight: 40,
             
            }}
          >
            {badges.map(({ name, icon }, i) => {
              const col = i * 2 + 1;
              const isActive = i === currentBadgeIndex;
              return (
                <React.Fragment key={name}>
                  <div
                    style={{
                      gridRow: 1,
                      gridColumn: col,
                      width: 55,
                      height: 55,
                      border: '3px solid #22c55e',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isActive ? '#dcfce7' : '#fff',
                      animation: isActive ? 'pulse 2s ease-in-out infinite' : undefined,
                      position: 'relative',
                      cursor: isActive ? 'pointer' : 'default'
                    }}
                    title={`Total orders: ${totalProductsOrdered}`}
                    onClick={() => { if (isActive) setModalOpen(true); }}
                  >
                    <img src={icon} alt={name} style={{ width: 35, height: 35 }} />
                  </div>
                  <div
                    style={{
                      gridRow: 2,
                      gridColumn: col,
                      textAlign: 'center',
                      fontSize: 14,
                      color: '#374151',
                    }}
                  >
                    {name}
                  </div>
                  {i < badges.length - 1 && (
                    <div
                      style={{
                        gridRow: 1,
                        gridColumn: col + 1,
                        width: '150px',
                        height: 4,
                        // before current badge → green; after → yellow
                        backgroundColor: i < currentBadgeIndex
                          ? '#228C22'
                          : '#7DD3FC',
                        borderRadius: 2,
                        justifySelf: 'start',
                        transform: 'translateX(-24px)',
                        marginLeft: '35px'
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* % Plastic Reduced */}
      <div style={{ ...cardStyle, marginTop: -25 }}>
        <div style={titleStyle}>% Plastic Reduced Per Item</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartDataById} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayId" angle={-30} textAnchor="end" height={60} interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="percentage" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div
        style={{
          marginTop: '-25px',
          backgroundColor: '#fff',
          padding: 24,
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          Top Eco-Contributors
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topContributors.map((u, idx) => {
            const accentColors = ['#FBBF24', '#9CA3AF', '#D97706'];
            return (
              <div
                key={u.email}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor:
                    idx === 0 ? '#FFFBEB' : idx === 1 ? '#F3F4F6' : '#FDF2F8',
                  borderLeft: `4px solid ${accentColors[idx]}`,
                  borderRadius: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: accentColors[idx],
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {u.email.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 16, color: '#111' }}>
                    {idx + 1}. {u.email}
                  </span>
                </div>
                <span style={{ fontWeight: 600, color: '#111' }}>{u.totalCo2Saved ? `${u.totalCo2Saved} kg CO₂` : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>
    {/* Badge modal with confetti and medal */}
    {modalOpen && (
      <div style={overlayStyle} onClick={() => setModalOpen(false)}>
        <div style={modalStyle} onClick={e => e.stopPropagation()}>
          {/* Medal badge */}
          <img src={badges[currentBadgeIndex].icon} alt="Medal" style={medalStyle}/>
          <h2>Congratulations!</h2>
          <div style={{ marginTop: 12, fontSize: 18, color: '#374151' }}>
            Your Eco Score: <strong style={{ color: '#15803d' }}>{(finalBadgeMetric * 100).toFixed(0)}%</strong>
          </div>
            <div style={{ marginTop: 12, textAlign: 'left', fontSize: 14, color: '#374151', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="https://png.pngtree.com/png-vector/20190214/ourmid/pngtree-people-icon-business-corporate-team-working-together-social-network-png-image_448364.jpg" alt="" style={{ width: 28, height: 28 }} />
                <span style={{ fontSize: 16 }}><strong>Groups Joined:</strong> {totalGroups}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="https://cdn-icons-png.flaticon.com/512/573/573378.png" alt="" style={{ width: 28, height: 28 }} />
                <span style={{ fontSize: 16 }}><strong>Total CO₂ Saved:</strong> {totalCo2Saved} kg</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="https://static.vecteezy.com/system/resources/thumbnails/027/800/271/small_2x/green-background-eco-friendly-logo-or-icon-eco-friendly-logo-vector.jpg" alt="" style={{ width: 28, height: 28 }} />
                <span style={{ fontSize: 16 }}><strong>Products Ordered:</strong> {totalProductsOrdered}</span>
              </div>
            </div>
          <div style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
            This score reflects your sustainability impact through plastic reduction, CO₂ savings, and group participation.
          </div>
          {/* Confetti elements */}
          <div style={confettiContainerStyle}>
            {[...Array(30)].map((_, i) => <div key={i} style={randomConfettiStyle()}/>)}
          </div>
          <button onClick={() => setModalOpen(false)} style={closeBtnStyle}>Close</button>
        </div>
        <style>
          {`@keyframes drop { 0% { transform: translateY(-100%) } 100% { transform: translateY(200%) } }`}
        </style>
      </div>
    )}

    {/* Carbon Modal */}
    {carbonModalOpen && (
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}
        onClick={() => setCarbonModalOpen(false)}
      >
        <div
          style={{
            position: 'relative',
            width: '80%',
            maxWidth: '700px',
            padding: '40px',
            borderRadius: '16px',
            backgroundImage: 'url(images/image.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            padding: '32px',
            borderRadius: '12px',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            color: '#111'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>{totalCo2Saved} kg</div>
              <div style={{ fontSize: 16 }}>of carbon emissions saved this month</div>
            </div>

            {/* Equivalent saving */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16 }}>This is equivalent to saving</span>
                <strong style={{ fontSize: 16 }}>{(totalCo2Saved/22).toFixed(2) } trees</strong>
              </div>

              {/* Organisation total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGcGcTybXMnKN7zqWlTHKSk9Jh1rK-VCyvjg&s"
                    alt="Org"
                    style={{ width: 24, marginRight: 12 }}
                  />
                  <span style={{ fontSize: 16 }}>Total carbon emissions saved by your organisation</span>
                </div>
               { /*Edit */}
                <strong style={{ fontSize: 16 }}>{1471} kg</strong> 
              </div>

            {/* Conversion list */}
              <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#1f2937' }}>
                  10 kg CO₂ is equal to:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src="https://static.thenounproject.com/png/1497232-200.png" alt="Petrol Icon" style={{ width: 32, height: 32 }} />
                    <span style={{ fontSize: 18, color: '#111827' }}>4.35 litres of petrol saved</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src="https://www.shutterstock.com/image-vector/cng-gas-tank-icon-compressed-600nw-2526843447.jpg" alt="CNG Icon" style={{ width: 32, height: 32 }} />
                    <span style={{ fontSize: 18, color: '#111827' }}>5 litres of CNG saved</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/5974/5974156.png" alt="Recycle Icon" style={{ width: 32, height: 32 }} />
                    <span style={{ fontSize: 18, color: '#111827' }}>3.5 kg of waste recycled</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCarbonModalOpen(false)}
              style={{
                marginTop: '24px',
                padding: '12px 24px',
                background: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
