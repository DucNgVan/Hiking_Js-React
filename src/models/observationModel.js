/**
 * Observation Model - Validation and formatting for Hike Field Observations
 */

export const validateObservationInput = (obsData) => {
  const errors = [];
  if (!obsData?.text || !obsData.text.trim()) {
    errors.push("Observation text / note is required!");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const buildObservationPayload = (obsData) => {
  return {
    id: Date.now().toString(),
    text: obsData.text?.trim() || '',
    time: obsData.time || new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
    weather: obsData.weather || 'Normal',
    comments: obsData.comments?.trim() || ''
  };
};
