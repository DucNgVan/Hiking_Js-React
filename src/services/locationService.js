import * as Location from 'expo-location';

/**
 * Location Service - Handles device location permissions, position fetching, and live GPS subscriptions
 * Optimized with 5s timeInterval & 10m distanceInterval to prevent excessive GPS battery drain & jitter
 */
export const requestLocationPermissions = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const getCurrentGpsLocation = async () => {
  const granted = await requestLocationPermissions();
  if (!granted) {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
    accuracy: location.coords.accuracy,
    speed: location.coords.speed
  };
};

export const subscribeLiveGps = async (onLocationUpdate, onError) => {
  const granted = await requestLocationPermissions();
  if (!granted) {
    if (onError) onError(new Error('Location permission denied'));
    return null;
  }

  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,   // Update every 5 seconds instead of 1 second
      distanceInterval: 10, // Update only after moving 10 meters instead of 1 meter
    },
    (location) => {
      if (location?.coords) {
        onLocationUpdate({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          accuracy: location.coords.accuracy,
          speed: location.coords.speed
        });
      }
    }
  );
};
