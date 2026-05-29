# Location Detection Troubleshooting

Use this checklist when the app shows:

```text
Unable to detect location automatically. Enter city, pincode, or lat,lng manually.
```

## 1. Enable Windows Location

Go to:

```text
Settings > Privacy & security > Location
```

Turn on:

- Location services
- Let apps access your location
- Let desktop apps access your location

## 2. Allow Location in Browser

In Chrome or Edge:

1. Open the app.
2. Click the lock/site icon near the URL.
3. Set `Location` to `Allow`.
4. Reload the page.

You can also open:

```text
chrome://settings/content/location
```

Make sure the local app URL is not blocked.

## 3. Use Localhost

Browser geolocation works only in secure contexts.

Good:

```text
http://localhost:3000
```

May fail:

```text
file://...
http://192.168.x.x:3000
http://your-ip:3000
```

## 4. Enable Google APIs

The app uses browser geolocation first. If that fails, the code uses Google Geolocation API:

```text
https://www.googleapis.com/geolocation/v1/geolocate
```

This is different from the Geocoding API URL in `.env`:

```text
REACT_APP_GOOGLE_GEOCODING_API_URL=https://maps.googleapis.com/maps/api/geocode/json
```

If Google returns this error:

```text
SERVICE_DISABLED: Geolocation API is disabled
```

Enable these APIs in Google Cloud Console:

- Geolocation API
- Geocoding API

## 5. Check API Key Restrictions

In Google Cloud Console, open the API key settings.

If website restrictions are enabled, allow:

```text
http://localhost:3000/*
http://127.0.0.1:3000/*
```

If API restrictions are enabled, include:

- Geocoding API
- Geolocation API

## 6. Restart React After `.env` Changes

Create React App reads `.env` only when the dev server starts.

After changing `.env`, stop the server and run:

```bash
npm start
```

## Quick Diagnosis

If the same API key works on another laptop, the most common reason is:

- Browser geolocation succeeds on that laptop.
- Browser geolocation fails on this laptop.
- The Google Geolocation API fallback then fails because the API is disabled or restricted.

In that case, fix the local Windows/browser location settings and enable the Google Geolocation API for the project.
