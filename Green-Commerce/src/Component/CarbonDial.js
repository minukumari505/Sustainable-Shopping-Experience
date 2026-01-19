// src/Component/CarbonDial.js

import React, { useEffect, useRef } from 'react';

export function CarbonDial({ value, goal, label = 'CO₂ Saved (kg)' }) {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  const radius = 70;
  const strokeWidth = 14;
  const r = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  const svgRef = useRef(null);

  // animate on mount
  useEffect(() => {
    const circle = svgRef.current.querySelector('.progress');
    if (circle) {
      circle.style.transition = 'stroke-dashoffset 1s ease-out';
      circle.style.strokeDashoffset = offset;
    }
  }, [offset]);

  const container = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#ffffff',
    padding: 24,
    borderRadius: 20,
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    width: 220,
    marginLeft: '100px',
  };
  const svgStyle = { transform: 'rotate(-90deg)', overflow: 'visible' };
  const pctStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 28,
    fontWeight: '700',
    fill: '#1f2937',
  };
  const valueStyle = {
    marginTop: 12,
    fontSize: 20,
    fontWeight: 600,
    color: '#16a34a',
  };
  const labelStyle = {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  };

  return (
    <div style={container}>
      <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }} ref={svgRef}>
        <svg width={radius * 2} height={radius * 2} style={svgStyle}>
          <defs>
            <linearGradient id="dial-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx={radius}
            cy={radius}
            r={r}
            stroke="#f3f4f6"
            fill="none"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress */}
          <circle
            className="progress"
            cx={radius}
            cy={radius}
            r={r}
            stroke="url(#dial-gradient)"
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
          />
        </svg>
        <text x="50%" y="50%" style={pctStyle}>{pct}%</text>
      </div>
      <div style={valueStyle}>{value} kg</div>
      <div style={labelStyle}>{label}</div>
    </div>
  );
}