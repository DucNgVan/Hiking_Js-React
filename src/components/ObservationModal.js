import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export const ObservationModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [observation, setObservation] = useState('');
  const [time, setTime] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (initialData) {
      setObservation(initialData.observation || '');
      setTime(initialData.time || '');
      setComments(initialData.comments || '');
    } else {
      setObservation('');
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setComments('');
    }
  }, [initialData, visible]);

  const handleSubmit = () => {
    if (!observation.trim()) {
      Alert.alert("Required Field", "Observation title is required!");
      return;
    }
    onSubmit({ observation, time, comments });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialData ? 'Edit Observation' : 'Add New Observation'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>❌</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Observation Title / Note *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Wildlife sighting, trail block..."
            placeholderTextColor="#64748b"
            value={observation}
            onChangeText={setObservation}
          />

          <Text style={styles.label}>Time of Observation</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10:30 AM"
            placeholderTextColor="#64748b"
            value={time}
            onChangeText={setTime}
          />

          <Text style={styles.label}>Additional Comments</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detailed notes or remarks..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={3}
            value={comments}
            onChangeText={setComments}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Save Observation</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: 14,
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
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
    marginBottom: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
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
  submitBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
