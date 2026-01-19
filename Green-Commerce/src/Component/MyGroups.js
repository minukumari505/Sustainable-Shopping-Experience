import React, { useEffect, useState } from 'react';
import GroupCard from './GroupCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("email");

  useEffect(() => {
    if (!currentUser) {
      alert("Please log in to view your groups.");
      return navigate("/login");
    }

    axios.get('http://localhost:8080/group/my-groups', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      }
    })
      .then((res) => setGroups(res.data))
      .catch((err) => console.error('Failed to fetch groups:', err));
  }, [currentUser, navigate]);

  const handleLeaveGroup = (groupId) => {
    setGroups((prev) => prev.filter(group => group._id !== groupId));
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      background: '#A5D6A7',
      fontFamily: '"Segoe UI", Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: 1000,
        margin: '0 auto 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{
          fontSize: 32,
          color: '#2E3A44',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          📦 My Group Orders
        </h1>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#ffd814',
            color: '#111',
            padding: '12px 24px',
            borderRadius: 6,
            border: 'none',
            fontSize: 16,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
        >
          ← Back to Home
        </button>
      </div>

      {groups.length === 0 && (
        <div style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: 24,
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
          textAlign: 'center',
          color: '#555',
          fontSize: 16
        }}>
          <p>No groups yet. Start one from your cart to get going!</p>
        </div>
      )}

      {groups.length > 0 && (
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))',
            gap: 24,
          }}
        >
          {groups.map(group => (
            <div
              key={group._id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)';
              }}
            >
              {/* colored header */}
              <div style={{
                background: '#A3D56F',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: 18,
                  color: '#fff'
                }}>
                  {group.name}
                </h3>
                {/* pill badge */}
                <span style={{
                  background: group.isClosed ? '#F59E0B' : '#4CAF50',
                  color: '#fff',
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {group.isClosed
                      ? 'Closed'
                     : `${Math.max(0, Math.ceil((new Date(group.deadline) - Date.now()) / (1000 * 60 * 60 * 24)))} day(s) left`
                  }
                </span>
              </div>

              {/* main content */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 14, color: '#333', lineHeight: 1.4 }}>
                  📍 <strong>Location:</strong> {group.locationName}
                </div>
                <div style={{ fontSize: 14, color: '#333' }}>
                  👥 <strong>Members:</strong> {group.members.length}
                </div>
                <div style={{ fontSize: 14, color: '#333' }}>
                  📅 <strong>Deadline:</strong> {new Date(group.deadline).toLocaleDateString()}
                </div>
                <div style={{ fontSize: 14, color: '#4CAF50', wordBreak: 'break-all' }}>
                  🔗 <strong>Link:</strong>{' '}
                  <a href={group.link} style={{ color: '#4CAF50', textDecoration: 'none' }}>
                    {group.link}
                  </a>
                </div>
              </div>

              {/* action footer */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => handleLeaveGroup(group._id)}
                  style={{
                    background: '#EF4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 14px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#DC2626'}
                  onMouseLeave={e => e.currentTarget.style.background = '#EF4444'}
                >
                  ✖ Leave Group
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyGroups;