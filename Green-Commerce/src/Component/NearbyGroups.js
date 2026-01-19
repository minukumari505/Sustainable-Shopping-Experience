import React, { useEffect, useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import '../Css/NearbyGroups.css';

const NearbyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const [groupCount, setGroupCount] = useState(0);
  const [radiusKm, setRadiusKm] = useState(5);

  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const email = localStorage.getItem("email");
  const userEmail = email;

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        try {
          const res = await axios.get(
            `http://localhost:8080/group/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setGroups(res.data);
        } catch (err) {
          console.error("Error fetching nearby groups:", err);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Please enable location to see nearby groups.");
      }
    );
  }, [token, radiusKm]);

  const joinGroup = async (groupId) => {
    try {
      // Join the group
      await axios.post(
        `http://localhost:8080/group/join/${groupId}`,
        { user: email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // ✅ Fetch group data to extract cart items for the order
      const groupRes = await axios.get(`http://localhost:8080/group/${groupId}`);
      const group = groupRes.data;

      // ✅ Prepare order structure based on your schema
      const orderItems = group.cartItems.map(item => ({
        productId: item.id || item._id || 'unknown', // fallback if id not present
        name: item.title || item.name,
        description: item.description || '',
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1
      }));

      const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const orderPayload = {
        userEmail: email,
        items: orderItems,
        totalAmount,
        ecoPackaging: true, // or false if you want to let user decide
        deliveryDate: group.deadline, // optional mapping
        address: group.locationName || 'Unknown'
      };

      // ✅ Send to Order DB
      await axios.post("http://localhost:8080/place-order", orderPayload);

      // ✅ Celebrate
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        emojis: ['🛍️', '📦', '🎉']
      });

      // ✅ Store and show badge
      const existing = JSON.parse(localStorage.getItem('myGroups') || '[]');
      const updated = [...existing, { id: groupId }];
      localStorage.setItem('myGroups', JSON.stringify(updated));
      setGroupCount(updated.length);
      setShowBadge(true);
    } catch (err) {
      console.error("Join Group Error:", err);
      alert(err.response?.data?.message || "Failed to join group.");
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 24,
        background: '#A5D6A7',
        fontFamily: 'Segoe UI, sans-serif',
        color: '#233d4a'
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>📦 Nearby Group Orders</h1>

      {/* Radius Slider */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, color: '#1f2a33' }}>
          🔍 Show within <span style={{ color: '#2e7d32' }}>{radiusKm} km</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={radiusKm}
          onChange={(e) => setRadiusKm(+e.target.value)}
          style={{
            width: '100%',
            marginTop: 8,
            accentColor: '#2e7d32',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Groups Grid */}
      {userLocation && groups.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))',
            gap: 24
          }}
        >
          {groups.map((g) => {
            const isMember = g.members.includes(userEmail);
            const daysLeft = Math.max(
              0,
              Math.ceil((new Date(g.deadline) - Date.now()) / (1000 * 60 * 60 * 24))
            );

            return (
              <div
                key={g._id}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ padding: 16 }}>
                  <h2 style={{ margin: 0, marginBottom: 8, fontSize: 20 }}>
                    {g.name}
                  </h2>
                  <span
                    style={{
                      display: 'inline-block',
                      background: g.isClosed ? '#FFB74D' : '#A5D6A7',
                      color: '#fff',
                      borderRadius: 20,
                      padding: '4px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 12
                    }}
                  >
                    {g.isClosed ? 'Closed' : `${daysLeft} day(s) left`}
                  </span>
                  <p style={{ margin: '8px 0', fontSize: 14 }}>
                    📍 <strong>Location:</strong> {g.locationName || 'Unknown'}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: 14 }}>
                    👥 <strong>Members:</strong> {g.members.length}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: 14 }}>
                    🗓 <strong>Deadline:</strong>{' '}
                    {new Date(g.deadline).toLocaleDateString()}
                  </p>
                  <p style={{ margin: '4px 0 16px', fontSize: 14 }}>
                    🔗{' '}
                    <a
                      href={g.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2e7d32', textDecoration: 'none' }}
                    >
                      {g.link}
                    </a>
                  </p>
                  <button
                    disabled={isMember}
                    onClick={() => !isMember && joinGroup(g._id)}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      background: isMember ? '#ccc' : '#2e7d32',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      cursor: isMember ? 'default' : 'pointer',
                      fontWeight: 600,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => {
                      if (!isMember) e.currentTarget.style.background = '#276b2b';
                    }}
                    onMouseLeave={e => {
                      if (!isMember) e.currentTarget.style.background = '#2e7d32';
                    }}
                  >
                    {isMember ? 'Already a Member' : 'Join Group'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        userLocation && (
          <p style={{ color: '#555', fontStyle: 'italic' }}>
            No groups found within {radiusKm} km.
          </p>
        )
      )}

      {/* Success Badge */}
      {showBadge && (
        <div
          onClick={() => setShowBadge(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              padding: 32,
              borderRadius: 12,
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              maxWidth: 320,
              width: '90%'
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/763/763673.png"
              alt="Badge"
              style={{ width: 80, marginBottom: 16 }}
            />
            <h2 style={{ margin: '8px 0', color: '#2e7d32' }}>
              🎉 You joined a group!
            </h2>
            <p style={{ marginBottom: 24, fontSize: 15 }}>
              🏅 You’ve joined <strong>{groupCount}</strong> group
              {groupCount > 1 ? 's' : ''}!
            </p>
            <button
              onClick={() => navigate('/my-groups')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2e7d32',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#276b2b'}
              onMouseLeave={e => e.currentTarget.style.background = '#2e7d32'}
            >
              Go to My Groups
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default NearbyGroups;