import { useState } from 'react';
import { Alert } from 'react-native';
import { useHikes } from '../context/HikeContext';
import { useAuth } from '../context/AuthContext';
import { validateHikeInput, buildHikePayload, DEFAULT_VIETNAM_LAT, DEFAULT_VIETNAM_LNG } from '../models/hikeModel';
import { searchLocationChain, reverseGeocodeChain } from '../services/geocodingService';
import { getCurrentGpsLocation } from '../services/locationService';

export const useAddHikeController = (navigation) => {
  const { addHike } = useHikes();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startLat: DEFAULT_VIETNAM_LAT.toString(),
    startLng: DEFAULT_VIETNAM_LNG.toString(),
    date: new Date().toLocaleDateString('en-GB'),
    time: '',
    length: '',
    difficulty: 'Medium',
    parking: 'Yes',
    weather: 'Cool',
    companions: 'Friends',
    imageResName: 'img2',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    description: ''
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingSource, setGeocodingSource] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchAddress = async () => {
    if (!formData.location || !formData.location.trim()) {
      Alert.alert('Search Error', 'Please enter an address or location name to search (e.g. Đà Nẵng, Hà Nội, Sapa).');
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
      Alert.alert('Search Error', 'Unable to resolve location.');
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

      Alert.alert('GPS Location Fetched', `Set start coordinates to:\nLatitude: ${latStr}\nLongitude: ${lngStr}`);
    } catch (e) {
      console.error('Location error', e);
      Alert.alert('Location Error', 'Unable to retrieve GPS position.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleCreate = () => {
    const { isValid, errors } = validateHikeInput(formData);
    if (!isValid) {
      Alert.alert("Validation Error", errors.join('\n'));
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    const payload = buildHikePayload(formData, user);
    try {
      const created = await addHike(payload);
      setIsConfirmOpen(false);
      if (created?.id != null) {
        navigation.replace('HikeDetail', { hikeId: created.id });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Create hike error', error);
      Alert.alert('Save failed', 'Unable to create the hike. Please try again.');
    }
  };

  return {
    formData,
    isLocating,
    isGeocoding,
    geocodingSource,
    isConfirmOpen,
    setIsConfirmOpen,
    handleChange,
    handleSearchAddress,
    handleMapTap,
    handleFetchGpsStart,
    handleCreate,
    handleConfirmSave,
    numLat: parseFloat(formData.startLat) || DEFAULT_VIETNAM_LAT,
    numLng: parseFloat(formData.startLng) || DEFAULT_VIETNAM_LNG
  };
};
