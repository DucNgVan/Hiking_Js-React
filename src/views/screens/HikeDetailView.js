import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHikeDetailController } from '../../controllers/useHikeDetailController';
import { ObservationModal } from '../../components/ObservationModal';
import { MiniMap } from '../../components/MiniMap';
import { getImageSource, getTrackingImagesList } from '../../services/imageService';

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

  const mainImageSource = getImageSource(trail.image, trail.imageResName);
  const trackingImages = getTrackingImagesList(trail);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Green Bar */}
      <View style={styles.greenNavHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIconText}>↩</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>{trail.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditHike', { hikeId: trail.id })}>
          <Text style={styles.editTopText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.imageBox}>
          <Image source={mainImageSource} style={styles.image} />
          <TouchableOpacity 
            style={styles.favBtn} 
            onPress={toggleFavorite}
          >
            <Text style={{ fontSize: 20 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{trail.name}</Text>
        <Text style={styles.location}>📍 {trail.location}</Text>

        {/* 5 Tracking Photos Carousel */}
        <View style={styles.galleryBox}>
          <Text style={styles.galleryTitle}>📸 5 Tracking Photos (img1 - img5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
            {trackingImages.map((imgSrc, idx) => (
              <View key={idx} style={styles.galleryItem}>
                <Image source={imgSrc} style={styles.galleryImg} />
                <View style={styles.galleryBadge}>
                  <Text style={styles.galleryBadgeText}>img{idx + 1}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Start Location & Map */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Map</Text>
          <MiniMap
            lat={startLat}
            lng={startLng}
            title={trail.name}
            subtitle={trail.location}
            plannedRoute={trail.plannedRoute || []}
            actualRoute={trail.actualRoute || []}
            routePoints={trail.routePoints || []}
            height={200}
          />
        </View>

        {/* Hike Specifications Card */}
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
            <Text style={[styles.specValue, { color: trail.parking === 'Yes' || trail.parking === 'Available' ? '#2E7D32' : '#EF4444' }]}>
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
        </View>

        {/* Observations Section */}
        <View style={styles.card}>
          <View style={styles.obsHeaderRow}>
            <Text style={styles.cardTitle}>Observations</Text>
            <TouchableOpacity 
              style={styles.addObsPillBtn}
              onPress={() => setObsModalVisible(true)}
            >
              <Text style={styles.addObsPillText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {observations.length === 0 ? (
            <Text style={styles.emptyObsText}>No observations added yet for this hike.</Text>
          ) : (
            observations.map((obs, index) => (
              <View key={obs.id || index} style={styles.obsCard}>
                <View style={styles.obsCardHeader}>
                  <Text style={styles.obsText}>{obs.text || obs.observation}</Text>
                  <Text style={styles.obsGreenTime}>{obs.time || '07:30 AM'}</Text>
                </View>
                {obs.comments ? <Text style={styles.obsComment}>{obs.comments}</Text> : null}
                <View style={styles.obsActionIcons}>
                  <TouchableOpacity onPress={() => setObsModalVisible(true)} style={{ marginRight: 12 }}>
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteObs(obs.id)}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Remove Journey Red Outlined Button */}
        <TouchableOpacity style={styles.removeJourneyBtn} onPress={handleDeleteHike} activeOpacity={0.85}>
          <Text style={styles.removeJourneyText}>Remove Journey</Text>
        </TouchableOpacity>
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
    backgroundColor: '#F6F8F5',
  },
  greenNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    padding: 4,
  },
  backIconText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  navTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  editTopText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  imageBox: {
    position: 'relative',
    height: 220,
    borderRadius: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 14,
  },
  galleryBox: {
    marginBottom: 16,
  },
  galleryTitle: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  galleryScroll: {
    gap: 10,
  },
  galleryItem: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImg: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  galleryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  galleryBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specLabel: {
    color: '#64748B',
    fontSize: 14,
  },
  specValue: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
  },
  obsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addObsPillBtn: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addObsPillText: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyObsText: {
    color: '#94A3B8',
    fontSize: 13,
    fontStyle: 'italic',
  },
  obsCard: {
    backgroundColor: '#FAFCF8',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  obsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  obsText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  obsGreenTime: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '700',
  },
  obsComment: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 8,
  },
  obsActionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  removeJourneyBtn: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  removeJourneyText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
});
