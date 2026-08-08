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
  const [rawHikes, setRawHikes] = useState([]);
  const [rawObservations, setRawObservations] = useState([]);
  const [trails, setTrails] = useState(INITIAL_TRAILS);
  const [favorites, setFavorites] = useState(['hike-1']);
  const [user, setUser] = useState({
    name: 'Nguyen Van Duc',
    email: 'admin@gmail.com',
    role: 'COMP1786 Mobile App Coursework'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedParking, setSelectedParking] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    let unsubscribeHikes = null;
    let unsubscribeObs = null;

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
      try {
        // 1. Listen to hikes collection
        const hikesQuery = query(collection(db, 'hikes'));
        unsubscribeHikes = onSnapshot(hikesQuery, snapshot => {
          const remoteHikes = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            firebaseId: docSnap.id,
            ...docSnap.data()
          }));
          setRawHikes(remoteHikes);
          setIsLoaded(true);
        }, (error) => {
          console.error('Firestore hikes snapshot error', error);
          loadLocalData();
        });

        // 2. Listen to observations collection
        const obsQuery = query(collection(db, 'observations'));
        unsubscribeObs = onSnapshot(obsQuery, snapshot => {
          const remoteObs = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            firebaseId: docSnap.id,
            ...docSnap.data()
          }));
          setRawObservations(remoteObs);
        }, (error) => {
          console.error('Firestore observations snapshot error', error);
        });
      } catch (err) {
        console.error('Firestore connection error:', err);
        loadLocalData();
      }
    } else {
      loadLocalData();
    }

    return () => {
      if (unsubscribeHikes) unsubscribeHikes();
      if (unsubscribeObs) unsubscribeObs();
    };
  }, []);

  // Merge rawHikes and rawObservations whenever either updates
  useEffect(() => {
    if (!isFirebaseEnabled || !rawHikes || rawHikes.length === 0) return;

    const mergedTrails = rawHikes.map(hike => {
      const hikeIdStr = String(hike.id);
      const firebaseIdStr = hike.firebaseId || hike.id;

      // Filter observations belonging to this hike
      const matchedObs = rawObservations.filter(obs => {
        const obsHikeFbId = String(obs.hikeFirebaseId || '');
        const obsHikeId = String(obs.hikeId || '');
        return (
          (firebaseIdStr && obsHikeFbId === String(firebaseIdStr)) ||
          (hikeIdStr && obsHikeFbId === hikeIdStr) ||
          (hikeIdStr && obsHikeId === hikeIdStr)
        );
      }).map(obs => ({
        id: obs.id || obs.firebaseId,
        firebaseId: obs.firebaseId || obs.id,
        text: obs.observation || obs.text || 'Field observation note',
        observation: obs.observation || obs.text || 'Field observation note',
        time: obs.time || '10:30 AM',
        comments: obs.comments || '',
        weather: obs.weather || 'Sunny'
      }));

      // If hike has embedded observations, merge them as fallback
      const finalObs = matchedObs.length > 0 ? matchedObs : (hike.observations || []);

      return {
        ...hike,
        id: hike.firebaseId || hike.id,
        firebaseId: hike.firebaseId || hike.id,
        observations: finalObs
      };
    });

    setTrails(mergedTrails);
  }, [rawHikes, rawObservations]);

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

    const startLat = parseFloat(newHikeData.lat) || parseFloat(newHikeData.startLat) || 16.047079;
    const startLng = parseFloat(newHikeData.lng) || parseFloat(newHikeData.startLng) || 108.206230;

    const creatorName = newHikeData.creatorName || authUser?.name || 'Nguyen Van Duc';
    const creatorEmail = newHikeData.creatorEmail || authUser?.email || 'admin@gmail.com';
    const creatorUid = newHikeData.creatorUid || authUser?.uid || 'dTV4YE35UcNjCGFM92uwSmvDFGw1';
    const normalizedTime = newHikeData.time ?? newHikeData.duration ?? '2';

    const hike = {
      id: nextId,
      firebaseId: newHikeData.firebaseId || null,
      name: newHikeData.name || 'New Hike',
      location: newHikeData.location || 'Da Nang',
      date: newHikeData.date || new Date().toLocaleDateString('en-GB'),
      startTime: newHikeData.startTime || '05:35 PM',
      length: (newHikeData.length || '5').toString(),
      lengthKm: parseFloat(newHikeData.length) || 5.0,
      time: normalizedTime,
      duration: normalizedTime,
      hours: Number(normalizedTime) || 0,
      difficulty: newHikeData.difficulty || 'Medium',
      parking: newHikeData.parking || 'Available',
      weather: newHikeData.weather || 'Cool',
      companions: newHikeData.companions || null,
      imageResName: newHikeData.imageResName || 'img4',
      image: newHikeData.image || 'img4',
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
      creatorUid: creatorUid || 'dTV4YE35UcNjCGFM92uwSmvDFGw1',
      creatorId: creatorUid || 'dTV4YE35UcNjCGFM92uwSmvDFGw1',
      createdBy: newHikeData.createdBy || creatorUid || creatorEmail || 'admin@gmail.com',
    };

    if (isFirebaseEnabled && db) {
      try {
        const hikeRef = doc(collection(db, 'hikes'));
        const hikeWithId = { ...hike, id: hikeRef.id, firebaseId: hikeRef.id };
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
        const hikeRef = doc(db, 'hikes', String(id));
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
        if (trail.id === id || trail.firebaseId === id) {
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
        await deleteDoc(doc(db, 'hikes', String(id)));
      } catch (e) {
        console.error('Delete hike Firestore error', e);
      }
    } else {
      setTrails(prev => prev.filter(t => t.id !== id && t.firebaseId !== id));
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
            id: newDoc.id,
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
    const targetHike = trails.find(t => t.id === hikeId || t.firebaseId === hikeId || String(t.id) === String(hikeId));
    const targetFbId = targetHike?.firebaseId || targetHike?.id || String(hikeId);

    const obsText = observationData.text || observationData.observation || '';
    const obsTime = observationData.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (isFirebaseEnabled && db) {
      try {
        const obsRef = doc(collection(db, 'observations'));
        const newObsDoc = {
          observation: obsText,
          text: obsText,
          comments: observationData.comments || '',
          time: obsTime,
          weather: observationData.weather || 'Sunny',
          hikeFirebaseId: String(targetFbId),
          hikeId: String(targetHike?.id || targetFbId),
          firebaseId: obsRef.id,
          createdAt: new Date().toISOString()
        };
        await setDoc(obsRef, newObsDoc);
      } catch (e) {
        console.error('Add observation Firestore error', e);
      }
    } else {
      const newObs = {
        id: `obs-${Date.now()}`,
        firebaseId: `obs-${Date.now()}`,
        hikeId,
        observation: obsText,
        text: obsText,
        time: obsTime,
        comments: observationData.comments || ''
      };
      setTrails(prev => prev.map(trail => {
        if (trail.id === hikeId || trail.firebaseId === hikeId) {
          return {
            ...trail,
            observations: [newObs, ...(trail.observations || [])]
          };
        }
        return trail;
      }));
    }
  };

  const deleteObservation = async (hikeId, obsId) => {
    if (isFirebaseEnabled && db) {
      try {
        await deleteDoc(doc(db, 'observations', String(obsId)));
      } catch (e) {
        console.error('Delete observation Firestore error', e);
      }
    } else {
      setTrails(prev => prev.map(trail => {
        if (trail.id === hikeId || trail.firebaseId === hikeId) {
          return {
            ...trail,
            observations: (trail.observations || []).filter(obs => obs.id !== obsId && obs.firebaseId !== obsId)
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
      const nameStr = trail.name || '';
      const locStr = trail.location || '';
      const matchesSearch = nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            locStr.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || trail.difficulty === selectedDifficulty;
      const matchesParking = selectedParking === 'All' || trail.parking === selectedParking;
      return matchesSearch && matchesDifficulty && matchesParking;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date || 0) - new Date(a.date || 0);
      if (sortBy === 'length') return (parseFloat(b.length) || 0) - (parseFloat(a.length) || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  const myStats = {
    hikeCount: trails.length,
    totalKm: trails.reduce((sum, t) => sum + (parseFloat(t.length) || 0), 0),
    totalHours: trails.reduce((sum, t) => sum + (parseFloat(t.time || t.duration || t.hours) || 0), 0)
  };

  return (
    <HikeContext.Provider value={{
      trails,
      filteredTrails,
      favorites,
      user,
      isLoaded,
      searchQuery,
      setSearchQuery,
      selectedDifficulty,
      setSelectedDifficulty,
      selectedParking,
      setSelectedParking,
      sortBy,
      setSortBy,
      myStats,
      addHike,
      updateHike,
      deleteHike,
      deleteAllHikes,
      resetToSampleData,
      addObservation,
      deleteObservation,
      toggleFavorite
    }}>
      {children}
    </HikeContext.Provider>
  );
};

export const useHikes = () => useContext(HikeContext);
