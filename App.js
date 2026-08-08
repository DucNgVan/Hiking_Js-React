import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { HikeProvider } from './src/context/HikeContext';
import { COLORS } from './src/theme';

import { SignInScreen } from './src/screens/SignInScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MapScreen } from './src/screens/MapScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { HikeDetailScreen } from './src/screens/HikeDetailScreen';
import { AddHikeScreen } from './src/screens/AddHikeScreen';
import { EditHikeScreen } from './src/screens/EditHikeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          paddingHorizontal: 6,
          elevation: 4,
          shadowOpacity: 0.06,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 16 }}>📅</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          tabBarLabel: 'Live GPS',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 16 }}>🎯</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 16 }}>🔍</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 16 }}>👥</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainNavigation() {
  const { isLoggedIn, isAuthLoaded } = useAuth();

  if (!isAuthLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {!isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.bgMain },
            headerTintColor: '#1A202C',
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="HikeDetail" 
            component={HikeDetailScreen} 
            options={{ title: 'Hike Details' }} 
          />
          <Stack.Screen 
            name="AddHike" 
            component={AddHikeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditHike" 
            component={EditHikeScreen} 
            options={{ title: 'Edit Hike Entry' }} 
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HikeProvider>
        <MainNavigation />
      </HikeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
  },
  iconActive: {
    backgroundColor: COLORS.primaryLight,
  },
});
