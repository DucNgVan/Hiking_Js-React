import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useHikes } from '../context/HikeContext';
import { COLORS } from '../theme';

export const ProfileScreen = () => {
  const { user, updateProfile, signOut } = useAuth();
  const { myStats, resetToSampleData } = useHikes();
  const [name, setName] = useState(user?.name || 'Nguyen Van Duc');
  const [phone, setPhone] = useState(user?.phone || '0788551709');

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

  const handleUpdate = () => {
    updateProfile(name, phone);
    Alert.alert("Profile Updated", "Your profile information has been saved!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Header */}
        <Text style={styles.screenTitle}>My Profile</Text>

        {/* Profile Details Card */}
        <View style={styles.card}>
          {/* Full Name Field */}
          <View style={styles.inputOutlineGroup}>
            <Text style={styles.floatingLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Phone Number Field */}
          <View style={styles.inputOutlineGroup}>
            <Text style={styles.floatingLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Email Text */}
          <Text style={styles.emailText}>{user?.email || 'admin@gmail.com'}</Text>

          {/* Update Info Button */}
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateBtnText}>Update Info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your stats</Text>
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

        <TouchableOpacity style={styles.resetBtn} onPress={handleResetData}>
          <Text style={styles.resetBtnText}>Reset to 10 Vietnam sample hikes</Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputOutlineGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    zIndex: 2,
  },
  input: {
    fontSize: 15,
    color: '#1A202C',
    paddingVertical: 2,
  },
  emailText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 20,
    paddingLeft: 4,
  },
  updateBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: '#4A5568',
    marginTop: 2,
  },
  resetBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signOutBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});
