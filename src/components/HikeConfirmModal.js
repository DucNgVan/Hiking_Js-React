import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export const HikeConfirmModal = ({ visible, onClose, onConfirm, hikeData }) => {
  if (!hikeData) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Confirm Hike Entry</Text>
          <Text style={styles.subtitle}>
            Please review your details carefully before saving to database:
          </Text>

          <ScrollView style={styles.summaryBox}>
            <Text style={styles.itemText}><Text style={styles.bold}>Name:</Text> {hikeData.name}</Text>
            <Text style={styles.itemText}><Text style={styles.bold}>Location:</Text> {hikeData.location}</Text>
            <Text style={styles.itemText}><Text style={styles.bold}>Date:</Text> {hikeData.date}</Text>
            <Text style={styles.itemText}><Text style={styles.bold}>Parking:</Text> {hikeData.parking}</Text>
            <Text style={styles.itemText}><Text style={styles.bold}>Length:</Text> {hikeData.length} km</Text>
            <Text style={styles.itemText}><Text style={styles.bold}>Difficulty:</Text> {hikeData.difficulty}</Text>
            {hikeData.weather ? <Text style={styles.itemText}><Text style={styles.bold}>Weather:</Text> {hikeData.weather}</Text> : null}
            {hikeData.companions ? <Text style={styles.itemText}><Text style={styles.bold}>Companions:</Text> {hikeData.companions}</Text> : null}
            {hikeData.description ? <Text style={styles.itemText}><Text style={styles.bold}>Description:</Text> {hikeData.description}</Text> : null}
          </ScrollView>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Back to Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#10b981',
    maxHeight: '80%',
  },
  title: {
    color: '#10b981',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 14,
  },
  summaryBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemText: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 6,
  },
  bold: {
    fontWeight: '700',
    color: '#f8fafc',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
