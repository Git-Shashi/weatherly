import axios from 'axios';
import { getCachedData, setCachedData } from './cache';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';

// Rate limiting
let apiCallCount = 0;
let lastResetTime = Date.now();
const MAX_CALLS_PER_MINUTE = 50;

/**
 * Check and enforce rate limiting
 */
const checkRateLimit = () => {
  const now = Date.now();
  
  // Reset counter every minute
  if (now - lastResetTime > 60000) {
    apiCallCount = 0;
    lastResetTime = now;
  }

  if (apiCallCount >= MAX_CALLS_PER_MINUTE) {
    throw new Error('Rate limit exceeded. Please wait a moment.');
  }

  apiCallCount++;
};

/**
 * Fetch weather data with caching
 * @param {string} city - City name
 * @param {boolean} forceRefresh - Force API call even if cache exists
 * @returns {Promise<object>} Weather data
 */
export const fetchWeatherData = async (city, forceRefresh = false) => {
  try {
    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cached = getCachedData(`current_${city}`);
      if (cached) {
        return {
          data: cached.data,
          cached: true,
          age: cached.age,
        };
      }
    }

    // Check rate limit
    checkRateLimit();

    // Fetch from API
    console.log(`🌐 Fetching weather for ${city} from API...`);
    const response = await axios.get(`${API_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    // Cache the response
    setCachedData(`current_${city}`, response.data);

    return {
      data: response.data,
      cached: false,
      age: 0,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    if (error.response) {
      // API error
      throw new Error(error.response.data.message || 'Failed to fetch weather data');
    } else if (error.message === 'Rate limit exceeded. Please wait a moment.') {
      throw error;
    } else {
      // Network error
      throw new Error('Network error. Please check your connection.');
    }
  }
};

/**
 * Fetch 5-day forecast with caching
 * @param {string} city - City name
 * @param {boolean} forceRefresh - Force API call even if cache exists
 * @returns {Promise<object>} Forecast data
 */
export const fetchForecastData = async (city, forceRefresh = false) => {
  try {
    // Check cache first
    if (!forceRefresh) {
      const cached = getCachedData(`forecast_${city}`);
      if (cached) {
        return {
          data: cached.data,
          cached: true,
          age: cached.age,
        };
      }
    }

    // Check rate limit
    checkRateLimit();

    // Fetch from API
    console.log(`🌐 Fetching forecast for ${city} from API...`);
    const response = await axios.get(`${API_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    // Cache the response
    setCachedData(`forecast_${city}`, response.data);

    return {
      data: response.data,
      cached: false,
      age: 0,
    };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch forecast data');
    } else if (error.message === 'Rate limit exceeded. Please wait a moment.') {
      throw error;
    } else {
      throw new Error('Network error. Please check your connection.');
    }
  }
};

/**
 * Search cities (autocomplete)
 * @param {string} query - Search query
 * @returns {Promise<array>} Array of city results
 */
export const searchCities = async (query) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    // Check cache
    const cached = getCachedData(`search_${query}`);
    if (cached) {
      return cached.data;
    }

    // Check rate limit
    checkRateLimit();

    // Use geo API for city search
    console.log(`🔍 Searching for cities: ${query}`);
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });

    // Format results
    const results = response.data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
      display: `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`,
    }));

    // Cache for 5 minutes (search results don't change often)
    setCachedData(`search_${query}`, results);

    return results;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

/**
 * Fetch weather by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} Weather data
 */
export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const cacheKey = `coords_${lat}_${lon}`;
    
    // Check cache
    const cached = getCachedData(cacheKey);
    if (cached) {
      return {
        data: cached.data,
        cached: true,
        age: cached.age,
      };
    }

    // Check rate limit
    checkRateLimit();

    // Fetch from API
    console.log(`🌐 Fetching weather for coords (${lat}, ${lon})...`);
    const response = await axios.get(`${API_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    // Cache the response
    setCachedData(cacheKey, response.data);

    return {
      data: response.data,
      cached: false,
      age: 0,
    };
  } catch (error) {
    console.error('Error fetching weather by coords:', error);
    throw new Error('Failed to fetch weather data');
  }
};

/**
 * Get weather icon URL
 * @param {string} iconCode - Icon code from API
 * @returns {string} Icon URL
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Convert temperature between units
 * @param {number} temp - Temperature value
 * @param {string} from - Current unit ('celsius' or 'fahrenheit')
 * @param {string} to - Target unit ('celsius' or 'fahrenheit')
 * @returns {number} Converted temperature
 */
export const convertTemperature = (temp, from, to) => {
  if (from === to) return temp;
  
  if (from === 'celsius' && to === 'fahrenheit') {
    return (temp * 9/5) + 32;
  } else if (from === 'fahrenheit' && to === 'celsius') {
    return (temp - 32) * 5/9;
  }
  
  return temp;
};

/**
 * Format temperature with unit
 * @param {number} temp - Temperature value
 * @param {string} unit - Unit ('celsius' or 'fahrenheit')
 * @returns {string} Formatted temperature
 */
export const formatTemperature = (temp, unit = 'celsius') => {
  const rounded = Math.round(temp);
  return unit === 'celsius' ? `${rounded}°C` : `${rounded}°F`;
};
