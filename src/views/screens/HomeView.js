import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useHomeController } from '../../controllers/useHomeController';
import { HikeCard } from '../../components/HikeCard';
import { COLORS } from '../../theme';

export const HomeView = ({ navigation }) => {
  const {
    user,
    signOut,
    filteredTrails,
    selectedDifficulty,
    setSelectedDifficulty,
    myStats,
    difficulties,
    handleNavigateToAddHike,
    handleNavigateToDetail,
    handleNavigateToEdit
  } = useHomeController(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>M-Hike</Text>
          <Text style={styles.brandSubtitle}>Discover nature</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Text style={styles.logoutIcon}>⑂</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Difficulty Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {difficulties.map(item => {
            const isActive = selectedDifficulty === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setSelectedDifficulty(item.value)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {isActive ? `✓  ${item.label}` : item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsHeaderRow}>
          <Text style={styles.statsTitle}>Your hiking summary</Text>
          <Text style={styles.statsName}>{user?.name || 'Explorer'}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{myStats.hikeCount}</Text>
            <Text style={styles.statLabel}>Hikes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{myStats.totalKm.toFixed(1)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{myStats.totalHours.toFixed(1)} h</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>
      </View>

      {/* Hikes List */}
      <FlatList
        data={filteredTrails}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HikeCard
            trail={item}
            onPress={() => handleNavigateToDetail(item.id)}
            onEdit={() => handleNavigateToEdit(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🧭</Text>
            <Text style={styles.emptyText}>No hikes match this filter.</Text>
          </View>
        }
      />

      {/* Floating Action Button (+ New Hike) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleNavigateToAddHike}
        activeOpacity={0.9}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>New Hike</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#4A5568',
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 18,
    color: COLORS.danger,
    fontWeight: '700',
  },
  filterContainer: {
    marginBottom: 14,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EDF2F7',
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#718096',
    textTransform: 'uppercase',
  },
  statsName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A202C',
  },
  statLabel: {
    fontSize: 11,
    color: '#718096',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 6,
    lineHeight: 22,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
