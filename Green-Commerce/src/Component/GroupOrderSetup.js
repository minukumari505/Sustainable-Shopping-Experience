import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Css/GroupOrder.css';
import axios from 'axios';
import { useStateValue } from "../StateProvider";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GroupOrderSetup = () => {
  const [showToast, setShowToast] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();
  const [{ basket }, dispatch] = useStateValue();
  const cartItems = state?.cartItems || [];
  const [groupName, setGroupName] = useState('My Eco Group');
  const [deadlineDays, setDeadlineDays] = useState(3);
  const [showBadge, setShowBadge] = useState(false);
  const [groupCount, setGroupCount] = useState(0);
  const [coords, setCoords] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");

  const fakeGroupLink = `https://green-commerce.com/group/${encodeURIComponent(groupName.replace(/\s+/g, '-').toLowerCase())}`;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        // Reverse Geocoding
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCliTDgdPUC04xTYS6RDXsbbKIYR5Ir5W0`
          );
          const data = await response.json();
          if (data.status === 'OK') {
            const address = data.results[0].formatted_address;
            setLocationName(address);
          } else {
            setLocationName('Location not found');
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          setLocationName('Error getting location');
        }
      },
      (err) => {
        console.error("Location access denied", err);
        alert("Location permission is required to create a group.");
      }
    );
  }, []);

  const getDeadlineDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(deadlineDays));
    return date.toISOString().split('T')[0];
  };

  const handleCreateGroup = async () => {
    setErrorMessage('');
    if (!email) {
      alert("Please log in before creating a group.");
      return navigate("/login");
    }

    if (!coords) {
      return alert("Location not available yet.");
    }

    const deadline = getDeadlineDate();

    if (
      typeof coords.lat !== 'number' ||
      typeof coords.lng !== 'number' ||
      isNaN(coords.lat) ||
      isNaN(coords.lng)
    ) {
      return alert("Invalid coordinates. Please wait for location detection.");
    }
    
    const newGroup = {
      name: groupName,
      link: fakeGroupLink,
      deadline,
      cartItems: basket,
      members: [email],
      latitude: coords.lat,
      longitude: coords.lng,
      location: {
        type: 'Point',
        coordinates: [coords.lng, coords.lat]
      },
      locationName
    };

    try {
      // Create group
      await axios.post('http://localhost:8080/group/create', newGroup, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      try {
        const orderPayload = {
          userEmail: email,
          items: basket.map(item => ({
            productId: item.productId || item.id || '',
            name: item.title || item.name,
            description: item.description || '',
            image: item.image,
            price: item.price,
            quantity: item.quantity || 1,
          })),
          ecoPackaging: false,
          placedAt: new Date(),
          totalAmount: basket.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
          address: locationName,
          deliveryDate: deadline
        };
        await axios.post('http://localhost:8080/place-order', orderPayload);
      } catch (orderErr) {
        console.error('Error saving order:', orderErr);
      }

      // Clear basket after group creation
      dispatch({ type: "CLEAR_BASKET" });

      // Fetch updated group count
      const groupRes = await axios.get('http://localhost:8080/group/my-groups', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroupCount(groupRes.data.length);
      setShowBadge(true);

    } catch (err) {
      console.error("Error creating group:", err);
      setErrorMessage('Failed to create group. Please try again.');
    }
  };

  return (
    
    <div style={{ background: 'linear-gradient(transparent, #f3f9f4)',width:'100%'}}>
      <div style={{
        maxWidth: 720,
        margin: '40px auto',
        padding: 32,
        borderRadius: 16,
        background: `url('https://www.transparenttextures.com/patterns/soft-wallpaper.png') #F0EEE9`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        fontFamily: '"Segoe UI",sans-serif'
      }}>
        <h1 style={{ color: '#2E7D32', marginBottom: 4 }}>🛠 Create Group Order</h1>
        <p style={{ color: '#555', marginBottom: 24 }}>
          Invite friends to place a group order and earn eco rewards!
        </p>

        {[
          { label: 'Group Name', ...{ value: groupName, onChange: e => setGroupName(e.target.value), type: 'text' } },
          { label: 'Join Deadline (days)', ...{ value: deadlineDays, onChange: e => setDeadlineDays(e.target.value), type: 'number' } },
          { label: 'Your Location', ...{ value: locationName || 'Detecting...', readOnly: true } }
        ].map((f, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{f.label}</label>
            <input {...f} style={{
              width: '100%', padding: '12px 14px',
              borderRadius: 8, border: '1px solid #CCC',
              background: '#F9F5F0', fontSize: 15
            }}
              onFocus={e => e.currentTarget.style.borderColor = '#A3D56F'}
              onBlur={e => e.currentTarget.style.borderColor = '#CCC'} />
          </div>
        ))}

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 12, color: '#2E7D32' }}>Your Cart ({basket.length} items)</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {basket.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: 12, background: '#fff', borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <img src={item.image} alt='' style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#333' }}>{item.title}</div>
                  <div style={{ color: '#666', fontSize: 14 }}>Qty: {item.quantity || 1}</div>
                  <div style={{ color: '#A3D56F', fontWeight: 600 }}>₹{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 8, color: '#2E7D32' }}>📤 Share this link:</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={fakeGroupLink} style={{
              flex: 1, padding: '12px 14px', borderRadius: 8, border: '1px solid #CCC', background: '#F9F5F0'
            }} />
            <button onClick={() => {
              navigator.clipboard.writeText(fakeGroupLink)
              toast.success('Link copied to clipboard!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                pauseOnHover: false,
                closeOnClick: true,
              })
            }} style={{
              background: '#A3D56F', color: '#fff', border: 'none', borderRadius: 8,
              padding: '0 20px', cursor: 'pointer', fontWeight: 600
            }}>Copy</button>
          </div>
        </div>

        {errorMessage && <div style={{ color: 'red', marginBottom: 12 }}>{errorMessage}</div>}

        <button onClick={handleCreateGroup} style={{
          width: '100%', padding: '14px 0', fontSize: 16, fontWeight: 600,
          color: '#fff', background: 'linear-gradient(90deg,#A3D56F,#66BB6A)',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          ✅ Create Group
        </button>

        {showBadge && (
          <div onClick={() => setShowBadge(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: '#fff', padding: 24, borderRadius: 12,
              textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <img src='https://cdn-icons-png.flaticon.com/512/763/763673.png'
                alt='' style={{ width: 72, marginBottom: 12 }} />
              <h2 style={{ marginBottom: 8, color: '#2E7D32' }}>🎉 Badge Unlocked!</h2>
              <p style={{ marginBottom: 20 }}>You’re Group Champion of {groupCount} order{groupCount > 1 ? 's' : ''}</p>
              <button onClick={() => navigate('/my-groups')} style={{
                background: '#A3D56F', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600
              }}>View My Groups</button>
            </div>
          </div>
        )}
      </div>
     </div>
    
  );
};

export default GroupOrderSetup;