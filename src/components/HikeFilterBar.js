import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useHikes } from '../context/HikeContext';

export const HikeFilterBar = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedDifficulty, 
    setSelectedDifficulty,
    selectedParking,
    setSelectedParking,
    sortBy,
    setSortBy
  } = useHikes();

  const difficulties = ['All', 'Easy', 'Moderate', 'Challenging', 'Expert'];
  const parkingOptions = ['All', 'Yes', 'No'];

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hike name or location..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>❌</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.filterTitle}>Filter by Difficulty:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {difficulties.map(diff => (
          <TouchableOpacity
            key={diff}
            style={[styles.chip, selectedDifficulty === diff && styles.chipActive]}
            onPress={() => setSelectedDifficulty(diff)}
          >
            <Text style={[styles.chipText, selectedDifficulty === diff && styles.chipTextActive]}>
              {diff}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.subRow}>
        <View style={styles.subFilter}>
          <Text style={styles.subTitle}>Parking:</Text>
          <View style={styles.miniChipRow}>
            {parkingOptions.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.miniChip, selectedParking === p && styles.miniChipActive]}
                onPress={() => setSelectedParking(p)}
              >
                <Text style={[styles.miniChipText, selectedParking === p && styles.chipTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.subFilter}>
          <Text style={styles.subTitle}>Sort by:</Text>
          <TouchableOpacity 
            style={styles.sortBtn}
            onPress={() => {
              const options = ['date', 'length', 'rating', 'name'];
              const next = options[(options.indexOf(sortBy) + 1) % options.length];
              setSortBy(next);
            }}
          >
            <Text style={styles.sortBtnText}>🔀 {sortBy.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 14,
  },
  clearIcon: {
    fontSize: 12,
    color: '#94a3b8',
  },
  filterTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
  },
  subFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  miniChipRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  miniChipActive: {
    backgroundColor: '#06b6d4',
  },
  miniChipText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  sortBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sortBtnText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
  },
});
