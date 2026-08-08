import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useHikeDetailController } from '../../controllers/useHikeDetailController';
import { ObservationModal } from '../../components/ObservationModal';
import { MiniMap } from '../../components/MiniMap';

export const HikeDetailView = ({ route, navigation }) => {
  const { hikeId } = route.params || {};
  const {
    trail,
    isFavorite,
    observations,
    startLat,
    startLng,
    obsModalVisible,
    setObsModalVisible,
    toggleFavorite,
    handleDeleteHike,
    handleAddObs,
    handleDeleteObs
  } = useHikeDetailController(hikeId, navigation);

  if (!trail) {
    return (
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Hike Record Not Found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.imageBox}>
          <Image source={{ uri: trail.image }} style={styles.image} />
          <TouchableOpacity 
            style={styles.favBtn} 
            onPress={toggleFavorite}
          >
            <Text style={{ fontSize: 20 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{trail.name}</Text>
        <Text style={styles.location}>📍 {trail.location}</Text>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.editBtn} 
            onPress={() => navigation.navigate('EditHike', { hikeId: trail.id })}
          >
            <Text style={styles.btnText}>✏️ Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.editBtn, { backgroundColor: '#3b82f6' }]} 
            onPress={() => navigation.navigate('MainTabs', { screen: 'MapTab' })}
          >
            <Text style={styles.btnText}>🎯 Live GPS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteHike}>
            <Text style={[styles.btnText, { color: '#ef4444' }]}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Start Location Mini Map Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Start Location & Trail Map</Text>
          <MiniMap
            lat={startLat}
            lng={startLng}
            title={trail.name}
            subtitle={trail.location}
            plannedRoute={trail.plannedRoute || []}
            actualRoute={trail.actualRoute || []}
            routePoints={trail.routePoints || []}
            height={220}
          />
        </View>

        {/* Hike Specs Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Hike Specifications</Text>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Duration (hours):</Text>
            <Text style={styles.specValue}>{trail.time || trail.hours || 'Not provided'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Date of Hike:</Text>
            <Text style={styles.specValue}>{trail.date}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Location / Start:</Text>
            <Text style={styles.specValue}>{trail.location}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Parking Available:</Text>
            <Text style={[styles.specValue, { color: trail.parking === 'Yes' ? '#10b981' : '#ef4444' }]}>
              {trail.parking}
            </Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Distance / Length:</Text>
            <Text style={styles.specValue}>{trail.length} km</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Difficulty Level:</Text>
            <Text style={styles.specValue}>{trail.difficulty}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Weather:</Text>
            <Text style={styles.specValue}>{trail.weather || 'Cool'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Companions:</Text>
            <Text style={styles.specValue}>{trail.companions || 'Friends'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Recorded By:</Text>
            <Text style={styles.specValue}>{trail.creatorName || trail.createdBy || 'Explorer'}</Text>
          </View>
        </View>

        {/* Description Card */}
        {trail.description ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📝 Description & Trail Notes</Text>
            <Text style={styles.descriptionText}>{trail.description}</Text>
          </View>
        ) : null}

        {/* Observations Section */}
        <View style={styles.card}>
          <View style={styles.obsHeaderRow}>
            <Text style={styles.cardTitle}>👁️ Field Observations ({observations.length})</Text>
            <TouchableOpacity 
              style={styles.addObsBtn}
              onPress={() => setObsModalVisible(true)}
            >
              <Text style={styles.addObsText}>+ Add Note</Text>
            </TouchableOpacity>
          </View>

          {observations.length === 0 ? (
            <Text style={styles.emptyObsText}>No observations added yet for this hike.</Text>
          ) : (
            observations.map((obs) => (
              <View key={obs.id} style={styles.obsCard}>
                <View style={styles.obsCardHeader}>
                  <Text style={styles.obsText}>{obs.text}</Text>
                  <TouchableOpacity onPress={() => handleDeleteObs(obs.id)}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.obsMetaRow}>
                  <Text style={styles.obsMeta}>⏰ {obs.time}</Text>
                  {obs.weather ? <Text style={styles.obsMeta}>☀️ {obs.weather}</Text> : null}
                </View>
                {obs.comments ? <Text style={styles.obsComment}>"{obs.comments}"</Text> : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Observation Add Modal */}
      <ObservationModal
        visible={obsModalVisible}
        onClose={() => setObsModalVisible(false)}
        onSubmit={handleAddObs}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  imageBox: {
    position: 'relative',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  editBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  specLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  specValue: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  obsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addObsBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addObsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyObsText: {
    color: '#64748b',
    fontSize: 13,
    fontStyle: 'italic',
  },
  obsCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  obsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  obsText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  obsMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  obsMeta: {
    color: '#94a3b8',
    fontSize: 11,
  },
  obsComment: {
    color: '#cbd5e1',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
