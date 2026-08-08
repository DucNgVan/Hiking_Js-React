import { useState, useEffect, useRef, useMemo } from 'react';
import { subscribeLiveGps, getCurrentGpsLocation } from '../services/locationService';
import { MAPBOX_ACCESS_TOKEN } from '../config';

const VIETNAM_DEFAULT_LAT = 16.047079;
const VIETNAM_DEFAULT_LNG = 108.206230;

export const useMapController = () => {
  const [userGps, setUserGps] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('Initializing Live GPS...');
  const [isLocating, setIsLocating] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const webViewRef = useRef(null);
  const locationSubscriptionRef = useRef(null);
  const initialSyncRef = useRef(false);
  const lastGpsRef = useRef(null);

  // Filter out microscopic GPS jitter (< 8 meters movement)
  const isSignificantMovement = (newGps) => {
    if (!lastGpsRef.current) return true;
    const latDiff = Math.abs(newGps.lat - lastGpsRef.current.lat);
    const lngDiff = Math.abs(newGps.lng - lastGpsRef.current.lng);
    return latDiff > 0.00008 || lngDiff > 0.00008;
  };

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const gps = await getCurrentGpsLocation();
      if (gps) {
        setUserGps(gps);
        lastGpsRef.current = gps;
        setGpsStatus('Live GPS Tracking');
        setErrorMsg(null);
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(
            `if (window.updateUserLocation) { window.updateUserLocation(${gps.lat}, ${gps.lng}, ${gps.accuracy || 10}, true); } true;`
          );
        }
      }
    } catch (e) {
      console.error('GPS error:', e);
      setErrorMsg('Could not fetch live GPS position. Please check location permissions.');
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const startTracking = async () => {
      try {
        const sub = await subscribeLiveGps(
          (gps) => {
            if (!isMounted) return;
            if (isSignificantMovement(gps)) {
              lastGpsRef.current = gps;
              setUserGps(gps);
              setGpsStatus('Live GPS Tracking');
            }
            setIsLocating(false);
            setErrorMsg(null);
          },
          (err) => {
            if (!isMounted) return;
            setGpsStatus('Location Permission Denied');
            setIsLocating(false);
            setUserGps({ lat: VIETNAM_DEFAULT_LAT, lng: VIETNAM_DEFAULT_LNG, accuracy: 15 });
          }
        );
        locationSubscriptionRef.current = sub;
      } catch (err) {
        if (isMounted) {
          setGpsStatus('GPS Initializing');
          setIsLocating(false);
          setUserGps({ lat: VIETNAM_DEFAULT_LAT, lng: VIETNAM_DEFAULT_LNG, accuracy: 15 });
        }
      }
    };

    startTracking();

    return () => {
      isMounted = false;
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!webViewRef.current || !userGps) return;

    const shouldRecenter = !initialSyncRef.current;
    initialSyncRef.current = true;

    webViewRef.current.injectJavaScript(
      `if (window.updateUserLocation) { window.updateUserLocation(${userGps.lat}, ${userGps.lng}, ${userGps.accuracy || 10}, ${shouldRecenter}); } true;`
    );
  }, [userGps?.lat, userGps?.lng]);

  const initLat = userGps?.lat || VIETNAM_DEFAULT_LAT;
  const initLng = userGps?.lng || VIETNAM_DEFAULT_LNG;

  const mapHtml = useMemo(() => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.js"></script>
  <style>
    * { box-sizing: border-box; }
    html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #F6F8F5; touch-action: pan-x pan-y; }
    .mapboxgl-map { font-family: system-ui, -apple-system, sans-serif; }

    /* Live Blue Dot User Marker */
    .user-dot-wrapper {
      position: relative;
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .user-dot-pulse {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.3);
      animation: pulse-user 1.8s infinite ease-in-out;
    }
    @keyframes pulse-user {
      0% { transform: scale(0.6); opacity: 0.9; }
      50% { transform: scale(1.6); opacity: 0.2; }
      100% { transform: scale(0.6); opacity: 0.9; }
    }
    .user-dot-core {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #2563EB;
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 0 8px rgba(37, 99, 235, 0.8);
      z-index: 2;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = '${MAPBOX_ACCESS_TOKEN.replace(/'/g, "\\ me")}';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [${initLng}, ${initLat}],
      zoom: 14,
      attributionControl: false
    });

    var userMarker = null;

    function createMarkerElement() {
      var el = document.createElement('div');
      el.className = 'user-dot-wrapper';
      el.innerHTML = '<div class="user-dot-pulse"></div><div class="user-dot-core"></div>';
      return el;
    }

    window.updateUserLocation = function(lat, lng, accuracy, recenter) {
      if (!map) return;
      if (!userMarker) {
        userMarker = new mapboxgl.Marker({ element: createMarkerElement() })
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        userMarker.setLngLat([lng, lat]);
      }
      if (recenter) {
        map.flyTo({ center: [lng, lat], zoom: 15, duration: 1200 });
      }
    };

    map.on('load', function() {
      window.updateUserLocation(${initLat}, ${initLng}, 10, true);
    });
  </script>
</body>
</html>
  `, [initLat, initLng]);

  return {
    userGps,
    gpsStatus,
    isLocating,
    errorMsg,
    mapHtml,
    webViewRef,
    handleGetLocation,
    handleRecenterGps: handleGetLocation
  };
};
