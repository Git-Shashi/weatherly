import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Store weather data by city name
  // { cityName: { current: {...}, forecast: {...}, lastUpdated: timestamp } }
  cities: {},
  loading: false,
  error: null,
  selectedCity: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherData: (state, action) => {
      const { city, data, type } = action.payload;
      
      if (!state.cities[city]) {
        state.cities[city] = {};
      }
      
      state.cities[city][type] = data;
      state.cities[city].lastUpdated = Date.now();
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    removeCity: (state, action) => {
      const city = action.payload;
      delete state.cities[city];
    },
  },
});

export const { 
  setWeatherData, 
  setLoading, 
  setError, 
  setSelectedCity, 
  clearError, 
  removeCity 
} = weatherSlice.actions;

export default weatherSlice.reducer;
