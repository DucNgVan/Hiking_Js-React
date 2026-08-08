import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useHikes } from '../context/HikeContext';

export const ProfileScreen = () => {
  const { user, updateProfile, signOut } = useAuth();
  const { myStats, resetToSampleData } = useHikes();
  const [name, setName] = useState(user?.name || 'Nguyen Van Duc');
  const [phone, setPhone] = useState(user?.phone || '0788551709');

  const handleUpdate = () => {
    updateProfile({ name, phone });
    Alert.alert('Success', 'Profile updated successfully.');
  };

  const handleResetData = async () => {
    Alert.alert(
      'Reset sample data',
      'This will delete all current hikes and load 10 sample hikes in Vietnam. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetToSampleData();
              Alert.alert('Done', 'The database has been cleared and 10 Vietnam sample hikes have been loaded.');
            } catch (error) {
              console.error('Reset data error', error);
              Alert.alert('Error', 'Unable to reset data.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.screenTitle}>My Profile</Text>

        {/* Profile Details Card */}
        <View style={styles.profileCard}>
          <View style={styles.inputOutlineGroup}>
            <Text style={styles.floatingLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nguyen Van Duc"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputOutlineGroup}>
            <Text style={styles.floatingLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="0788551709"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Text style={styles.emailText}>{user?.email || 'admin@gmail.com'}</Text>

          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} activeOpacity={0.85}>
            <Text style={styles.updateBtnText}>Update Info</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Statistics Header */}
        <Text style={styles.sectionGreenTitle}>Personal Statistics</Text>

        {/* Statistics 3-column Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statValGreen}>{myStats.hikeCount}</Text>
            <Text style={styles.statSubLabel}>Hikes</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statValGreen}>{myStats.totalKm.toFixed(1)} km</Text>
            <Text style={styles.statSubLabel}>Distance</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statValGreen}>{myStats.totalHours.toFixed(1)} h</Text>
            <Text style={styles.statSubLabel}>Time</Text>
          </View>
        </View>

        {/* Reset Sample Data Option */}
        <TouchableOpacity style={styles.resetLinkBtn} onPress={handleResetData}>
          <Text style={styles.resetLinkText}>🔄 Reset 10 Vietnam Sample Hikes</Text>
        </TouchableOpacity>

        {/* Sign Out Outlined Red Button matching screenshot 13.51.14 */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.85}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2E7D32',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  inputOutlineGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 14,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    zIndex: 2,
  },
  input: {
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 4,
  },
  emailText: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
  },
  updateBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionGreenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 12,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValGreen: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statSubLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  resetLinkBtn: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resetLinkText: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '700',
  },
  signOutBtn: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
});
