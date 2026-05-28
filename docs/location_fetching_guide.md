# Location Fetching Guide

## Overview
This document explains the setup and requirements for location fetching functionality in the Sustainable Shopping Experience app, specifically for the Group Order Setup feature.

---

## 📍 Components Involved

### Frontend Component
- **File**: `Green-Commerce/src/Component/GroupOrderSetup.js`
- **Purpose**: Fetches user's current location and reverse geocodes it to get the address

### Backend Requirements
- Node.js + Express server running on `http://localhost:8080`
- MongoDB with GeoJSON support for storing location coordinates

---

## 🔑 API Key Configuration

### Google Maps API Key (Current)
```
API Key: AIzaSyA51_LzzoZcX0XXbCjNHcs_s3UoHS6dv-o
```

### Enabled APIs
The following APIs must be **enabled** in Google Cloud Console:

1. ✅ **Geocoding API** - For reverse geocoding (latitude/longitude → address)
2. ✅ **Maps JavaScript API** - For map-related features
3. ✅ **Geolocation API** - For user location detection

### API Key Restrictions
- **Type**: Geocoding API
- **Usage**: Reverse geocoding to convert coordinates to readable addresses
- **Rate Limit**: 50 requests per second
- **Quota**: 25,000 requests per day (free tier)

---

## 🌐 How Location Fetching Works

### Step-by-Step Process

```
1. User navigates to /group-order-setup
   ↓
2. Browser requests location permission
   ↓
3. Geolocation API gets latitude & longitude
   ↓
4. Reverse Geocoding API converts coords to address
   ↓
5. Address displayed in "Your Location" field
   ↓
6. Location data saved with group order in MongoDB
```

### Code Flow (GroupOrderSetup.js)

```javascript
// 1. Get user's coordinates
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;
  setCoords({ lat: latitude, lng: longitude });
  
  // 2. Call Google Maps Geocoding API
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA51_LzzoZcX0XXbCjNHcs_s3UoHS6dv-o`
  );
  
  // 3. Parse response and set location name
  const data = await response.json();
  if (data.status === 'OK') {
    setLocationName(data.results[0].formatted_address);
  }
});
```

---

## 🔄 Geocoding vs Reverse Geocoding

### Geocoding
**Converts an ADDRESS into COORDINATES (Latitude & Longitude)**

**Input**: "123 Main Street, New York, NY 10001"  
**Output**: `{ lat: 40.7128, lng: -74.0060 }`

**Use Case**: When you have a street address and need to find its location on a map
**Example**: User enters their address in a form → App converts it to coordinates

### Reverse Geocoding
**Converts COORDINATES (Latitude & Longitude) into an ADDRESS**

**Input**: `{ lat: 40.7128, lng: -74.0060 }`  
**Output**: "123 Main Street, New York, NY 10001, USA"

**Use Case**: When you have GPS coordinates and need to display a human-readable address
**Example**: 
- ✅ User's browser detects GPS location → Get coordinates
- ✅ App uses coordinates to find nearby places
- ✅ Convert coordinates to readable address (street name, city)

### In This Project

We're using **REVERSE GEOCODING**:

```
User's Browser
    ↓
Gets GPS Coordinates (lat, lng) via Geolocation API
    ↓
Sends coordinates to Google Maps Geocoding API
    ↓
API returns formatted address
    ↓
Display "Your Location: 123 Main Street, New York, NY" in UI
```

### Comparison Table

| Aspect | Geocoding | Reverse Geocoding |
|--------|-----------|-------------------|
| **Input** | Address (text) | Coordinates (lat, lng) |
| **Output** | Coordinates | Address (text) |
| **API Used** | Geocoding API | Geocoding API (same API) |
| **In GroupOrderSetup** | Not used currently | ✅ Used to find location name |
| **Common Use** | Address search, maps | GPS tracking, location detection |
| **Example** | "Find 123 Main St" | "What's the address at 40.71°N, 74.00°W?" |

### API Endpoint Format

**Reverse Geocoding (Used in this project):**
```
https://maps.googleapis.com/maps/api/geocode/json?latlng=LATITUDE,LONGITUDE&key=API_KEY
```

**Geocoding (For future use):**
```
https://maps.googleapis.com/maps/api/geocode/json?address=ADDRESS&key=API_KEY
```

---

## ✅ Browser Permissions Required

### Chrome/Edge/Firefox
When visiting the page, users will see a popup asking for:
- **"Allow [site] to access your location?"**
  - ✅ Click "Allow" to enable location services
  - ❌ Click "Block" to deny (location won't work)

### Mobile Devices
- iOS: Settings → Privacy → Location Services → App Permission
- Android: Settings → Apps → Permissions → Location

---

## 🛠️ Setup Checklist

### 1. Google Cloud Console Setup
- [ ] Create Google Cloud Project
- [ ] Enable Geocoding API
- [ ] Enable Maps JavaScript API
- [ ] Create API Key
- [ ] Add API key to `GroupOrderSetup.js`
- [ ] Set API key restrictions (optional for production)

### 2. Frontend Setup
- [ ] React app running on `http://localhost:3000`
- [ ] Location permission popup enabled in browser
- [ ] API key added in code

### 3. Backend Setup
- [ ] Node.js server running on `http://localhost:8080`
- [ ] MongoDB connected with GeoJSON indexes
- [ ] Routes: `/group/create`, `/place-order`

### 4. Database Schema
```javascript
// Group Schema with GeoJSON location
{
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]  // GeoJSON format
  },
  locationName: String,  // Human-readable address
  latitude: Number,
  longitude: Number
}
```

---

## 📊 API Response Structure

### Successful Geocoding Response
```json
{
  "status": "OK",
  "results": [
    {
      "formatted_address": "123 Main Street, New York, NY 10001, USA",
      "geometry": {
        "location": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      }
    }
  ]
}
```

### Error Response
```json
{
  "status": "ZERO_RESULTS",
  "error_message": "Geocoding API not enabled"
}
```

---

## 🐛 Troubleshooting

### Issue 1: "Location not found"
**Cause**: Google Maps API key invalid or Geocoding API not enabled
**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Geocoding API
3. Verify API key in GroupOrderSetup.js

### Issue 2: "Location permission denied"
**Cause**: User clicked "Block" on permission popup
**Solution**:
1. Go to browser address bar → Click lock icon
2. Change Location permission to "Allow"
3. Refresh the page

### Issue 3: "Error getting location"
**Cause**: Network error or fetch failed
**Solution**:
1. Check internet connection
2. Open Chrome DevTools (F12) → Console
3. Look for error messages
4. Verify API key is correct

### Issue 4: Coordinates showing instead of address
**Cause**: Geocoding API failed, using fallback
**Solution**:
1. Check browser console for API error
2. Verify API quota not exceeded
3. Regenerate API key if needed

---

## 🔒 Security & Best Practices

### For Production
1. **Restrict API Key** to only Geocoding API
2. **Add Domain Whitelist** to prevent misuse
3. **Never expose key** in frontend code (consider backend proxy)
4. **Implement rate limiting** on backend
5. **Monitor API usage** in Google Cloud Console

### For Development
- Current key is restricted to development domains
- Keep key in code only for testing
- Consider using `.env` variables for production

---

## 📝 Environment Variables Configuration

### Frontend (.env in Green-Commerce/)

Create a `.env` file in `Green-Commerce/` directory:

```env
# Google Maps API Configuration
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyA51_LzzoZcX0XXbCjNHcs_s3UoHS6dv-o
REACT_APP_GOOGLE_GEOCODING_API_URL=https://maps.googleapis.com/maps/api/geocode/json

# Location Settings
REACT_APP_GEOLOCATION_ENABLED=true
REACT_APP_GEOLOCATION_TIMEOUT=10000
REACT_APP_REVERSE_GEOCODING_ENABLED=true

# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8080
```

**Reference**: [Green-Commerce/.env](../Green-Commerce/.env)

### Backend (.env in backend/)

Create/Update `.env` file in `backend/` directory:

```env
PORT=8080
mongo_uri=mongodb+srv://vishalsaw1092003:3oRZZ9pxUMqNhrXA@cluster0.pj1hzov.mongodb.net/deployed-Amazon-Hackon
secret_key=shivam+vishal

# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=AIzaSyA51_LzzoZcX0XXbCjNHcs_s3UoHS6dv-o
GOOGLE_GEOCODING_API_URL=https://maps.googleapis.com/maps/api/geocode/json

# Location Settings
GEOLOCATION_ENABLED=true
GEOLOCATION_TIMEOUT=10000
REVERSE_GEOCODING_ENABLED=true

# Frontend API URL
FRONTEND_URL=http://localhost:3000
```

**Reference**: [backend/.env](../backend/.env)

### Environment Variable Usage in Code

#### Frontend (GroupOrderSetup.js)
```javascript
// Google Maps API Key
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Geocoding API URL
const geocodingUrl = process.env.REACT_APP_GOOGLE_GEOCODING_API_URL || 'https://maps.googleapis.com/maps/api/geocode/json';

// Backend URL
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
```

### Example Files
- `.env.example` in `Green-Commerce/` - Template for frontend
- `.env.example` in `backend/` - Template for backend

---

## 🔒 Security & Best Practices

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `Green-Commerce/src/Component/GroupOrderSetup.js` | Main location fetching component |
| `backend/storageSchema/group.js` | MongoDB group schema with location |
| `backend/routes/group.js` | Group creation API routes |
| `docs/location_fetching_guide.md` | This file |

---

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [Geolocation API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [GeoJSON Format](https://tools.ietf.org/html/rfc7946)

---

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Review troubleshooting section above
3. Verify all APIs are enabled in Google Cloud Console
4. Check MongoDB connection for location storage

---

**Last Updated**: May 28, 2026
**API Key Status**: ✅ Active
**Current Implementation**: GroupOrderSetup component with reverse geocoding
