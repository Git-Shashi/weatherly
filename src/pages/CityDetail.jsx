import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Cloud, Wind, Droplets, Eye, Gauge, Sun, Moon, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TemperatureChart } from '../components/charts/TemperatureChart';
import { PrecipitationChart } from '../components/charts/PrecipitationChart';
import { WindChart } from '../components/charts/WindChart';
import { useWeather } from '../hooks/useWeather';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { getWeatherIconUrl, formatTemperature, convertTemperature } from '../lib/weatherApi';

export const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const { getCompleteWeather } = useWeather();
  const { cities } = useSelector((state) => state.weather);
  const temperatureUnit = useSelector((state) => state.settings.temperatureUnit);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cityData = cities[cityName];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getCompleteWeather(cityName);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityName]);

  // Auto-refresh
  const refreshData = () => {
    getCompleteWeather(cityName, true);
  };

  useAutoRefresh(refreshData, 60000, true);

  // Process forecast data for charts
  const processChartData = () => {
    if (!cityData?.forecast?.list) return { hourly: [], daily: [], wind: [], precipitation: [] };

    const hourlyData = cityData.forecast.list.slice(0, 8).map(item => ({
      time: format(new Date(item.dt * 1000), 'ha'),
      temp: convertTemperature(item.main.temp, 'celsius', temperatureUnit),
      feelsLike: convertTemperature(item.main.feels_like, 'celsius', temperatureUnit),
      humidity: item.main.humidity,
    }));

    const precipitationData = cityData.forecast.list.slice(0, 8).map(item => ({
      time: format(new Date(item.dt * 1000), 'ha'),
      pop: Math.round((item.pop || 0) * 100),
      humidity: item.main.humidity,
    }));

    const windData = cityData.forecast.list.slice(0, 8).map(item => ({
      time: format(new Date(item.dt * 1000), 'ha'),
      speed: Math.round(item.wind.speed * 3.6),
      direction: item.wind.deg,
    }));

    // Group by day for daily forecast
    const dailyMap = new Map();
    cityData.forecast.list.forEach(item => {
      const date = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date).push(item);
    });

    const dailyData = Array.from(dailyMap.entries()).slice(0, 7).map(([date, items]) => {
      const temps = items.map(i => i.main.temp);
      return {
        date: format(new Date(date), 'EEE, MMM d'),
        maxTemp: Math.max(...temps),
        minTemp: Math.min(...temps),
        icon: items[Math.floor(items.length / 2)].weather[0].icon,
        description: items[Math.floor(items.length / 2)].weather[0].description,
        pop: Math.max(...items.map(i => (i.pop || 0) * 100)),
      };
    });

    return { hourly: hourlyData, daily: dailyData, wind: windData, precipitation: precipitationData };
  };

  const chartData = processChartData();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !cityData?.current) {
    return (
      <Layout>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive mb-4">
              <AlertTriangle className="w-5 h-5" />
              <span>{error || 'Failed to load weather data'}</span>
            </div>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const current = cityData.current;
  const temp = convertTemperature(current.main.temp, 'celsius', temperatureUnit);
  const feelsLike = convertTemperature(current.main.feels_like, 'celsius', temperatureUnit);
  const maxTemp = convertTemperature(current.main.temp_max, 'celsius', temperatureUnit);
  const minTemp = convertTemperature(current.main.temp_min, 'celsius', temperatureUnit);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Current weather header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <img
                  src={getWeatherIconUrl(current.weather[0].icon)}
                  alt={current.weather[0].description}
                  className="w-24 h-24"
                />
                <div>
                  <h1 className="text-4xl font-bold">{cityName}</h1>
                  <p className="text-xl text-muted-foreground capitalize">
                    {current.weather[0].description}
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-6xl font-bold">
                  {formatTemperature(temp, temperatureUnit)}
                </div>
                <p className="text-muted-foreground">
                  Feels like {formatTemperature(feelsLike, temperatureUnit)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  H: {formatTemperature(maxTemp, temperatureUnit)} L: {formatTemperature(minTemp, temperatureUnit)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Droplets className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="text-2xl font-bold">{current.main.humidity}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Wind className="w-8 h-8 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                  <p className="text-2xl font-bold">{Math.round(current.wind.speed * 3.6)} km/h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Gauge className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pressure</p>
                  <p className="text-2xl font-bold">{current.main.pressure} hPa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <p className="text-2xl font-bold">{(current.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 7-day forecast */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {chartData.daily.map((day, index) => (
                <div key={index} className="text-center p-3 rounded-lg border">
                  <p className="text-sm font-medium mb-2">{day.date.split(',')[0]}</p>
                  <img
                    src={getWeatherIconUrl(day.icon)}
                    alt={day.description}
                    className="w-12 h-12 mx-auto"
                  />
                  <p className="text-xs capitalize text-muted-foreground mb-2">{day.description}</p>
                  <p className="font-bold">
                    {Math.round(convertTemperature(day.maxTemp, 'celsius', temperatureUnit))}°
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(convertTemperature(day.minTemp, 'celsius', temperatureUnit))}°
                  </p>
                  {day.pop > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      💧 {Math.round(day.pop)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Temperature chart */}
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Temperature Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TemperatureChart data={chartData.hourly} unit={temperatureUnit} />
          </CardContent>
        </Card>

        {/* Precipitation chart */}
        <Card>
          <CardHeader>
            <CardTitle>Precipitation Probability</CardTitle>
          </CardHeader>
          <CardContent>
            <PrecipitationChart data={chartData.precipitation} />
          </CardContent>
        </Card>

        {/* Wind chart */}
        <Card>
          <CardHeader>
            <CardTitle>Wind Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <WindChart data={chartData.wind} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
