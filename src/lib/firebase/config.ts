
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Added Firestore import

// Your web app's Firebase configuration
// Using the hardcoded values as per previous request to fix deployment issues.
// For production, prefer environment variables.
const firebaseConfig = {
  apiKey: "AIzaSyA1ro1aav-8QGVAJ0TAcKSnai5BRf-QZpE",
  authDomain: "trivimaster-k8of6.firebaseapp.com",
  projectId: "trivimaster-k8of6",
  storageBucket: "trivimaster-k8of6.firebasestorage.app",
  messagingSenderId: "489367812869",
  appId: "1:489367812869:web:c8f207566c492a2b7dd56c" // Ensure this is the correct App ID from your Firebase console
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const firestore = getFirestore(app); // Initialized Firestore

export { app, auth, firestore }; // Exported firestore
