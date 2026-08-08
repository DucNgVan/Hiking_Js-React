import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { subscribeLiveGps } from '../services/locationService';
import { searchLocationChain, reverseGeocodeChain } from '../services/geocodingService';

export const useMapController = () => {
  const [userGps, setUserGps] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('Initializing GPS...');
  const [isLocating, setIsLocating] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const webViewRef = useRef(null);
  const locationSubscriptionRef = useRef(null);
  const initialSyncRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const startTracking = async () => {
      try {
        const sub = await subscribeLiveGps(
          (gps) => {
            if (!isMounted) return;
            setUserGps(gps);
            setGpsStatus('Live GPS Tracking');
            setIsLocating(false);
          },
          (err) => {
            if (!isMounted) return;
            setGpsStatus('Location Permission Denied');
            setIsLocating(false);
            Alert.alert('Permission Denied', 'Location permission is required for live GPS tracking.');
          }
        );
        locationSubscriptionRef.current = sub;
      } catch (err) {
        if (isMounted) {
          setGpsStatus('GPS Unavailable');
          setIsLocating(false);
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
    if (!isMapReady || !webViewRef.current || !userGps) return;

    const shouldRecenter = !initialSyncRef.current;
    initialSyncRef.current = true;

    webViewRef.current.injectJavaScript(
      `if (window.updateUserLocation) { window.updateUserLocation(${userGps.lat}, ${userGps.lng}, ${userGps.accuracy || 15}, ${shouldRecenter}); } true;`
    );
  }, [isMapReady, userGps?.lat, userGps?.lng, userGps?.accuracy]);

  const handleSearchLocation = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      Alert.alert('Search Error', 'Please enter a location name (e.g. Đà Nẵng, Hà Nội, Sapa).');
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchLocationChain(searchQuery);
      if (result) {
        setSearchResult(result);
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(
            `if (window.placeRedMarker) { window.placeRedMarker(${result.lat}, ${result.lng}, ${JSON.stringify(result.displayName)}); } true;`
          );
        }
        Alert.alert(
          '📍 Location Found',
          `Address: ${result.displayName}\nCoordinates: ${result.lat.toFixed(6)}, ${result.lng.toFixed(6)}\nFound via: ${result.source}`
        );
      } else {
        Alert.alert('Location Not Found', `Could not find "${searchQuery}" via Android Geocoder, OSM Nominatim, or Komoot.`);
      }
    } catch (e) {
      console.error('Map search error:', e);
      Alert.alert('Search Error', 'Unable to search location.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecenterGps = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`if (window.recenterUser) { window.recenterUser(); } true;`);
    }
  };

  const handleZoomIn = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`if (window.zoomInMap) { window.zoomInMap(); } true;`);
    }
  };

  const handleZoomOut = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`if (window.zoomOutMap) { window.zoomOutMap(); } true;`);
    }
  };

  const handleMapMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MAP_TAP') {
        const rev = await reverseGeocodeChain(data.lat, data.lng);
        const name = rev?.locationName || `Location (${data.lat.toFixed(4)}, ${data.lng.toFixed(4)})`;
        setSearchResult({
          lat: data.lat,
          lng: data.lng,
          displayName: name,
          source: rev?.source || 'Map Tap'
        });
      }
    } catch (e) {
      // ignore
    }
  };

  return {
    userGps,
    gpsStatus,
    isLocating,
    setIsMapReady,
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResult,
    webViewRef,
    handleSearchLocation,
    handleRecenterGps,
    handleZoomIn,
    handleZoomOut,
    handleMapMessage
  };
};
