import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, isFirebaseEnabled } from '../firebase/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = '@mhike_auth_user_v2';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Nguyen Van Duc',
    phone: '0788551709',
    email: 'admin@gmail.com',
    uid: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    let unsubscribe = null;

    const loadAuth = async () => {
      try {
        if (isFirebaseEnabled && auth) {
          unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
              setUser({
                name: firebaseUser.displayName || firebaseUser.email,
                email: firebaseUser.email,
                phone: firebaseUser.phoneNumber || '',
                uid: firebaseUser.uid || ''
              });
              setIsLoggedIn(true);
            } else {
              const saved = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
              if (saved) {
                const parsed = JSON.parse(saved);
                setUser(parsed.user || user);
                setIsLoggedIn(parsed.isLoggedIn ?? false);
              } else {
                setIsLoggedIn(false);
              }
            }
            setIsAuthLoaded(true);
          });
        } else {
          const saved = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            setUser(parsed.user || user);
            setIsLoggedIn(parsed.isLoggedIn ?? false);
          }
          setIsAuthLoaded(true);
        }
      } catch (e) {
        console.error('Auth load error', e);
        setIsAuthLoaded(true);
      }
    };

    loadAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const saveAuth = async (newUser, loggedInState) => {
    setUser(newUser);
    setIsLoggedIn(loggedInState);
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: newUser, isLoggedIn: loggedInState }));
    } catch (e) {
      console.error('Auth save error', e);
    }
  };

  const signIn = async (email, password) => {
    if (isFirebaseEnabled && auth) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;
        const updated = {
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || '',
          uid: firebaseUser.uid || ''
        };
        saveAuth(updated, true);
      } catch (e) {
        console.error('Firebase sign in error', e);
        throw e;
      }
    } else {
      const updated = { ...user, email: email || user.email };
      saveAuth(updated, true);
    }
  };

  const signUp = async (name, phone, email, password) => {
    if (isFirebaseEnabled && auth) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;
        await firebaseUpdateProfile(firebaseUser, { displayName: name });
        const updated = {
          name,
          email: firebaseUser.email,
          phone,
          uid: firebaseUser.uid || ''
        };
        saveAuth(updated, true);
      } catch (e) {
        console.error('Firebase sign up error', e);
        throw e;
      }
    } else {
      const updated = { name, phone, email };
      saveAuth(updated, true);
    }
  };

  const signOut = async () => {
    if (isFirebaseEnabled && auth) {
      try {
        await firebaseSignOut(auth);
        setIsLoggedIn(false);
      } catch (e) {
        console.error('Firebase sign out error', e);
      }
    } else {
      saveAuth(user, false);
    }
  };

  const updateProfile = async (name, phone) => {
    const updated = { ...user, name, phone };
    if (isFirebaseEnabled && auth && auth.currentUser) {
      try {
        await firebaseUpdateProfile(auth.currentUser, { displayName: name });
      } catch (e) {
        console.error('Firebase profile update error', e);
      }
    }
    saveAuth(updated, isLoggedIn);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      isAuthLoaded,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
