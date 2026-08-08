import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHikes } from '../context/HikeContext';
import { HikeCard } from '../components/HikeCard';
import { COLORS } from '../theme';

export const SearchScreen = ({ navigation }) => {
  const { searchQuery, setSearchQuery, filteredTrails } = useHikes();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Hikes</Text>
      </View>

      {/* Search Input Box */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.searchInner}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location"
            placeholderTextColor="#718096"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>❌</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={filteredTrails}
        keyExtractor={(item, index) => String(item.firebaseId || item.id || `search-item-${index}`)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <HikeCard
            trail={item}
            onPress={() => navigation.navigate('HikeDetail', { hikeId: item.id })}
            onEdit={() => navigation.navigate('EditHike', { hikeId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No matching hikes found</Text>
            <Text style={styles.emptySub}>Try searching for "Da Lat", "Da Nang", "Fansipan", or "Ba Vi".</Text>
          </View>
        }
      />
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
    color: '#1A202C',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  searchBoxContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A202C',
  },
  clearIcon: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
  },
});
