import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Wind, Droplets, Eye, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { addFavorite, removeFavorite } from '../../store/favoritesSlice';
import { getWeatherIconUrl, formatTemperature, convertTemperature } from '../../lib/weatherApi';
import { getCacheAge } from '../../lib/cache';
import { cn } from '../../lib/utils';

export const CityWeatherCard = ({ city, weatherData, onRefresh }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.cities);
  const temperatureUnit = useSelector((state) => state.settings.temperatureUnit);

  const isFavorite = favorites.includes(city);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(city));
    } else {
      dispatch(addFavorite(city));
    }
  };

  const handleCardClick = () => {
    navigate(`/city/${city}`);
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    onRefresh(city);
  };

  if (!weatherData) {
    return null;
  }

  const temp = convertTemperature(
    weatherData.main.temp,
    'celsius',
    temperatureUnit
  );

  const feelsLike = convertTemperature(
    weatherData.main.feels_like,
    'celsius',
    temperatureUnit
  );

  const cacheAge = getCacheAge(`current_${city}`);

  return (
    <Card 
      className="hover:shadow-xl transition-all cursor-pointer group relative"
      onClick={handleCardClick}
    >
      {/* Favorite button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-2 right-2 z-10 opacity-70 hover:opacity-100",
          isFavorite ? "text-yellow-500" : "text-muted-foreground"
        )}
        onClick={handleFavoriteToggle}
      >
        <Star className={cn("w-4 h-4", isFavorite && "fill-current")} />
      </Button>

      <CardContent className="p-5">
        <div className="space-y-3">
          {/* City name & weather icon in row */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-1">{city}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {weatherData.weather[0].description}
              </p>
            </div>
            <img
              src={getWeatherIconUrl(weatherData.weather[0].icon)}
              alt={weatherData.weather[0].description}
              className="w-16 h-16"
            />
          </div>

          {/* Temperature */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              {formatTemperature(temp, temperatureUnit)}
            </span>
            <span className="text-sm text-muted-foreground">
              feels {formatTemperature(feelsLike, temperatureUnit)}
            </span>
          </div>

          {/* Additional info */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            <div className="text-center">
              <Droplets className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="text-sm font-medium">{weatherData.main.humidity}%</div>
            </div>

            <div className="text-center">
              <Wind className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Wind</div>
              <div className="text-sm font-medium">{Math.round(weatherData.wind.speed * 3.6)} km/h</div>
            </div>

            <div className="text-center">
              <Eye className="w-3.5 h-3.5 text-purple-500 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">Visible</div>
              <div className="text-sm font-medium">{(weatherData.visibility / 1000).toFixed(1)} km</div>
            </div>
          </div>

          {/* Cache info */}
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>
              {cacheAge !== null && cacheAge < 60 ? `${cacheAge}s ago` : 'Live'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-6 px-2 -mr-2"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
