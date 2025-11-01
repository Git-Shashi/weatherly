import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { setTemperatureUnit, setTheme } from '../store/settingsSlice';
import { clearAllCache, getCacheStats } from '../lib/cache';
import { Trash2, RefreshCw, Sun, Moon, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

export const Settings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const [cacheStats, setCacheStats] = React.useState(getCacheStats());

  const handleUnitToggle = () => {
    const newUnit = settings.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    dispatch(setTemperatureUnit(newUnit));
  };

  const handleClearCache = () => {
    clearAllCache();
    setCacheStats(getCacheStats());
  };

  const refreshStats = () => {
    setCacheStats(getCacheStats());
  };

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your weather experience
          </p>
        </div>

        {/* Temperature Unit */}
        <Card>
          <CardHeader>
            <CardTitle>Temperature Unit</CardTitle>
            <CardDescription>
              Choose your preferred temperature display unit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">
                  {settings.temperatureUnit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Currently showing temperatures in {settings.temperatureUnit}
                </p>
              </div>
              <Switch
                checked={settings.temperatureUnit === 'fahrenheit'}
                onCheckedChange={handleUnitToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Choose your color scheme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Light Theme */}
              <button
                onClick={() => handleThemeChange('light')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  settings.theme === 'light'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="p-2 rounded-full bg-yellow-100">
                  <Sun className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Light</p>
                </div>
              </button>

              {/* Dark Theme */}
              <button
                onClick={() => handleThemeChange('dark')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  settings.theme === 'dark'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="p-2 rounded-full bg-blue-900">
                  <Moon className="w-5 h-5 text-blue-300" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Dark</p>
                </div>
              </button>

              {/* Grey Theme */}
              <button
                onClick={() => handleThemeChange('grey')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  settings.theme === 'grey'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="p-2 rounded-full bg-gray-700">
                  <Palette className="w-5 h-5 text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Grey</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Cache Management */}
        <Card>
          <CardHeader>
            <CardTitle>Cache</CardTitle>
            <CardDescription>
              Manage stored weather data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg text-sm">
              <div>
                <div className="text-muted-foreground">Cached</div>
                <div className="text-lg font-semibold">{cacheStats.total}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Valid</div>
                <div className="text-lg font-semibold text-green-600">{cacheStats.valid}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleClearCache}
                className="flex items-center gap-2"
                size="sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Cache
              </Button>
              <Button
                variant="outline"
                onClick={refreshStats}
                className="flex items-center gap-2"
                size="sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Cache expires after 60 seconds
            </p>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Version:</span> 1.0.0
            </div>
            <div>
              <span className="font-medium">Data Source:</span> OpenWeatherMap API
            </div>
            <div className="pt-2 border-t">
              <p className="text-muted-foreground">
                Weather data updates automatically and is cached for optimal performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
