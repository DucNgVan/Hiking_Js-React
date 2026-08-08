import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useHikes } from '../context/HikeContext';
import { COLORS } from '../theme';
import { getImageSource } from '../services/imageService';

export const HikeCard = ({ trail, onPress, onEdit }) => {
  const { deleteHike } = useHikes();

  const getBadgeStyle = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return { bg: '#EDFDF5', text: '#276749' };
      case 'medium':
      case 'moderate':
        return { bg: '#FFF5F5', text: '#DD6B20' };
      case 'hard':
      case 'challenging':
      case 'expert':
        return { bg: '#FFEBEE', text: '#C53030' };
      default:
        return { bg: '#EDFDF5', text: '#276749' };
    }
  };

  const badgeStyle = getBadgeStyle(trail.difficulty);

  const handleLongPress = () => {
    Alert.alert(
      "Manage Hike",
      `Choose action for "${trail.name}":`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Edit Details", onPress: onEdit },
        { text: "Delete Hike", style: "destructive", onPress: () => deleteHike(trail.id) }
      ]
    );
  };

  const imageSource = getImageSource(trail.image, trail.imageResName);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      onLongPress={handleLongPress}
      activeOpacity={0.85}
    >
      <Image source={imageSource} style={styles.thumbnail} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{trail.name}</Text>
          <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{trail.difficulty || 'Medium'}</Text>
          </View>
        </View>

        <Text style={styles.location} numberOfLines={1}>{trail.location}</Text>
        <Text style={styles.meta}>{trail.date}  •  {trail.length} km</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAFCF8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 14,
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});
