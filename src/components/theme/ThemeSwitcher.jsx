import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

export const ThemeSwitcher = () => {
  const { theme, changeTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: Sun, color: 'text-yellow-600' },
    { value: 'dark', label: 'Dark', icon: Moon, color: 'text-blue-400' },
    { value: 'grey', label: 'Grey', icon: Palette, color: 'text-gray-400' },
  ];

  return (
    <div className="flex items-center gap-2 bg-card border rounded-lg p-1">
      {themes.map(({ value, label, icon: Icon, color }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => changeTheme(value)}
          className={cn(
            'flex items-center gap-2 transition-all',
            theme === value && 'shadow-md'
          )}
        >
          <Icon className={cn('w-4 h-4', theme !== value && color)} />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
};
