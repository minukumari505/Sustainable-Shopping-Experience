import React, { useState, useEffect } from 'react';
import h1 from '../assets/h1.jpg';
import h3 from '../assets/h3.jpg';
import h4 from '../assets/h4.jpg';
import h5 from '../assets/h5.jpg';

export default function ImageSlider() {
  const slides = [
    { id: 'banner', banner: true },
    // { id: 0, value: h1 },
    { id: 1, value: h3 },
    { id: 2, value: h4 },
    // { id: 3, value: h5 },
  ];
  const lastIndex = slides.length - 1;
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex(i => (i < lastIndex ? i + 1 : 0));
  const handlePrev = () => setIndex(i => (i > 0 ? i - 1 : lastIndex));

  // auto-rotate every 4s
  useEffect(() => {
    const id = setInterval(handleNext, 4000);
    return () => clearInterval(id);
  }, []);

  const current = slides[index];

  return (
    <div style={{
      marginBottom: "-8%"
    }}>
      {/* Inject keyframes for banner */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Fixed‐height slider container */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#f2f2f2',
          height: 500,         // ← fixed height
          marginBottom: 24,    // ← space to push products below
        }}
      >
        {current.banner ? (
          /* Banner slide */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',  // fill the 400px
              animation: 'fadeIn 0.8s ease-out',
              color: '#333',
            }}
          >
            <h2 style={{
              fontSize: '2rem',
              margin: 0,
              textAlign: 'center',
            }}>
              Discover our new{' '}
              <span style={{ color: '#279843' }}>
                Green store
              </span>
            </h2>
            <button
              onClick={() => window.location.href = '/green'}
              style={{
                background: '#febd69',
                border: 'none',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                borderRadius: 4,
                animation: 'popIn 0.6s ease-out',
                marginTop: 16,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Learn more →
            </button>
          </div>
        ) : (
          /* Image slide */
          <img
            src={current.value}
            alt={`Slide ${current.id}`}
            style={{
              width: '100%',
              height: '100%',      // fill the 400px
              objectFit: 'cover',  // crop to fit
            }}
          />
        )}

        {/* Prev/Next buttons */}
        <div style={{
          position: 'absolute',
          top: '50%',
          width: '100%',
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}>
          <button
            onClick={handlePrev}
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              width: 48,
              height: 48,
              cursor: 'pointer',
              pointerEvents: 'auto',
              borderRadius: '50%',
            }}
          >‹</button>

          <button
            onClick={handleNext}
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              width: 48,
              height: 48,
              cursor: 'pointer',
              pointerEvents: 'auto',
              borderRadius: '50%',
            }}
          >›</button>
        </div>
      </div>
    </div>
  );
}
