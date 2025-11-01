import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Home, Settings as SettingsIcon } from 'lucide-react';
import { AuthButton } from '../auth/AuthButton';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import { cn } from '../../lib/utils';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <Cloud className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">WeatherHub</span>
            <span className="sm:hidden">Weather</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                isActive('/')
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                isActive('/settings')
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Auth Button */}
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
