/**
 * Hike Model - Business Logic, Validation & Object Formatting for Hike Data
 */

export const DEFAULT_VIETNAM_LAT = 16.047079;
export const DEFAULT_VIETNAM_LNG = 108.206230;

export const validateHikeInput = (formData) => {
  const errors = [];

  if (!formData?.name || !formData.name.trim()) {
    errors.push("Hike Name* is required!");
  }
  if (!formData?.location || !formData.location.trim()) {
    errors.push("Start Location / Address* is required!");
  }
  if (!formData?.length || isNaN(Number(formData.length)) || Number(formData.length) <= 0) {
    errors.push("Total Distance (km)* must be a valid positive number!");
  }
  if (formData?.time !== undefined && formData?.time !== '' && isNaN(Number(formData.time))) {
    errors.push("Duration (hours)* must be a valid number!");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const buildHikePayload = (formData, user) => {
  const lat = parseFloat(formData.startLat) || DEFAULT_VIETNAM_LAT;
  const lng = parseFloat(formData.startLng) || DEFAULT_VIETNAM_LNG;
  const hours = Number(formData.time) || 0;

  return {
    name: formData.name?.trim() || '',
    location: formData.location?.trim() || '',
    date: formData.date || new Date().toLocaleDateString('en-GB'),
    time: formData.time || '',
    hours,
    length: formData.length || '',
    lengthKm: Number(formData.length) || 0,
    difficulty: formData.difficulty || 'Medium',
    parking: formData.parking || 'Yes',
    weather: formData.weather?.trim() || 'Cool',
    companions: formData.companions?.trim() || 'Friends',
    imageResName: formData.imageResName || 'img2',
    image: formData.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    description: formData.description?.trim() || '',
    startLat: lat.toFixed(6),
    startLng: lng.toFixed(6),
    lat,
    lng,
    coordinates: { latitude: lat, longitude: lng },
    creatorName: user?.name || 'Unknown User',
    creatorEmail: user?.email || '',
    createdBy: user?.email || '',
    plannedRoute: [
      { lat, lng },
      { lat: lat + 0.005, lng: lng + 0.005 }
    ],
    routePoints: [
      { lat, lng, weather: formData.weather || 'Cool' }
    ],
    actualRoute: [
      { lat, lng },
      { lat: lat + 0.002, lng: lng + 0.002 },
      { lat: lat + 0.005, lng: lng + 0.005 }
    ]
  };
};
