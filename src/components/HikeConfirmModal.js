import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export const HikeConfirmModal = ({ visible, onClose, onConfirm, hikeData }) => {
  if (!hikeData) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Review Your Adventure</Text>

          <ScrollView style={styles.summaryBox} showsVerticalScrollIndicator={false}>
            <View style={styles.fieldGroup}>
              <Text style={styles.blueLabel}>HIKE NAME</Text>
              <Text style={styles.fieldValue}>{hikeData.name}</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.blueLabel}>LOCATION</Text>
              <Text style={styles.fieldValue}>{hikeData.location}</Text>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.blueLabel}>DATE & START TIME</Text>
                <Text style={styles.fieldValue}>{hikeData.date}</Text>
                <Text style={styles.greenTimeValue}>{hikeData.startTime || '05:35 PM'}</Text>
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.blueLabel}>DIFFICULTY</Text>
                <Text style={styles.fieldValue}>{hikeData.difficulty}</Text>
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.blueLabel}>DISTANCE</Text>
                <Text style={styles.fieldValue}>{hikeData.length} km</Text>
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.blueLabel}>DURATION</Text>
                <Text style={styles.fieldValue}>{hikeData.time || hikeData.duration || '2'} h</Text>
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.blueLabel}>WEATHER</Text>
                <Text style={styles.fieldValue}>{hikeData.weather || 'Sunny'}</Text>
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.blueLabel}>PARKING</Text>
                <Text style={styles.fieldValue}>{hikeData.parking || 'Available'}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.goBackBtn} onPress={onClose}>
              <Text style={styles.goBackText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
              <Text style={styles.confirmText}>Confirm & Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#F1F5F2',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    color: '#2E7D32',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  summaryBox: {
    maxHeight: 360,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  blueLabel: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldValue: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
  },
  greenTimeValue: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  goBackBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  goBackText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 14,
  },
  confirmBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
