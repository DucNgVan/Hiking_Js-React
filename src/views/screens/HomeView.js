import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const handleConfirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: signOut }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>M-Hike</Text>
          <Text style={styles.brandSubtitle}>Hello, {user?.name || user?.email || 'Nguyen Van Duc'}</Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={handleConfirmSignOut}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Top 3 Summary Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Hikes</Text>
          <Text style={styles.statValueGreen}>{myStats.hikeCount}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValueGreen}>{myStats.totalKm.toFixed(1)} km</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValueGreen}>{myStats.totalHours.toFixed(1)} h</Text>
        </View>
      </View>

      {/* Difficulty Filter Chips */}
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

      {/* Hikes List */}
      <FlatList
        data={filteredTrails}
        keyExtractor={(item, index) => String(item.firebaseId || item.id || `hike-item-${index}`)}
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
    backgroundColor: '#F6F8F5',
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
    fontSize: 28,
    fontWeight: '900',
    color: '#2E7D32',
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  logoutIcon: {
    fontSize: 15,
    marginRight: 4,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
  },
  filterContainer: {
    marginBottom: 14,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  chipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  chipTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#2E7D32',
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
    fontWeight: '800',
  },
});
