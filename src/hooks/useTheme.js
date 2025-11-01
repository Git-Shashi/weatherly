import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../store/settingsSlice';

/**
 * Hook to manage theme
 */
export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.settings.theme);

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'grey');
    
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'grey') {
      document.documentElement.classList.add('grey');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return { theme, changeTheme };
};
