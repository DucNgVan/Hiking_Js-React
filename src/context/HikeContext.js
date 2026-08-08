import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_TRAILS } from '../services/mockTrails';
import { db, isFirebaseEnabled } from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  getDocs
} from 'firebase/firestore';

const HikeContext = createContext();

const STORAGE_KEYS = {
  HIKES: '@hiking_app_hikes_v1',
  FAVORITES: '@hiking_app_favorites_v1',
  USER: '@hiking_app_user_v1',
};

export const HikeProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [trails, setTrails] = useState(INITIAL_TRAILS);
  const [favorites, setFavorites] = useState(['hike-1']);
  const [user, setUser] = useState({
    name: 'Alex Student',
    email: 'alex.student@greenwich.edu.vn',
    role: 'COMP1786 Mobile App Coursework'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedParking, setSelectedParking] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    let unsubscribe = null;

    const loadLocalData = async () => {
      try {
        const storedHikes = await AsyncStorage.getItem(STORAGE_KEYS.HIKES);
        const storedFavs = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);

        if (storedHikes) setTrails(JSON.parse(storedHikes));
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to load local storage data', e);
      } finally {
        setIsLoaded(true);
      }
    };

    if (isFirebaseEnabled && db) {
      const hikesQuery = query(collection(db, 'hikes'), orderBy('date', 'desc'));
      unsubscribe = onSnapshot(hikesQuery, snapshot => {
        const remoteHikes = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setTrails(remoteHikes);
        setIsLoaded(true);
      }, (error) => {
        console.error('Firestore snapshot error', error);
        loadLocalData();
      });
    } else {
      loadLocalData();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && !isFirebaseEnabled) {
      AsyncStorage.setItem(STORAGE_KEYS.HIKES, JSON.stringify(trails)).catch(err => console.error(err));
    }
  }, [trails, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites)).catch(err => console.error(err));
    }
  }, [favorites, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)).catch(err => console.error(err));
    }
  }, [user, isLoaded]);

  const addHike = async (newHikeData) => {
    const numericIds = trails.map(t => typeof t.id === 'number' ? t.id : parseInt(t.id) || 0);
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    const nextId = maxId > 0 ? maxId + 1 : 1;

    const startLat = parseFloat(newHikeData.lat) || parseFloat(newHikeData.latitude) || 12.0431;
    const startLng = parseFloat(newHikeData.lng) || parseFloat(newHikeData.longitude) || 108.4411;

    const creatorName = newHikeData.creatorName || authUser?.name || 'Unknown User';
    const creatorEmail = newHikeData.creatorEmail || authUser?.email || '';
    const creatorUid = newHikeData.creatorUid || authUser?.uid || '';
    const normalizedTime = newHikeData.time ?? newHikeData.hours ?? '';

    const hike = {
      id: nextId,
      firebaseId: newHikeData.firebaseId || null,
      name: newHikeData.name || 'New Hike',
      location: newHikeData.location || 'Da Lat',
      date: newHikeData.date || '05/08/2026',
      length: (newHikeData.length || '5').toString(),
      lengthKm: parseFloat(newHikeData.length) || 5.0,
      time: normalizedTime,
      hours: typeof normalizedTime === 'number' ? normalizedTime : Number(normalizedTime) || 0,
      difficulty: newHikeData.difficulty || 'Medium',
      parking: newHikeData.parking || 'Yes',
      weather: newHikeData.weather || 'Cool',
      companions: newHikeData.companions || 'Friends',
      imageResName: newHikeData.imageResName || 'img1',
      image: newHikeData.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
      description: newHikeData.description || '',
      plannedRoute: newHikeData.plannedRoute || [
        { lat: startLat, lng: startLng },
        { lat: startLat + 0.005, lng: startLng + 0.005 }
      ],
      routePoints: newHikeData.routePoints || [
        { lat: startLat, lng: startLng, weather: newHikeData.weather || 'Cool' }
      ],
      actualRoute: newHikeData.actualRoute || [
        { lat: startLat, lng: startLng },
        { lat: startLat + 0.002, lng: startLng + 0.002 },
        { lat: startLat + 0.005, lng: startLng + 0.005 }
      ],
      coordinates: { latitude: startLat, longitude: startLng },
      observations: newHikeData.observations || [],
      createdAt: new Date().toISOString(),
      creatorName,
      creatorEmail,
      creatorUid,
      createdBy: newHikeData.createdBy || creatorUid || creatorEmail || authUser?.email || null,
    };

    if (isFirebaseEnabled && db) {
      try {
        const hikeRef = doc(collection(db, 'hikes'));
        const hikeWithId = { ...hike, id: hike.id, firebaseId: hikeRef.id };
        await setDoc(hikeRef, hikeWithId);
        return hikeWithId;
      } catch (e) {
        console.error('Add hike Firestore error', e);
        return hike;
      }
    }

    setTrails(prev => [hike, ...prev]);
    return hike;
  };

  const updateHike = async (id, updatedData) => {
    if (isFirebaseEnabled && db) {
      try {
        const hikeRef = doc(db, 'hikes', id);
        const existingDoc = await getDoc(hikeRef);
        if (existingDoc.exists()) {
          await updateDoc(hikeRef, {
            ...updatedData,
            lengthKm: parseFloat(updatedData.length) || existingDoc.data().lengthKm
          });
        }
      } catch (e) {
        console.error('Update hike Firestore error', e);
      }
    } else {
      setTrails(prev => prev.map(trail => {
        if (trail.id === id) {
          return {
            ...trail,
            ...updatedData,
            lengthKm: parseFloat(updatedData.length) || trail.lengthKm
          };
        }
        return trail;
      }));
    }
  };

  const deleteHike = async (id) => {
    if (isFirebaseEnabled && db) {
      try {
        await deleteDoc(doc(db, 'hikes', id));
      } catch (e) {
        console.error('Delete hike Firestore error', e);
      }
    } else {
      setTrails(prev => prev.filter(t => t.id !== id));
    }
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const deleteAllHikes = async () => {
    if (isFirebaseEnabled && db) {
      try {
        const snapshot = await getDocs(collection(db, 'hikes'));
        const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'hikes', docSnap.id)));
        await Promise.all(deletePromises);
      } catch (e) {
        console.error('Delete all hikes Firestore error', e);
      }
    }
    setTrails([]);
    setFavorites([]);
  };

  const resetToSampleData = async () => {
    await deleteAllHikes();

    if (isFirebaseEnabled && db) {
      try {
        const hikeCollection = collection(db, 'hikes');
        for (const sample of INITIAL_TRAILS) {
          const newDoc = doc(hikeCollection);
          await setDoc(newDoc, {
            ...sample,
            id: sample.id,
            firebaseId: newDoc.id,
            createdAt: sample.createdAt || new Date().toISOString()
          });
        }
      } catch (e) {
        console.error('Reset sample data Firestore error', e);
      }
    }

    setTrails(INITIAL_TRAILS);
    setFavorites([]);
  };

  const addObservation = async (hikeId, observationData) => {
    const newObs = {
      id: `obs-${Date.now()}`,
      hikeId,
      observation: observationData.observation,
      time: observationData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      comments: observationData.comments || ''
    };

    if (isFirebaseEnabled && db) {
      try {
        const hikeRef = doc(db, 'hikes', hikeId);
        await updateDoc(hikeRef, {
          observations: newObs
            ? [...(trails.find(trail => trail.id === hikeId)?.observations || []), newObs]
            : [newObs]
        });
      } catch (e) {
        console.error('Add observation Firestore error', e);
      }
    } else {
      setTrails(prev => prev.map(trail => {
        if (trail.id === hikeId) {
          return {
            ...trail,
            observations: [newObs, ...(trail.observations || [])]
          };
        }
        return trail;
      }));
    }
  };

  const updateObservation = async (hikeId, obsId, updatedData) => {
    if (isFirebaseEnabled && db) {
      try {
        const hikeRef = doc(db, 'hikes', hikeId);
        const trail = trails.find(t => t.id === hikeId);
        if (!trail) return;
        const updatedObs = (trail.observations || []).map(obs => obs.id === obsId ? { ...obs, ...updatedData } : obs);
        await updateDoc(hikeRef, { observations: updatedObs });
      } catch (e) {
        console.error('Update observation Firestore error', e);
      }
    } else {
      setTrails(prev => prev.map(trail => {
        if (trail.id === hikeId) {
          const updatedObs = (trail.observations || []).map(obs => {
            if (obs.id === obsId) {
              return { ...obs, ...updatedData };
            }
            return obs;
          });
          return { ...trail, observations: updatedObs };
        }
        return trail;
      }));
    }
  };

  const deleteObservation = async (hikeId, obsId) => {
    if (isFirebaseEnabled && db) {
      try {
        const hikeRef = doc(db, 'hikes', hikeId);
        const trail = trails.find(t => t.id === hikeId);
        if (!trail) return;
        const updatedObs = (trail.observations || []).filter(obs => obs.id !== obsId);
        await updateDoc(hikeRef, { observations: updatedObs });
      } catch (e) {
        console.error('Delete observation Firestore error', e);
      }
    } else {
      setTrails(prev => prev.map(trail => {
        if (trail.id === hikeId) {
          return {
            ...trail,
            observations: (trail.observations || []).filter(obs => obs.id !== obsId)
          };
        }
        return trail;
      }));
    }
  };

  const toggleFavorite = (hikeId) => {
    setFavorites(prev =>
      prev.includes(hikeId) ? prev.filter(id => id !== hikeId) : [...prev, hikeId]
    );
  };

  const filteredTrails = trails
    .filter(trail => {
      const matchesSearch = trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            trail.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || trail.difficulty === selectedDifficulty;
      const matchesParking = selectedParking === 'All' || trail.parking === selectedParking;
      return matchesSearch && matchesDifficulty && matchesParking;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'length') return b.lengthKm - a.lengthKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const lastHike = trails.find(t => t.id === 2 || t.id === '2') || trails[0] || null;

  const myHikes = trails.filter(trail => {
    const currentUserEmail = authUser?.email || '';
    const currentUserName = authUser?.name || '';
    const currentUserUid = authUser?.uid || '';

    const emailMatches = Boolean(trail.creatorEmail) && trail.creatorEmail === currentUserEmail;
    const uidMatches = Boolean(trail.creatorUid) && trail.creatorUid === currentUserUid;
    const createdByMatches = Boolean(trail.createdBy) && (
      trail.createdBy === currentUserEmail || trail.createdBy === currentUserUid
    );
    const nameMatches = Boolean(trail.creatorName) && trail.creatorName === currentUserName;

    return emailMatches || uidMatches || createdByMatches || nameMatches;
  });

  const myStats = myHikes.reduce((stats, trail) => {
    const km = Number(trail.lengthKm || trail.length || 0);
    const hours = Number(trail.hours || trail.time || trail.durationHours || 0);
    return {
      hikeCount: stats.hikeCount + 1,
      totalKm: stats.totalKm + km,
      totalHours: stats.totalHours + hours,
    };
  }, { hikeCount: 0, totalKm: 0, totalHours: 0 });

  return (
    <HikeContext.Provider value={{
      trails,
      filteredTrails,
      lastHike,
      myHikes,
      myStats,
      favorites,
      user,
      setUser,
      isLoaded,
      toggleFavorite,
      addHike,
      updateHike,
      deleteHike,
      deleteAllHikes,
      resetToSampleData,
      addObservation,
      updateObservation,
      deleteObservation,
      searchQuery,
      setSearchQuery,
      selectedDifficulty,
      setSelectedDifficulty,
      selectedParking,
      setSelectedParking,
      sortBy,
      setSortBy
    }}>
      {children}
    </HikeContext.Provider>
  );
};

export const useHikes = () => {
  const context = useContext(HikeContext);
  if (!context) {
    throw new Error('useHikes must be used within a HikeProvider');
  }
  return context;
};
