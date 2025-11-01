/**
 * Cache Manager for Weather Data
 * Implements 60-second cache expiry with localStorage persistence
 */

const CACHE_DURATION = 60 * 1000; // 60 seconds in milliseconds
const CACHE_PREFIX = 'weather_cache_';

/**
 * Get cached data for a city
 * @param {string} key - Cache key (usually city name)
 * @returns {object|null} - Cached data or null if expired/not found
 */
export const getCachedData = (key) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (< 60 seconds old)
    if (now - timestamp < CACHE_DURATION) {
      const age = Math.floor((now - timestamp) / 1000);
      console.log(`✅ Cache HIT for ${key} (${age}s old)`);
      return { data, age, timestamp };
    }

    // Cache expired
    console.log(`⏰ Cache EXPIRED for ${key}`);
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Set cached data for a city
 * @param {string} key - Cache key (usually city name)
 * @param {object} data - Data to cache
 */
export const setCachedData = (key, data) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    console.log(`💾 Cache SAVED for ${key}`);
  } catch (error) {
    console.error('Error saving cache:', error);
    // If localStorage is full, clear old entries
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      // Try again
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      } catch (retryError) {
        console.error('Failed to save cache after clearing:', retryError);
      }
    }
  }
};

/**
 * Clear cache for a specific key
 * @param {string} key - Cache key to clear
 */
export const clearCache = (key) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Cache CLEARED for ${key}`);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all weather caches
 */
export const clearAllCache = () => {
  try {
    const keys = Object.keys(localStorage);
    const weatherKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    weatherKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`🗑️ Cleared ${weatherKeys.length} cache entries`);
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

/**
 * Clear old/expired cache entries
 */
export const clearOldCache = () => {
  try {
    const keys = Object.keys(localStorage);
    const weatherKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    const now = Date.now();
    let cleared = 0;

    weatherKeys.forEach(key => {
      try {
        const cached = JSON.parse(localStorage.getItem(key));
        if (now - cached.timestamp > CACHE_DURATION) {
          localStorage.removeItem(key);
          cleared++;
        }
      } catch (error) {
        // Invalid cache entry, remove it
        localStorage.removeItem(key);
        cleared++;
      }
    });

    if (cleared > 0) {
      console.log(`🧹 Cleared ${cleared} old cache entries`);
    }
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
};

/**
 * Get cache age in seconds
 * @param {string} key - Cache key
 * @returns {number|null} - Age in seconds or null if not found
 */
export const getCacheAge = (key) => {
  try {
    const cacheKey = CACHE_PREFIX + key;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }

    const { timestamp } = JSON.parse(cached);
    return Math.floor((Date.now() - timestamp) / 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Check if cache exists and is valid
 * @param {string} key - Cache key
 * @returns {boolean} - True if cache is valid
 */
export const isCacheValid = (key) => {
  const cached = getCachedData(key);
  return cached !== null;
};

/**
 * Get all cached city keys
 * @returns {string[]} - Array of city names that have cached data
 */
export const getCachedCities = () => {
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(CACHE_PREFIX))
      .map(key => key.replace(CACHE_PREFIX, ''));
  } catch (error) {
    console.error('Error getting cached cities:', error);
    return [];
  }
};

/**
 * Get cache statistics
 * @returns {object} - Cache statistics
 */
export const getCacheStats = () => {
  try {
    const cities = getCachedCities();
    const stats = {
      total: cities.length,
      valid: 0,
      expired: 0,
      oldestAge: 0,
      newestAge: Infinity,
    };

    cities.forEach(city => {
      const age = getCacheAge(city);
      if (age !== null) {
        if (age < 60) {
          stats.valid++;
        } else {
          stats.expired++;
        }
        stats.oldestAge = Math.max(stats.oldestAge, age);
        stats.newestAge = Math.min(stats.newestAge, age);
      }
    });

    if (stats.newestAge === Infinity) {
      stats.newestAge = 0;
    }

    return stats;
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { total: 0, valid: 0, expired: 0, oldestAge: 0, newestAge: 0 };
  }
};
