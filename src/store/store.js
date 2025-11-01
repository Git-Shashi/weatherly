import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import favoritesReducer from './favoritesSlice';
import settingsReducer from './settingsSlice';
import weatherReducer from './weatherSlice';
import { favoritesMiddleware } from './middleware/favoritesMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
    weather: weatherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(favoritesMiddleware),
});

export default store;
