import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { user: null, error: error.message };
  }
};

/**
 * Sign out
 */
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error.message };
  }
};

/**
 * Auth state observer
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get user favorites from Firestore
 */
export const getUserFavorites = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().favorites || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Save user favorites to Firestore
 */
export const saveFavorites = async (userId, favorites) => {
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        favorites,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { error: null };
  } catch (error) {
    console.error('Error saving favorites:', error);
    return { error: error.message };
  }
};

/**
 * Add a city to favorites
 */
export const addFavoriteCity = async (userId, city) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      favorites: arrayUnion(city),
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    // If document doesn't exist, create it
    if (error.code === 'not-found') {
      return await saveFavorites(userId, [city]);
    }
    console.error('Error adding favorite:', error);
    return { error: error.message };
  }
};

/**
 * Remove a city from favorites
 */
export const removeFavoriteCity = async (userId, city) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      favorites: arrayRemove(city),
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    console.error('Error removing favorite:', error);
    return { error: error.message };
  }
};

/**
 * Get user settings from Firestore
 */
export const getUserSettings = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().settings || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
};

/**
 * Save user settings to Firestore
 */
export const saveSettings = async (userId, settings) => {
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        settings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { error: null };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { error: error.message };
  }
};
