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
    startLat: DEFAULT_VIETNAM_LAT.toFixed(6),
    startLng: DEFAULT_VIETNAM_LNG.toFixed(6),
    date: new Date().toLocaleDateString('en-GB'),
    startTime: '05:35 PM',
    length: '',
    time: '',
    difficulty: 'Medium',
    weather: 'Cool',
    parking: 'Available',
    imageResName: 'img1',
    image: 'img1',
    description: ''
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingSource, setGeocodingSource] = useState(null);
  const [geocodingTimeMs, setGeocodingTimeMs] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchAddress = async () => {
    if (!formData.location || !formData.location.trim()) {
      Alert.alert('Search Error', 'Please enter an address or location name to search (e.g. đường Hoàng Sa, Sơn Trà, Đà Nẵng).');
      return;
    }

    setIsGeocoding(true);
    setGeocodingSource(null);
    setGeocodingTimeMs(null);
    const startMs = Date.now();

    try {
      const result = await searchLocationChain(formData.location);
      const elapsed = Date.now() - startMs;
      setGeocodingTimeMs(elapsed);

      if (result) {
        setFormData(prev => ({
          ...prev,
          startLat: result.lat.toFixed(6),
          startLng: result.lng.toFixed(6),
          location: result.displayName || prev.location
        }));
        setGeocodingSource(result.source);
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

    const startMs = Date.now();
    try {
      const revResult = await reverseGeocodeChain(tapLat, tapLng);
      const elapsed = Date.now() - startMs;
      setGeocodingTimeMs(elapsed);

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
    const startMs = Date.now();
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
      const elapsed = Date.now() - startMs;
      setGeocodingTimeMs(elapsed);

      if (revResult && revResult.locationName) {
        setFormData(prev => ({ ...prev, location: revResult.locationName }));
        setGeocodingSource(revResult.source);
      }
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
    geocodingTimeMs,
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
