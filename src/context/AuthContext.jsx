import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign Up
  const signup = async (email, password, displayName, role) => {
    // 1. Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update their display name in Firebase Auth
    await updateProfile(user, {
      displayName: displayName
    });

    // 3. Create a corresponding user document in Firestore to store extra data (like role)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: displayName,
      email: email,
      role: role || 'Student', // Student, Teacher, Club, etc.
      createdAt: serverTimestamp(),
      avatar: null, // Can be updated later
      bio: '',
      isPrivate: false
    });

    return user;
  };

  // Log In
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Log Out
  const logout = () => {
    return signOut(auth);
  };

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Done loading once we know if they are logged in or not
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
