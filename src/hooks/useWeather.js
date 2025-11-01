import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWeatherData, setLoading, setError } from '../store/weatherSlice';
import { fetchWeatherData, fetchForecastData } from '../lib/weatherApi';

/**
 * Hook for fetching and managing weather data
 */
export const useWeather = () => {
  const dispatch = useDispatch();
  const { cities, loading, error } = useSelector((state) => state.weather);
  const [fetchingCity, setFetchingCity] = useState(null);

  /**
   * Fetch current weather for a city
   */
  const getCurrentWeather = useCallback(async (city, forceRefresh = false) => {
    try {
      setFetchingCity(city);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = await fetchWeatherData(city, forceRefresh);

      dispatch(setWeatherData({
        city,
        type: 'current',
        data: result.data,
      }));

      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
      setFetchingCity(null);
    }
  }, [dispatch]);

  /**
   * Fetch forecast for a city
   */
  const getForecast = useCallback(async (city, forceRefresh = false) => {
    try {
      setFetchingCity(city);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = await fetchForecastData(city, forceRefresh);

      dispatch(setWeatherData({
        city,
        type: 'forecast',
        data: result.data,
      }));

      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
      setFetchingCity(null);
    }
  }, [dispatch]);

  /**
   * Fetch both current and forecast data
   */
  const getCompleteWeather = useCallback(async (city, forceRefresh = false) => {
    try {
      const [current, forecast] = await Promise.all([
        getCurrentWeather(city, forceRefresh),
        getForecast(city, forceRefresh),
      ]);

      return { current, forecast };
    } catch (error) {
      throw error;
    }
  }, [getCurrentWeather, getForecast]);

  return {
    cities,
    loading,
    error,
    fetchingCity,
    getCurrentWeather,
    getForecast,
    getCompleteWeather,
  };
};
