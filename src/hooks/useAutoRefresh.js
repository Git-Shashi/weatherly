import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for auto-refreshing data with tab visibility detection
 * @param {Function} callback - Function to call on refresh
 * @param {number} interval - Refresh interval in milliseconds (default: 60000 = 60s)
 * @param {boolean} enabled - Whether auto-refresh is enabled
 */
export const useAutoRefresh = (callback, interval = 60000, enabled = true) => {
  const savedCallback = useRef();
  const timerRef = useRef(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Check if tab is visible
  const isTabVisible = useCallback(() => {
    return document.visibilityState === 'visible';
  }, []);

  // Refresh function
  const refresh = useCallback(() => {
    if (isTabVisible() && savedCallback.current) {
      console.log('🔄 Auto-refreshing data...');
      savedCallback.current();
    } else {
      console.log('⏸️  Tab not visible, skipping refresh');
    }
  }, [isTabVisible]);

  // Set up interval
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Start the interval
    timerRef.current = setInterval(refresh, interval);

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️  Tab became visible, refreshing...');
        refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, interval, refresh]);

  // Manual refresh function
  const manualRefresh = useCallback(() => {
    if (savedCallback.current) {
      savedCallback.current();
    }
  }, []);

  return { refresh: manualRefresh };
};

/**
 * Hook for detecting tab visibility
 */
export const useTabVisibility = () => {
  const [isVisible, setIsVisible] = useState(
    document.visibilityState === 'visible'
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
};
