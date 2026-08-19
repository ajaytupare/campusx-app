import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAk8LV17ILVaPQYehU6qgHfELcAOJSQNd0",
  authDomain: "campusx-e1a20.firebaseapp.com",
  projectId: "campusx-e1a20",
  storageBucket: "campusx-e1a20.firebasestorage.app",
  messagingSenderId: "469133797829",
  appId: "1:469133797829:web:a7f197b783a081fb9fc3ac",
  measurementId: "G-G1CSLPPF20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
