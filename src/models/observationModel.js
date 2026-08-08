/**
 * Observation Model - Validation and formatting for Hike Field Observations
 * Aligned with Android Studio Java Firestore schema (hikingapp-81d90)
 */

export const validateObservationInput = (obsData) => {
  const errors = [];
  const textVal = obsData?.text || obsData?.observation;
  if (!textVal || !textVal.trim()) {
    errors.push("Observation text / note is required!");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const buildObservationPayload = (obsData, hikeId) => {
  const obsText = obsData.text?.trim() || obsData.observation?.trim() || '';

  return {
    id: Date.now().toString(),
    observation: obsText,
    text: obsText,
    time: obsData.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    weather: obsData.weather || 'Normal',
    comments: obsData.comments?.trim() || '',
    hikeFirebaseId: hikeId || obsData.hikeFirebaseId || ''
  };
};
