import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useEditHikeController } from '../../controllers/useEditHikeController';
import { MiniMap } from '../../components/MiniMap';

export const EditHikeView = ({ route, navigation }) => {
  const { hikeId } = route.params || {};
  const {
    trail,
    formData,
    isLocating,
    isGeocoding,
    geocodingSource,
    handleChange,
    handleSearchAddress,
    handleMapTap,
    handleFetchGpsStart,
    handleSave,
    numLat,
    numLng
  } = useEditHikeController(hikeId, navigation);

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
        <Text style={styles.screenTitle}>Edit Hike Entry</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Name of Hike *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(v) => handleChange('name', v)}
          />

          <Text style={styles.label}>Start Location / Address *</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={formData.location}
              placeholder="e.g. Đà Nẵng, Hà Nội"
              placeholderTextColor="#64748b"
              onChangeText={(v) => handleChange('location', v)}
            />
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

          {/* GPS Coordinates Section */}
          <Text style={styles.label}>Start Location GPS Coordinates</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <TextInput
                style={styles.input}
                placeholder="Lat e.g. 16.047079"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={formData.startLat}
                onChangeText={(v) => handleChange('startLat', v)}
              />
            </View>
            <View style={styles.col}>
              <TextInput
                style={styles.input}
                placeholder="Lng e.g. 108.206230"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={formData.startLng}
                onChangeText={(v) => handleChange('startLng', v)}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.fetchGpsBtn} onPress={handleFetchGpsStart}>
            {isLocating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.fetchGpsText}>🎯 Use Current Device GPS</Text>
            )}
          </TouchableOpacity>

          {/* MiniMap Preview with Red Marker Pin */}
          <View style={styles.mapPreviewBox}>
            <Text style={styles.mapPreviewTitle}>📍 Red Marker Start Location (Tap map to change position)</Text>
            <MiniMap
              lat={numLat}
              lng={numLng}
              title={formData.name || 'Hike Start'}
              subtitle={formData.location || 'Location'}
              height={180}
              showControls={true}
              onMapTap={handleMapTap}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(v) => handleChange('date', v)}
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Length (km) *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.length}
                onChangeText={(v) => handleChange('length', v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Parking Available *</Text>
          <View style={styles.selectorRow}>
            {['Yes', 'No'].map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.selectorChip, formData.parking === p && styles.selectorChipActive]}
                onPress={() => handleChange('parking', p)}
              >
                <Text style={[styles.selectorChipText, formData.parking === p && styles.selectorChipTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Difficulty Level *</Text>
          <View style={styles.selectorRow}>
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

          <Text style={styles.label}>Weather Condition</Text>
          <TextInput
            style={styles.input}
            value={formData.weather}
            onChangeText={(v) => handleChange('weather', v)}
          />

          <Text style={styles.label}>Companions</Text>
          <TextInput
            style={styles.input}
            value={formData.companions}
            onChangeText={(v) => handleChange('companions', v)}
          />

          <Text style={styles.label}>Image Asset / URL</Text>
          <TextInput
            style={styles.input}
            value={formData.image}
            onChangeText={(v) => handleChange('image', v)}
          />

          <Text style={styles.label}>Description / Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(v) => handleChange('description', v)}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
            <Text style={styles.submitBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  screenTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  searchBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  sourceBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  sourceBadgeText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  fetchGpsBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  fetchGpsText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  mapPreviewBox: {
    marginBottom: 14,
  },
  mapPreviewTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectorChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectorChipActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  selectorChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  selectorChipTextActive: {
    color: '#ffffff',
  },
  submitBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
