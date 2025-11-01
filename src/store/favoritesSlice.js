import { createSlice } from '@reduxjs/toolkit';

const FAVORITES_STORAGE_KEY = 'favoriteCities';

// Load favorites from localStorage
const loadFavoritesFromStorage = () => {
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading favorites from storage:', error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to storage:', error);
  }
};

const initialState = {
  cities: loadFavoritesFromStorage(),
  synced: false,
  loading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.cities = action.payload;
      saveFavoritesToStorage(state.cities);
      state.synced = true;
    },
    addFavorite: (state, action) => {
      const city = action.payload;
      if (!state.cities.includes(city)) {
        state.cities.push(city);
        saveFavoritesToStorage(state.cities);
        state.synced = false;
      }
    },
    removeFavorite: (state, action) => {
      const city = action.payload;
      state.cities = state.cities.filter(c => c !== city);
      saveFavoritesToStorage(state.cities);
      state.synced = false;
    },
    markSynced: (state) => {
      state.synced = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite, markSynced, setLoading } = favoritesSlice.actions;
export default favoritesSlice.reducer;
