import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAxXTqEkxsosC56KZk29AP2pcJGunlkh-M",
  authDomain: "hikingapp-81d90.firebaseapp.com",
  projectId: "hikingapp-81d90",
  storageBucket: "hikingapp-81d90.firebasestorage.app",
  messagingSenderId: "68062805879",
  appId: "1:68062805879:android:261c4227dbdbfcb9c1eb72",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const isFirebaseEnabled = true;
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
