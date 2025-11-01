import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setLoading } from '../store/authSlice';
import { setFavorites } from '../store/favoritesSlice';
import { onAuthChange, getUserFavorites, signInWithGoogle as firebaseSignIn, logOut as firebaseLogOut } from '../lib/firebase';

/**
 * Hook for authentication
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(true));
    
    // Listen to auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User signed in
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        dispatch(setUser(userData));

        // Load user favorites from Firebase
        try {
          const favorites = await getUserFavorites(firebaseUser.uid);
          dispatch(setFavorites(favorites));
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      } else {
        // User signed out
        dispatch(clearUser());
      }
      
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const signIn = async () => {
    dispatch(setLoading(true));
    const { user: firebaseUser, error } = await firebaseSignIn();
    dispatch(setLoading(false));
    return { user: firebaseUser, error };
  };

  const signOut = async () => {
    dispatch(setLoading(true));
    await firebaseLogOut();
    dispatch(clearUser());
    dispatch(setLoading(false));
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};
