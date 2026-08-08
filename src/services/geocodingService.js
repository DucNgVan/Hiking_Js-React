import * as Location from 'expo-location';

/**
 * 3-Tier Geocoding Fallback Chain for Vietnam & Global address searching:
 * Tier 1: Android / Expo Location Native Geocoder
 * Tier 2: OpenStreetMap Nominatim API (vi, en language support)
 * Tier 3: Komoot Photon Geocoding API
 */
export const searchLocationChain = async (query) => {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return null;
  }

  const cleanQuery = query.trim();

  // Tier 1: Expo Native Location Geocoder
  try {
    const nativeResults = await Location.geocodeAsync(cleanQuery);
    if (nativeResults && nativeResults.length > 0) {
      const { latitude, longitude } = nativeResults[0];
      return {
        lat: latitude,
        lng: longitude,
        displayName: cleanQuery,
        source: 'Android Geocoder (Native)'
      };
    }
  } catch (err) {
    console.log('Tier 1 (Native Geocoder) failed, trying Tier 2 (Nominatim)...', err?.message);
  }

  // Tier 2: OpenStreetMap Nominatim API
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&format=json&addressdetails=1&limit=1&accept-language=vi,en`,
      {
        headers: {
          'User-Agent': 'HikingAppReact/1.0 (student.coursework@example.com)'
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const item = data[0];
        return {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          displayName: item.display_name || cleanQuery,
          source: 'OpenStreetMap Nominatim API'
        };
      }
    }
  } catch (err) {
    console.log('Tier 2 (Nominatim) failed, trying Tier 3 (Komoot Photon)...', err?.message);
  }

  // Tier 3: Komoot Photon Geocoding API
  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=1`
    );
    if (response.ok) {
      const data = await response.json();
      if (data?.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties;
        const displayName = [props.name, props.city || props.town || props.state, props.country]
          .filter(Boolean)
          .join(', ');

        return {
          lat,
          lng,
          displayName: displayName || cleanQuery,
          source: 'Komoot Photon API'
        };
      }
    }
  } catch (err) {
    console.log('Tier 3 (Photon) failed:', err?.message);
  }

  return null;
};

/**
 * 3-Tier Reverse Geocoding Fallback Chain (Lat/Lng -> Address string)
 * Tier 1: Expo Native Location reverseGeocodeAsync
 * Tier 2: OpenStreetMap Nominatim Reverse API
 * Tier 3: Komoot Photon Reverse API
 */
export const reverseGeocodeChain = async (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }

  // Tier 1: Expo Native Location
  try {
    const nativeRes = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (nativeRes && nativeRes.length > 0) {
      const item = nativeRes[0];
      const parts = [
        item.name || item.street,
        item.district || item.subregion,
        item.city || item.region,
        item.country
      ].filter(Boolean);

      if (parts.length > 0) {
        return {
          locationName: parts.join(', '),
          source: 'Android Geocoder (Native)'
        };
      }
    }
  } catch (err) {
    console.log('Reverse Tier 1 failed, trying Tier 2 (Nominatim)...', err?.message);
  }

  // Tier 2: Nominatim Reverse
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=vi,en`,
      {
        headers: {
          'User-Agent': 'HikingAppReact/1.0 (student.coursework@example.com)'
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        return {
          locationName: data.display_name,
          source: 'OpenStreetMap Nominatim API'
        };
      }
    }
  } catch (err) {
    console.log('Reverse Tier 2 failed, trying Tier 3 (Photon)...', err?.message);
  }

  // Tier 3: Komoot Photon Reverse
  try {
    const response = await fetch(
      `https://photon.komoot.io/api/reverse?lat=${latitude}&lon=${longitude}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data?.features && data.features.length > 0) {
        const props = data.features[0].properties;
        const parts = [props.name, props.street, props.city || props.town, props.country].filter(Boolean);
        if (parts.length > 0) {
          return {
            locationName: parts.join(', '),
            source: 'Komoot Photon API'
          };
        }
      }
    }
  } catch (err) {
    console.log('Reverse Tier 3 failed:', err?.message);
  }

  return {
    locationName: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
    source: 'Coordinates Fallback'
  };
};
