// firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb-oisWSioklGH3cg2Vqg429NquccuF54",
  authDomain: "womensafety-d330a.firebaseapp.com",
  projectId: "womensafety-d330a",
  storageBucket: "womensafety-d330a.firebasestorage.app",
  messagingSenderId: "140495719091",
  appId: "1:140495719091:web:fdd1bc7c525dae5fc6bec6"
};

// Initialize Firebase App (ensuring it’s initialized only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

export { app, db };
