import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, AlertCircle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SearchBar } from '../components/weather/SearchBar';
import { CityWeatherCard } from '../components/weather/CityWeatherCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useWeather } from '../hooks/useWeather';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

export const Dashboard = () => {
  const { cities: weatherCities, loading, error } = useWeather();
  const favorites = useSelector((state) => state.favorites.cities);
  const { getCurrentWeather } = useWeather();
  const [showSearch, setShowSearch] = useState(false);
  const [displayedCities, setDisplayedCities] = useState([]);

  // Initialize with favorites or default cities
  useEffect(() => {
    const initCities = favorites.length > 0 ? favorites : ['Delhi', 'Mumbai', 'Bangalore'];
    
    setDisplayedCities(initCities);

    // Fetch weather for all cities
    initCities.forEach(city => {
      getCurrentWeather(city);
    });
  }, []);

  // Close search on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSearch]);

  // Auto-refresh every 60 seconds
  const refreshAllCities = () => {
    displayedCities.forEach(city => {
      getCurrentWeather(city, true); // Force refresh
    });
  };

  useAutoRefresh(refreshAllCities, 60000, displayedCities.length > 0);

  // Add city
  const handleCitySelect = (city) => {
    if (!displayedCities.includes(city)) {
      setDisplayedCities([...displayedCities, city]);
      getCurrentWeather(city);
    }
    setShowSearch(false);
  };

  // Refresh single city
  const handleRefreshCity = (city) => {
    getCurrentWeather(city, true);
  };

  return (
    <Layout>
      {/* Backdrop overlay */}
      {showSearch && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 animate-in fade-in-0"
          onClick={() => setShowSearch(false)}
        />
      )}

      <div className="space-y-6 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Weather Hub
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Track weather across your favorite cities
            </p>
          </div>

          <Button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 w-full md:w-auto relative z-40"
            variant={showSearch ? "outline" : "default"}
          >
            <Plus className="w-4 h-4" />
            {showSearch ? 'Close' : 'Add City'}
          </Button>
        </div>

        {/* Search bar with backdrop */}
        {showSearch && (
          <div className="flex justify-center animate-in fade-in-50 slide-in-from-top-5 relative z-40">
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
        )}

        {/* Info Banner */}
        {displayedCities.length === 0 && !showSearch && (
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">�</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">
                    Getting Started
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Add cities to track their weather conditions. Your selections will be saved automatically.
                  </p>
                  <ul className="text-sm space-y-1.5 text-muted-foreground">
                    <li>• Click on any city card for detailed forecast</li>
                    <li>• Star cities to sync across devices</li>
                    <li>• Data refreshes automatically</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error message */}
        {error && (
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <div>
                  <p className="font-medium">Oops! Something went wrong</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {loading && displayedCities.length === 0 && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading weather...</p>
          </div>
        )}

        {/* Weather cards grid */}
        {displayedCities.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${showSearch ? 'mt-12' : ''}`}>
            {displayedCities.map((city) => (
              <CityWeatherCard
                key={city}
                city={city}
                weatherData={weatherCities[city]?.current}
                onRefresh={handleRefreshCity}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {displayedCities.length === 0 && !loading && (
          <Card className="border-dashed">
            <CardContent className="pt-10 pb-10">
              <div className="text-center space-y-3">
                <div className="text-5xl">🌍</div>
                <p className="text-lg font-medium">No cities yet</p>
                <p className="text-sm text-muted-foreground">
                  Start tracking weather by adding your first city
                </p>
                <Button onClick={() => setShowSearch(true)} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add City
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auto-refresh indicator */}
        {displayedCities.length > 0 && (
          <div className="text-center text-xs text-muted-foreground">
            <p>Last updated: just now • Auto-refresh enabled</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
