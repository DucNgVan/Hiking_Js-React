import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddHikeController } from '../../controllers/useAddHikeController';
import { HikeConfirmModal } from '../../components/HikeConfirmModal';
import { MiniMap } from '../../components/MiniMap';
import { COLORS } from '../../theme';

export const AddHikeView = ({ navigation }) => {
  const {
    formData,
    isLocating,
    isGeocoding,
    geocodingSource,
    isConfirmOpen,
    setIsConfirmOpen,
    handleChange,
    handleSearchAddress,
    handleMapTap,
    handleFetchGpsStart,
    handleCreate,
    handleConfirmSave,
    numLat,
    numLng
  } = useAddHikeController(navigation);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan New Hike Adventure</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Location & GPS Selection */}
        <Text style={styles.sectionTitle}>📍 Hike Start Location & GPS</Text>

        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Hike Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Son Tra Peninsula Hike"
            placeholderTextColor="#A0AEC0"
            value={formData.name}
            onChangeText={(v) => handleChange('name', v)}
          />
        </View>

        {/* Start Location Input with Geocoding Search */}
        <View style={styles.searchRow}>
          <View style={[styles.inputOutlineGroup, { flex: 1, marginBottom: 0 }]}>
            <Text style={styles.floatingLabel}>Start Location / Address*</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Đà Nẵng, Hà Nội, Sapa"
              placeholderTextColor="#A0AEC0"
              value={formData.location}
              onChangeText={(v) => handleChange('location', v)}
            />
          </View>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={handleSearchAddress}
            activeOpacity={0.8}
            disabled={isGeocoding}
          >
            {isGeocoding ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.searchBtnText}>🔍 Find</Text>
            )}
          </TouchableOpacity>
        </View>

        {geocodingSource && (
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceBadgeText}>✓ Geocoded via {geocodingSource}</Text>
          </View>
        )}

        {/* GPS Coordinates */}
        <View style={styles.gpsRow}>
          <View style={[styles.inputOutlineGroup, { flex: 1, marginBottom: 0 }]}>
            <Text style={styles.floatingLabel}>Start Latitude</Text>
            <TextInput
              style={styles.input}
              placeholder="16.047079"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
              value={formData.startLat}
              onChangeText={(v) => handleChange('startLat', v)}
            />
          </View>

          <View style={[styles.inputOutlineGroup, { flex: 1, marginBottom: 0 }]}>
            <Text style={styles.floatingLabel}>Start Longitude</Text>
            <TextInput
              style={styles.input}
              placeholder="108.206230"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
              value={formData.startLng}
              onChangeText={(v) => handleChange('startLng', v)}
            />
          </View>
        </View>

        {/* Button to Choose Current GPS */}
        <TouchableOpacity style={styles.fetchGpsBtn} onPress={handleFetchGpsStart} activeOpacity={0.85}>
          {isLocating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Text style={{ fontSize: 18, marginRight: 6 }}>🎯</Text>
              <Text style={styles.fetchGpsText}>Use My Current GPS for Start</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Live MiniMap Preview of Start Location with Red Marker Pin */}
        <View style={styles.mapPreviewBox}>
          <Text style={styles.mapPreviewTitle}>🗺️ Start Location & Red Marker (Tap map to select location)</Text>
          <MiniMap
            lat={numLat}
            lng={numLng}
            title={formData.name || 'New Hike'}
            subtitle={formData.location || 'Start Point'}
            height={200}
            showControls={true}
            onMapTap={handleMapTap}
          />
        </View>

        {/* Section 2: Hike Details */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>📋 Hike Statistics & Database Info</Text>

        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Journey Date*</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#A0AEC0"
            value={formData.date}
            onChangeText={(v) => handleChange('date', v)}
          />
        </View>

        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Total Distance (km)*</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 8"
            placeholderTextColor="#A0AEC0"
            keyboardType="numeric"
            value={formData.length}
            onChangeText={(v) => handleChange('length', v)}
          />
        </View>

        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Duration (hours)*</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3.5"
            placeholderTextColor="#A0AEC0"
            keyboardType="decimal-pad"
            value={formData.time}
            onChangeText={(v) => handleChange('time', v)}
          />
        </View>

        {/* Difficulty Selector */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Difficulty Level*</Text>
          <View style={styles.chipRow}>
            {['Easy', 'Medium', 'Hard'].map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.selectorChip, formData.difficulty === d && styles.selectorChipActive]}
                onPress={() => handleChange('difficulty', d)}
              >
                <Text style={[styles.selectorChipText, formData.difficulty === d && styles.selectorChipTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Parking Selector */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Parking Available*</Text>
          <View style={styles.chipRow}>
            {['Yes', 'No'].map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.selectorChip, formData.parking === p && styles.selectorChipActive]}
                onPress={() => handleChange('parking', p)}
              >
                <Text style={[styles.selectorChipText, formData.parking === p && styles.selectorChipTextActive]}>
                  {p === 'Yes' ? '🅿️ Yes' : '🚫 No'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Weather Condition</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Cool"
            placeholderTextColor="#A0AEC0"
            value={formData.weather}
            onChangeText={(v) => handleChange('weather', v)}
          />
        </View>

        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Companions</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Friends"
            placeholderTextColor="#A0AEC0"
            value={formData.companions}
            onChangeText={(v) => handleChange('companions', v)}
          />
        </View>

        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Image Resource Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. img2"
            placeholderTextColor="#A0AEC0"
            value={formData.imageResName}
            onChangeText={(v) => handleChange('imageResName', v)}
          />
        </View>

        {/* Description / Notes */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Description & Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Trail details..."
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={3}
            value={formData.description}
            onChangeText={(v) => handleChange('description', v)}
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>Create Hike Record</Text>
        </TouchableOpacity>

        {/* Discard Link */}
        <TouchableOpacity style={styles.discardBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
      </ScrollView>

      <HikeConfirmModal
        visible={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        hikeData={formData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  backIcon: {
    fontSize: 22,
    color: '#1A202C',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  searchBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sourceBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#6EE7B7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  sourceBadgeText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '600',
  },
  inputOutlineGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: COLORS.bgMain,
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    zIndex: 2,
  },
  input: {
    fontSize: 15,
    color: '#1A202C',
    paddingVertical: 2,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  gpsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  fetchGpsBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  fetchGpsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  mapPreviewBox: {
    marginBottom: 16,
  },
  mapPreviewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  selectorChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  selectorChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectorChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  selectorChipTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  discardBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  discardText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '600',
  },
});
