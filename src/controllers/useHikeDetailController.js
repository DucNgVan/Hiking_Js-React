import { useState } from 'react';
import { Alert } from 'react-native';
import { useHikes } from '../context/HikeContext';
import { validateObservationInput, buildObservationPayload } from '../models/observationModel';

export const useHikeDetailController = (hikeId, navigation) => {
  const { trails, favorites, toggleFavorite, deleteHike, addObservation, deleteObservation } = useHikes();

  const trail = trails.find(t => t.id === hikeId);
  const [obsModalVisible, setObsModalVisible] = useState(false);

  const isFavorite = trail ? favorites.includes(trail.id) : false;
  const observations = trail?.observations || [];
  const startLat = (trail?.plannedRoute && trail?.plannedRoute[0]?.lat) || trail?.coordinates?.latitude || trail?.lat || 16.047079;
  const startLng = (trail?.plannedRoute && trail?.plannedRoute[0]?.lng) || trail?.coordinates?.longitude || trail?.lng || 108.206230;

  const handleDeleteHike = () => {
    if (!trail) return;
    Alert.alert(
      "Delete Hike",
      `Are you sure you want to delete "${trail.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteHike(trail.id);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  const handleAddObs = (obsData) => {
    const { isValid, errors } = validateObservationInput(obsData);
    if (!isValid) {
      Alert.alert("Validation Error", errors.join('\n'));
      return;
    }

    const payload = buildObservationPayload(obsData);
    addObservation(trail.id, payload);
    setObsModalVisible(false);
  };

  const handleDeleteObs = (obsId) => {
    Alert.alert(
      "Delete Observation",
      "Are you sure you want to delete this observation note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteObservation(trail.id, obsId) }
      ]
    );
  };

  return {
    trail,
    isFavorite,
    observations,
    startLat,
    startLng,
    obsModalVisible,
    setObsModalVisible,
    toggleFavorite: () => trail && toggleFavorite(trail.id),
    handleDeleteHike,
    handleAddObs,
    handleDeleteObs
  };
};
