import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwUmwAaLwdVpynCr6Y45u1W4KKZc0fodU",
  authDomain: "campusx-app-6b90b.firebaseapp.com",
  projectId: "campusx-app-6b90b",
  storageBucket: "campusx-app-6b90b.firebasestorage.app",
  messagingSenderId: "422306826292",
  appId: "1:422306826292:web:376d2c163d531a1c086261",
  measurementId: "G-T0F87PK3PV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
