import { useState } from 'react';
import { Alert } from 'react-native';
import { useHikes } from '../context/HikeContext';
import { validateObservationInput, buildObservationPayload } from '../models/observationModel';

export const useHikeDetailController = (hikeId, navigation) => {
  const { trails, favorites, toggleFavorite, deleteHike, addObservation, deleteObservation } = useHikes();

  const trail = trails.find(t => t.id === hikeId || t.firebaseId === hikeId || String(t.id) === String(hikeId));
  const [obsModalVisible, setObsModalVisible] = useState(false);

  const targetId = trail?.firebaseId || trail?.id || hikeId;
  const isFavorite = targetId ? favorites.includes(targetId) : false;
  const observations = trail?.observations || [];

  const startLat = parseFloat(
    (trail?.plannedRoute && trail?.plannedRoute[0]?.lat) ||
    trail?.coordinates?.latitude ||
    trail?.startLat ||
    trail?.lat ||
    16.047079
  );
  const startLng = parseFloat(
    (trail?.plannedRoute && trail?.plannedRoute[0]?.lng) ||
    trail?.coordinates?.longitude ||
    trail?.startLng ||
    trail?.lng ||
    108.206230
  );

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
            deleteHike(targetId);
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

    const payload = buildObservationPayload(obsData, targetId);
    addObservation(targetId, payload);
    setObsModalVisible(false);
  };

  const handleDeleteObs = (obsId) => {
    Alert.alert(
      "Delete Observation",
      "Are you sure you want to delete this observation note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteObservation(targetId, obsId) }
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
    toggleFavorite: () => targetId && toggleFavorite(targetId),
    handleDeleteHike,
    handleAddObs,
    handleDeleteObs
  };
};
