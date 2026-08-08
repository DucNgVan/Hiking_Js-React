import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHikes } from '../context/HikeContext';
import { HikeCard } from '../components/HikeCard';

export const SearchScreen = ({ navigation }) => {
  const { trails } = useHikes();
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const searchResults = trails.filter(t => {
    if (!localSearchQuery.trim()) return true;
    const query = localSearchQuery.toLowerCase();
    const nameMatch = (t.name || '').toLowerCase().includes(query);
    const locMatch = (t.location || '').toLowerCase().includes(query);
    const diffMatch = (t.difficulty || '').toLowerCase().includes(query);
    return nameMatch || locMatch || diffMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Hikes</Text>
      </View>

      {/* Outlined Search Input Box (Local Search Query, independent from Home page) */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputOutlineGroup}>
          <Text style={styles.floatingLabel}>Search by name or location</Text>
          <View style={styles.searchInnerRow}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or location"
              placeholderTextColor="#94A3B8"
              value={localSearchQuery}
              onChangeText={setLocalSearchQuery}
              autoFocus
            />
            {localSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setLocalSearchQuery('')}>
                <Text style={styles.clearIcon}>❌</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => String(item.firebaseId || item.id || `search-item-${index}`)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HikeCard
            trail={item}
            onPress={() => navigation.navigate('HikeDetail', { hikeId: item.firebaseId || item.id })}
            onEdit={() => navigation.navigate('EditHike', { hikeId: item.firebaseId || item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No matching hikes found</Text>
            <Text style={styles.emptySub}>Try searching for "Son Tra", "Da Lat", "Da Nang", "Fansipan", or "Ba Vi".</Text>
          </View>
        }
      />
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
    color: '#2E7D32',
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2E7D32',
  },
  searchBoxContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 6,
  },
  inputOutlineGroup: {
    backgroundColor: '#FAFCF8',
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 14,
    backgroundColor: '#F6F8F5',
    paddingHorizontal: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
    zIndex: 2,
  },
  searchInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 4,
  },
  clearIcon: {
    fontSize: 12,
    color: '#94A3B8',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
