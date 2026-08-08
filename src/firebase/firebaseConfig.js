import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxXTqEkxsosC56KZk29AP2pcJGunlkh-M",
  authDomain: "hikingapp-81d90.firebaseapp.com",
  projectId: "hikingapp-81d90",
  storageBucket: "hikingapp-81d90.firebasestorage.app",
  messagingSenderId: "68062805879",
  appId: "1:68062805879:android:261c4227dbdbfcb9c1eb72",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const isFirebaseEnabled = true;
export const auth = getAuth();
export const db = getFirestore();
