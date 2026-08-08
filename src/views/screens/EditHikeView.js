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
        <Text style={styles.sectionTitle}>Hike Record Not Found</Text>
      </View>
    );
  }

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];
  const weatherOptions = ['Sunny & Breezy', 'Rainy', 'Cloudy', 'Cool', 'Misty', 'Windy'];
  const parkingOptions = [
    { label: 'Available', value: 'Available' },
    { label: 'Not Available', value: 'Not Available' }
  ];
  const imageOptions = [
    { label: 'Forest Trail (img1)', value: 'img1' },
    { label: 'Mountain Peak (img2)', value: 'img2' },
    { label: 'Valley View (img3)', value: 'img3' },
    { label: 'Rocky Path (img4)', value: 'img4' },
    { label: 'River Walk (img5)', value: 'img5' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Hike Entry</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Location & GPS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionIcon}>🎯</Text>
          <Text style={styles.sectionTitle}>Location & GPS</Text>
        </View>

        {/* Hike Name Input */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Hike Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Son Tra"
            placeholderTextColor="#A0AEC0"
            value={formData.name}
            onChangeText={(v) => handleChange('name', v)}
          />
        </View>

        {/* Search Address Box with Green Pin & Magnifier */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Search Address or Location*</Text>
          <View style={styles.searchInnerRow}>
            <View style={styles.greenPinBadge}>
              <Text style={{ fontSize: 16 }}>📍</Text>
            </View>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="e.g. đường Hoàng Sa, Sơn Trà, Đà Nẵng"
              placeholderTextColor="#A0AEC0"
              value={formData.location}
              onChangeText={(v) => handleChange('location', v)}
              onSubmitEditing={handleSearchAddress}
            />
            <TouchableOpacity
              onPress={handleSearchAddress}
              disabled={isGeocoding}
              style={styles.searchIconBtn}
            >
              {isGeocoding ? (
                <ActivityIndicator color="#2D3748" size="small" />
              ) : (
                <Text style={styles.searchMagnifier}>🔍</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Green Resolution Badge */}
        {geocodingSource && (
          <View style={styles.resolvedBadge}>
            <Text style={styles.resolvedBadgeText}>
              ✔ Location resolved via {geocodingSource}
            </Text>
          </View>
        )}

        {/* MiniMap Preview */}
        <View style={styles.mapContainerBox}>
          <MiniMap
            lat={numLat}
            lng={numLng}
            title={formData.name || 'Hike Location'}
            subtitle={formData.location || 'Start Point'}
            height={200}
            showControls={true}
            onMapTap={handleMapTap}
          />
          <TouchableOpacity
            style={styles.useGpsGreenBtn}
            onPress={handleFetchGpsStart}
            activeOpacity={0.85}
          >
            {isLocating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.useGpsInner}>
                <Text style={{ fontSize: 16, marginRight: 6 }}>🎯</Text>
                <Text style={styles.useGpsText}>Use Current GPS Location</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Latitude & Longitude Inputs */}
        <View style={styles.rowTwoCols}>
          <View style={[styles.inputOutlineGroup, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>Latitude</Text>
            <TextInput
              style={styles.input}
              placeholder="16.101240"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
              value={formData.startLat}
              onChangeText={(v) => handleChange('startLat', v)}
            />
          </View>
          <View style={[styles.inputOutlineGroup, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>Longitude</Text>
            <TextInput
              style={styles.input}
              placeholder="108.265363"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
              value={formData.startLng}
              onChangeText={(v) => handleChange('startLng', v)}
            />
          </View>
        </View>

        {/* Section 2: Trip Details */}
        <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
          <Text style={styles.sectionIcon}>🎒</Text>
          <Text style={styles.sectionTitle}>Trip Details</Text>
        </View>

        {/* Hike Date & Start Time */}
        <View style={styles.rowTwoCols}>
          <View style={[styles.inputOutlineGroup, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>Hike Date*</Text>
            <TextInput
              style={styles.input}
              placeholder="08/08/2026"
              placeholderTextColor="#A0AEC0"
              value={formData.date}
              onChangeText={(v) => handleChange('date', v)}
            />
          </View>
          <View style={[styles.inputOutlineGroup, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>Start Time*</Text>
            <TextInput
              style={styles.input}
              placeholder="05:35 PM"
              placeholderTextColor="#A0AEC0"
              value={formData.startTime}
              onChangeText={(v) => handleChange('startTime', v)}
            />
          </View>
        </View>

        {/* Distance & Duration */}
        <View style={styles.rowTwoCols}>
          <View style={[styles.inputOutlineGroup, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>Distance (km)*</Text>
            <TextInput
              style={styles.input}
              placeholder="13"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
              value={formData.length}
              onChangeText={(v) => handleChange('length', v)}
            />
          </View>
          <View style={[styles.inputOutlineGroup, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>Duration (h)*</Text>
            <TextInput
              style={styles.input}
              placeholder="2"
              placeholderTextColor="#A0AEC0"
              keyboardType="decimal-pad"
              value={formData.time}
              onChangeText={(v) => handleChange('time', v)}
            />
          </View>
        </View>

        {/* Difficulty Level Selector */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Difficulty Level*</Text>
          <View style={styles.chipRow}>
            {difficultyOptions.map(diff => (
              <TouchableOpacity
                key={diff}
                style={[styles.chip, formData.difficulty === diff && styles.chipActive]}
                onPress={() => handleChange('difficulty', diff)}
              >
                <Text style={[styles.chipText, formData.difficulty === diff && styles.chipTextActive]}>
                  {diff}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weather Condition Selector */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Weather Condition*</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {weatherOptions.map(w => (
              <TouchableOpacity
                key={w}
                style={[styles.chip, formData.weather === w && styles.chipActive]}
                onPress={() => handleChange('weather', w)}
              >
                <Text style={[styles.chipText, formData.weather === w && styles.chipTextActive]}>
                  {w}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Parking Available Selector */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Parking Available*</Text>
          <View style={styles.chipRow}>
            {parkingOptions.map(p => (
              <TouchableOpacity
                key={p.value}
                style={[styles.chip, (formData.parking === p.value || (p.value === 'Available' && formData.parking === 'Yes')) && styles.chipActive]}
                onPress={() => handleChange('parking', p.value)}
              >
                <Text style={[styles.chipText, (formData.parking === p.value || (p.value === 'Available' && formData.parking === 'Yes')) && styles.chipTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Header Image Selector */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Header Image*</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {imageOptions.map(img => (
              <TouchableOpacity
                key={img.value}
                style={[styles.chip, (formData.imageResName === img.value || formData.image === img.value) && styles.chipActive]}
                onPress={() => {
                  handleChange('imageResName', img.value);
                  handleChange('image', img.value);
                }}
              >
                <Text style={[styles.chipText, (formData.imageResName === img.value || formData.image === img.value) && styles.chipTextActive]}>
                  {img.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Description / Notes */}
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Description & Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Trail details and observations..."
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={3}
            value={formData.description}
            onChangeText={(v) => handleChange('description', v)}
          />
        </View>

        {/* Save Changes Green Button */}
        <TouchableOpacity style={styles.saveGreenBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveGreenBtnText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Discard Link */}
        <TouchableOpacity style={styles.discardLinkBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.discardLinkText}>Discard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    fontSize: 20,
    fontWeight: '800',
    color: '#1A202C',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E4620',
  },
  inputOutlineGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 14,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 14,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    zIndex: 2,
  },
  input: {
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 4,
  },
  searchInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenPinBadge: {
    marginRight: 8,
  },
  searchIconBtn: {
    padding: 4,
    marginLeft: 6,
  },
  searchMagnifier: {
    fontSize: 18,
  },
  resolvedBadge: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  resolvedBadgeText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  mapContainerBox: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
  },
  useGpsGreenBtn: {
    backgroundColor: '#2D7A32',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  useGpsInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  useGpsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#2D7A32',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#1E4620',
    fontWeight: '800',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  saveGreenBtn: {
    backgroundColor: '#2D7A32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
    shadowColor: '#2D7A32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saveGreenBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  discardLinkBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  discardLinkText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
