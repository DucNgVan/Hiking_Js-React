import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useHikes } from '../context/HikeContext';
import { validateHikeInput, buildHikePayload, DEFAULT_VIETNAM_LAT, DEFAULT_VIETNAM_LNG } from '../models/hikeModel';
import { searchLocationChain, reverseGeocodeChain } from '../services/geocodingService';
import { getCurrentGpsLocation } from '../services/locationService';

export const useEditHikeController = (hikeId, navigation) => {
  const { trails, updateHike } = useHikes();

  const trail = trails.find(t => t.id === hikeId);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startLat: DEFAULT_VIETNAM_LAT.toString(),
    startLng: DEFAULT_VIETNAM_LNG.toString(),
    date: '',
    parking: 'Yes',
    length: '',
    difficulty: 'Medium',
    description: '',
    weather: '',
    companions: '',
    imageResName: 'img2',
    image: ''
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingSource, setGeocodingSource] = useState(null);

  useEffect(() => {
    if (trail) {
      const initLat = (trail.plannedRoute && trail.plannedRoute[0]?.lat) || trail.coordinates?.latitude || trail.lat || DEFAULT_VIETNAM_LAT;
      const initLng = (trail.plannedRoute && trail.plannedRoute[0]?.lng) || trail.coordinates?.longitude || trail.lng || DEFAULT_VIETNAM_LNG;

      setFormData({
        name: trail.name || '',
        location: trail.location || '',
        startLat: initLat.toString(),
        startLng: initLng.toString(),
        date: trail.date || '',
        parking: trail.parking || 'Yes',
        length: trail.length?.toString() || trail.lengthKm?.toString() || '',
        difficulty: trail.difficulty || 'Medium',
        description: trail.description || '',
        weather: trail.weather || '',
        companions: trail.companions || '',
        imageResName: trail.imageResName || 'img2',
        image: trail.image || ''
      });
    }
  }, [trail]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchAddress = async () => {
    if (!formData.location || !formData.location.trim()) {
      Alert.alert('Search Error', 'Please enter a location name or address to search (e.g. Đà Nẵng, Hà Nội, Sapa).');
      return;
    }

    setIsGeocoding(true);
    setGeocodingSource(null);

    try {
      const result = await searchLocationChain(formData.location);
      if (result) {
        setFormData(prev => ({
          ...prev,
          startLat: result.lat.toFixed(6),
          startLng: result.lng.toFixed(6),
          location: result.displayName || prev.location
        }));
        setGeocodingSource(result.source);
        Alert.alert(
          '📍 Red Marker Placed!',
          `Found Location: ${result.displayName}\n\nCoordinates: ${result.lat.toFixed(6)}, ${result.lng.toFixed(6)}\n\n(Geocoding via: ${result.source})`
        );
      } else {
        Alert.alert('Location Not Found', `Could not find coordinates for "${formData.location}" via Android Geocoder, OpenStreetMap, or Komoot.`);
      }
    } catch (e) {
      console.error('Search address error:', e);
      Alert.alert('Search Error', 'Unable to search location.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapTap = async (tapLat, tapLng) => {
    const latStr = tapLat.toFixed(6);
    const lngStr = tapLng.toFixed(6);

    setFormData(prev => ({
      ...prev,
      startLat: latStr,
      startLng: lngStr
    }));

    try {
      const revResult = await reverseGeocodeChain(tapLat, tapLng);
      if (revResult && revResult.locationName) {
        setFormData(prev => ({
          ...prev,
          location: revResult.locationName
        }));
        setGeocodingSource(revResult.source);
      }
    } catch (e) {
      console.log('Map tap reverse geocode error:', e);
    }
  };

  const handleFetchGpsStart = async () => {
    setIsLocating(true);
    try {
      const gps = await getCurrentGpsLocation();
      const latStr = gps.lat.toFixed(6);
      const lngStr = gps.lng.toFixed(6);

      setFormData(prev => ({
        ...prev,
        startLat: latStr,
        startLng: lngStr
      }));

      const revResult = await reverseGeocodeChain(gps.lat, gps.lng);
      if (revResult && revResult.locationName) {
        setFormData(prev => ({ ...prev, location: revResult.locationName }));
        setGeocodingSource(revResult.source);
      }

      Alert.alert('GPS Location Updated', `Set start coordinates to:\nLatitude: ${latStr}\nLongitude: ${lngStr}`);
    } catch (e) {
      console.error('Location error', e);
      Alert.alert('Location Error', 'Unable to retrieve GPS position.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = () => {
    const { isValid, errors } = validateHikeInput(formData);
    if (!isValid) {
      Alert.alert("Validation Error", errors.join('\n'));
      return;
    }

    const payload = buildHikePayload(formData);
    updateHike(hikeId, payload);
    navigation.goBack();
  };

  return {
    trail,
    formData,
    isLocating,
    isGeocoding,
    geocodingSource,
    handleChange,
    handleSearchAddress,
    handleMapTap,
    handleFetchGpsStart,
    handleSave,
    numLat: parseFloat(formData.startLat) || DEFAULT_VIETNAM_LAT,
    numLng: parseFloat(formData.startLng) || DEFAULT_VIETNAM_LNG
  };
};
