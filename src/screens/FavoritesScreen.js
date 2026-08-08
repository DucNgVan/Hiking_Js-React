import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHikes } from '../context/HikeContext';
import { HikeCard } from '../components/HikeCard';

export const FavoritesScreen = ({ navigation }) => {
  const { trails, favorites } = useHikes();

  const favoriteTrails = trails.filter(t => favorites.includes(t.id));

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favoriteTrails}
        keyExtractor={(item, index) => String(item.firebaseId || item.id || `fav-item-${index}`)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>❤️ Saved Favorite Hikes</Text>
            <Text style={styles.headerSub}>Bookmarked trails for quick access ({favoriteTrails.length})</Text>
          </View>
        }
        renderItem={({ item }) => (
          <HikeCard
            trail={item}
            onPress={() => navigation.navigate('HikeDetail', { hikeId: item.id })}
            onEdit={() => navigation.navigate('EditHike', { hikeId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>No Favorites Saved Yet</Text>
            <Text style={styles.emptySub}>
              Tap the heart icon on any hike card to save it to your favorites list.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 12,
  },
  emptyBox: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySub: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 13,
  },
});
