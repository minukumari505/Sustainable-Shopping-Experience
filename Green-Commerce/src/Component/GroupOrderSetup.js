import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Css/GroupOrder.css';
import axios from 'axios';
import { useStateValue } from "../StateProvider";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const formatCoords = (latitude, longitude) =>
  `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`;

const GOOGLE_GEOCODING_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const GOOGLE_GEOCODING_API_URL =
  process.env.REACT_APP_GOOGLE_GEOCODING_API_URL || 'https://maps.googleapis.com/maps/api/geocode/json';

const locationErrorMessages = {
  1: 'Location permission was denied. Please allow location access and try again.',
  2: 'Your location is unavailable. Turn on device location/Wi-Fi and try again.',
  3: 'Location request timed out. Please try again.'
};

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000
    });
  });

const fetchGoogleCurrentLocation = async () => {
  if (!GOOGLE_GEOCODING_KEY) {
    throw new Error('Missing REACT_APP_GOOGLE_MAPS_API_KEY');
  }

  const response = await fetch(
    `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_GEOCODING_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ considerIp: true })
    }
  );

  const data = await response.json();
  if (!response.ok || !data.location) {
    throw new Error(data.error?.message || 'Google current location lookup failed');
  }

  return {
    latitude: Number(data.location.lat),
    longitude: Number(data.location.lng),
    label: formatCoords(Number(data.location.lat), Number(data.location.lng))
  };
};

const geocodeWithGoogle = async (address) => {
  if (!GOOGLE_GEOCODING_KEY) {
    throw new Error('Missing REACT_APP_GOOGLE_MAPS_API_KEY');
  }

  const response = await fetch(
    `${GOOGLE_GEOCODING_API_URL}?address=${encodeURIComponent(address)}&key=${GOOGLE_GEOCODING_KEY}`
  );
  const data = await response.json();

  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(data.error_message || `Google geocoding failed: ${data.status}`);
  }

  const result = data.results[0];
  return {
    latitude: Number(result.geometry.location.lat),
    longitude: Number(result.geometry.location.lng),
    label: result.formatted_address || address
  };
};

const reverseGeocodeWithBigDataCloud = async (latitude, longitude) => {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  if (!response.ok) {
    throw new Error('BigDataCloud reverse geocoding failed');
  }

  const data = await response.json();
  const label = [
    data.locality || data.city,
    data.principalSubdivision,
    data.postcode,
    data.countryName
  ].filter(Boolean).join(', ');

  if (!label) {
    throw new Error('BigDataCloud did not return an address');
  }

  return label;
};

const reverseGeocodeWithOpenStreetMap = async (latitude, longitude) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
  );

  if (!response.ok) {
    throw new Error('OpenStreetMap reverse geocoding failed');
  }

  const data = await response.json();
  if (!data.display_name) {
    throw new Error('OpenStreetMap did not return an address');
  }

  return data.display_name;
};

const reverseGeocodeWithGoogle = async (latitude, longitude) => {
  if (!GOOGLE_GEOCODING_KEY) {
    throw new Error('Missing REACT_APP_GOOGLE_MAPS_API_KEY');
  }

  const response = await fetch(
    `${GOOGLE_GEOCODING_API_URL}?latlng=${latitude},${longitude}&key=${GOOGLE_GEOCODING_KEY}`
  );
  const data = await response.json();

  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(data.error_message || `Google reverse geocoding failed: ${data.status}`);
  }

  return data.results[0].formatted_address;
};

const geocodeWithOpenStreetMap = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(address)}`
  );
  const data = await response.json();

  if (!Array.isArray(data) || !data.length) {
    throw new Error('OpenStreetMap geocoding failed');
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
    label: data[0].display_name || address
  };
};

const getIndiaPostAddress = async (pincode) => {
  const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  const data = await response.json();
  const postOffice = data?.[0]?.PostOffice?.[0];

  if (!postOffice) {
    throw new Error('Pincode not found in India Post');
  }

  return [
    postOffice.Name,
    postOffice.District,
    postOffice.State,
    postOffice.Pincode,
    'India'
  ].filter(Boolean).join(', ');
};

const parseCoordinateInput = (value) => {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) {
    return null;
  }

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error('Coordinates must be valid latitude and longitude values');
  }

  return { latitude, longitude };
};

const resolveManualAddress = async (address) => {
  const cleanAddress = address.trim();
  const coordinates = parseCoordinateInput(cleanAddress);
  if (coordinates) {
    let label = formatCoords(coordinates.latitude, coordinates.longitude);

    try {
      label = await reverseGeocodeWithBigDataCloud(coordinates.latitude, coordinates.longitude);
    } catch (bigDataErr) {
      console.warn('BigDataCloud coordinate lookup failed:', bigDataErr);

      try {
        label = await reverseGeocodeWithOpenStreetMap(coordinates.latitude, coordinates.longitude);
      } catch (osmErr) {
        console.warn('OpenStreetMap coordinate lookup failed:', osmErr);
      }
    }

    return { ...coordinates, label };
  }

  const isIndianPincode = /^[1-9]\d{5}$/.test(cleanAddress);
  const queries = isIndianPincode
    ? [cleanAddress, `${cleanAddress}, India`, `pincode ${cleanAddress}, India`]
    : [cleanAddress, `${cleanAddress}, India`];

  if (isIndianPincode) {
    try {
      queries.unshift(await getIndiaPostAddress(cleanAddress));
    } catch (err) {
      console.warn('India Post lookup failed:', err);
    }
  }

  for (const query of queries) {
    try {
      return await geocodeWithGoogle(query);
    } catch (googleErr) {
      console.warn('Google manual geocode failed:', googleErr);
    }

    try {
      return await geocodeWithOpenStreetMap(query);
    } catch (osmErr) {
      console.warn('OpenStreetMap manual geocode failed:', osmErr);
    }
  }

  throw new Error('All manual location lookups failed');
};

const GroupOrderSetup = () => {
  useLocation();
  const navigate = useNavigate();
  const [{ basket }, dispatch] = useStateValue();
  const [groupName, setGroupName] = useState('My Eco Group');
  const [deadlineDays, setDeadlineDays] = useState(3);
  const [showBadge, setShowBadge] = useState(false);
  const [groupCount, setGroupCount] = useState(0);
  const [coords, setCoords] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locationStatus, setLocationStatus] = useState('Detecting your location...');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [isResolvingManualLocation, setIsResolvingManualLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");

  const fakeGroupLink = `https://green-commerce.com/group/${encodeURIComponent(groupName.replace(/\s+/g, '-').toLowerCase())}`;

  const setDetectedLocation = useCallback((latitude, longitude, label) => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error('Location lookup returned invalid coordinates');
    }

    const fallbackLocation = formatCoords(latitude, longitude);
    setCoords({ lat: latitude, lng: longitude });
    setLocationName(label || fallbackLocation);
  }, []);

  const reverseGeocode = useCallback(async (latitude, longitude) => {
    const providers = GOOGLE_GEOCODING_KEY
      ? [reverseGeocodeWithGoogle, reverseGeocodeWithBigDataCloud, reverseGeocodeWithOpenStreetMap]
      : [reverseGeocodeWithBigDataCloud, reverseGeocodeWithOpenStreetMap];

    for (const provider of providers) {
      try {
        const address = await provider(latitude, longitude);
        setLocationName(address);
        setLocationStatus('Location ready.');
        return;
      } catch (err) {
        console.warn('Reverse geocoding provider failed:', err);
      }
    }

    setLocationStatus('Address not found. Exact coordinates will be used.');
  }, []);

    const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationStatus('Browser location is not supported. Trying approximate location...');
    }

    setIsDetectingLocation(true);
    setLocationStatus('Detecting your location...');
    setLocationName('');

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      setDetectedLocation(latitude, longitude);
      setLocationStatus('Location detected. Finding address...');

      try {
        await reverseGeocode(latitude, longitude);
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        setLocationStatus('Address lookup failed. Coordinates will be used.');
      }
    } catch (err) {
      console.error("Location error", err);
      setLocationStatus(locationErrorMessages[err?.code] || 'Device location failed. Trying Google location service...');

      try {
        const googleLocation = await fetchGoogleCurrentLocation();
        setDetectedLocation(googleLocation.latitude, googleLocation.longitude, googleLocation.label);

        try {
          await reverseGeocode(googleLocation.latitude, googleLocation.longitude);
        } catch (reverseErr) {
          console.error("Google fallback reverse geocoding failed:", reverseErr);
          setLocationStatus('Location ready with coordinates.');
        }
      } catch (googleErr) {
        console.error("Google location service failed:", googleErr);
        setCoords(null);
        setLocationName('');
        setLocationStatus('Unable to detect location automatically. Enter city, pincode, or lat,lng manually.');
      }
    } finally {
      setIsDetectingLocation(false);
    }
  }, [reverseGeocode, setDetectedLocation]);

  const handleManualLocation = async () => {
    const address = manualLocation.trim();
    if (!address) {
      return alert('Please enter your city, area, or full address.');
    }

    setIsResolvingManualLocation(true);
    setLocationStatus('Finding coordinates for entered location...');

    try {
      const result = await resolveManualAddress(address);
      setDetectedLocation(result.latitude, result.longitude, result.label);
      setLocationStatus('Location ready.');
    } catch (err) {
      console.error("Manual location failed:", err);
      setCoords(null);
      setLocationStatus('Could not find that address. Try a more specific city, area, or pincode.');
    } finally {
      setIsResolvingManualLocation(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const getDeadlineDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(deadlineDays));
    return date.toISOString().split('T')[0];
  };

  const handleCreateGroup = async () => {
    setErrorMessage('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    
    if (!email) {
      alert("Please log in before creating a group.");
      return navigate("/login");
    }

    if (!coords) {
      return alert("Location not available yet. Use Retry or enter your city/address.");
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
      locationName: locationName || formatCoords(coords.lat, coords.lng)
    };

    try {
      // Create group
      await axios.post(`${backendUrl}/group/create`, newGroup, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("✅ Group created successfully");

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
        await axios.post(`${backendUrl}/place-order`, orderPayload);
      } catch (orderErr) {
        console.error('Error saving order:', orderErr);
      }

      // Clear basket after group creation
      dispatch({ type: "CLEAR_BASKET" });

      // Fetch updated group count
      const groupRes = await axios.get(`${backendUrl}/group/my-groups`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroupCount(groupRes.data.length);
      setShowBadge(true);

    } catch (err) {
      console.error("Error creating group:", err);
      console.error("Error response:", err.response?.data);
      setErrorMessage(err.response?.data?.error || 'Failed to create group. Please try again.');
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
          { label: 'Join Deadline (days)', ...{ value: deadlineDays, onChange: e => setDeadlineDays(e.target.value), type: 'number' } }
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

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Your Location</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={locationName || locationStatus} style={{
              flex: 1, padding: '12px 14px',
              borderRadius: 8, border: '1px solid #CCC',
              background: '#F9F5F0', fontSize: 15
            }} />
            <button type="button" onClick={detectLocation} disabled={isDetectingLocation} style={{
              background: isDetectingLocation ? '#ccc' : '#A3D56F',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0 16px',
              cursor: isDetectingLocation ? 'default' : 'pointer',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              {isDetectingLocation ? 'Detecting' : 'Retry'}
            </button>
          </div>
          {!coords && !isDetectingLocation && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input
                value={manualLocation}
                onChange={e => setManualLocation(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleManualLocation();
                  }
                }}
                placeholder="Enter lat,lng or city, area, pincode, full address"
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #CCC',
                  background: '#fff',
                  fontSize: 15
                }}
              />
              <button
                type="button"
                onClick={handleManualLocation}
                disabled={isResolvingManualLocation}
                style={{
                  background: isResolvingManualLocation ? '#ccc' : '#66BB6A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0 16px',
                  cursor: isResolvingManualLocation ? 'default' : 'pointer',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {isResolvingManualLocation ? 'Finding' : 'Use Address'}
              </button>
            </div>
          )}
        </div>

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


