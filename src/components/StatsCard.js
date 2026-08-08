import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHikes } from '../context/HikeContext';

export const StatsCard = () => {
  const { trails, favorites } = useHikes();

  const totalDistance = trails.reduce((sum, t) => sum + (parseFloat(t.length) || 0), 0).toFixed(1);
  const totalObs = trails.reduce((sum, t) => sum + (t.observations?.length || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.icon}>🧭</Text>
        <Text style={styles.value}>{trails.length}</Text>
        <Text style={styles.label}>Hikes</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.icon}>🏔️</Text>
        <Text style={styles.value}>{totalDistance} km</Text>
        <Text style={styles.label}>Distance</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.icon}>👁️</Text>
        <Text style={styles.value}>{totalObs}</Text>
        <Text style={styles.label}>Obs</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.icon}>❤️</Text>
        <Text style={styles.value}>{favorites.length}</Text>
        <Text style={styles.label}>Saved</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 16,
    marginBottom: 2,
  },
  value: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  label: {
    color: '#64748b',
    fontSize: 11,
  },
});
