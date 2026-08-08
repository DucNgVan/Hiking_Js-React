import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useHikes } from '../context/HikeContext';
import { COLORS } from '../theme';

export const HikeCard = ({ trail, onPress, onEdit }) => {
  const { deleteHike } = useHikes();

  const getBadgeStyle = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return { bg: COLORS.badgeEasyBg, text: COLORS.badgeEasyText, border: '#C8E6C9' };
      case 'medium':
      case 'moderate':
        return { bg: COLORS.badgeMediumBg, text: COLORS.badgeMediumText, border: '#FFE0B2' };
      case 'hard':
      case 'challenging':
      case 'expert':
        return { bg: COLORS.badgeHardBg, text: COLORS.badgeHardText, border: '#FFCDD2' };
      default:
        return { bg: COLORS.badgeEasyBg, text: COLORS.badgeEasyText, border: '#C8E6C9' };
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

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      onLongPress={handleLongPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: trail.image }} style={styles.thumbnail} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{trail.name}</Text>
          <View style={[styles.badge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{trail.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.location}>{trail.location}</Text>
        <Text style={styles.meta}>{trail.date}  •  {trail.length} km</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2E1B',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  location: {
    fontSize: 13,
    color: '#4A5568',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
});
