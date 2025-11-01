import { createSlice } from '@reduxjs/toolkit';

const SETTINGS_STORAGE_KEY = 'weatherSettings';

// Load settings from localStorage
const loadSettingsFromStorage = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      temperatureUnit: 'celsius',
      theme: 'light',
    };
  } catch (error) {
    console.error('Error loading settings from storage:', error);
    return {
      temperatureUnit: 'celsius',
      theme: 'light',
    };
  }
};

// Save settings to localStorage
const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to storage:', error);
  }
};

const initialState = loadSettingsFromStorage();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTemperatureUnit: (state, action) => {
      state.temperatureUnit = action.payload;
      saveSettingsToStorage(state);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      saveSettingsToStorage(state);
    },
    setSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setTemperatureUnit, setTheme, setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
