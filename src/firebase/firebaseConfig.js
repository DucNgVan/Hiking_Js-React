import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-WGFShCu7ZLN3rAzqiOhNjIp74VWmNUI",
  authDomain: "hiking-react.firebaseapp.com",
  projectId: "hiking-react",
  storageBucket: "hiking-react.appspot.com",
  messagingSenderId: "588988357102",
  appId: "1:588988357102:ios:72d421fa13df411d0356ff",
};

const firebaseEnabled = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_');

if (firebaseEnabled && !getApps().length) {
  initializeApp(firebaseConfig);
}

export const isFirebaseEnabled = firebaseEnabled;
export const auth = firebaseEnabled ? getAuth() : null;
export const db = firebaseEnabled ? getFirestore() : null;
