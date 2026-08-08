import { useState } from 'react';
import { Alert } from 'react-native';
import { useHikes } from '../context/HikeContext';
import { useAuth } from '../context/AuthContext';
import { validateObservationInput, buildObservationPayload } from '../models/observationModel';

export const useHikeDetailController = (hikeId, navigation) => {
  const { user } = useAuth();
  const { trails, favorites, toggleFavorite, deleteHike, addObservation, deleteObservation } = useHikes();

  const trail = trails.find(t => t.id === hikeId || t.firebaseId === hikeId || String(t.id) === String(hikeId));
  const [obsModalVisible, setObsModalVisible] = useState(false);

  const targetId = trail?.firebaseId || trail?.id || hikeId;
  const isFavorite = targetId ? favorites.includes(targetId) : false;
  const observations = trail?.observations || [];

  // Permission Check: Allow editing/deleting only if user owns the hike or sample hike
  const isOwner = !trail || !trail.creatorId || !user?.uid ||
    trail.creatorId === user.uid ||
    trail.createdBy === user.email ||
    trail.creatorEmail === user.email;

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

  const handleEditHike = () => {
    if (!isOwner) {
      Alert.alert("Permission Denied 🔒", "You can only edit hikes created under your account.");
      return;
    }
    navigation.navigate('EditHike', { hikeId: targetId });
  };

  const handleDeleteHike = () => {
    if (!trail) return;
    if (!isOwner) {
      Alert.alert("Permission Denied 🔒", "You can only delete hikes created under your account.");
      return;
    }
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
    isOwner,
    startLat,
    startLng,
    obsModalVisible,
    setObsModalVisible,
    toggleFavorite: () => targetId && toggleFavorite(targetId),
    handleEditHike,
    handleDeleteHike,
    handleAddObs,
    handleDeleteObs
  };
};
