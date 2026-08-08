import * as Location from 'expo-location';

/**
 * Location Service - Handles device location permissions, position fetching, and live GPS subscriptions
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
    accuracy: Location.Accuracy.High,
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
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      distanceInterval: 1,
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
