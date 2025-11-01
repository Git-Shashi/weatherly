import { saveFavorites } from '../../lib/firebase';
import { markSynced } from '../favoritesSlice';

/**
 * Middleware to sync favorites with Firebase when user is authenticated
 */
export const favoritesMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // After any favorites change
  if (action.type?.startsWith('favorites/') && 
      (action.type === 'favorites/addFavorite' || 
       action.type === 'favorites/removeFavorite')) {
    
    const state = store.getState();
    const { user } = state.auth;
    const { cities, synced } = state.favorites;

    // If user is signed in and favorites not synced, sync to Firebase
    if (user && !synced) {
      saveFavorites(user.uid, cities)
        .then(() => {
          store.dispatch(markSynced());
          console.log('✅ Favorites synced to Firebase');
        })
        .catch((error) => {
          console.error('❌ Error syncing favorites:', error);
        });
    }
  }

  return result;
};
