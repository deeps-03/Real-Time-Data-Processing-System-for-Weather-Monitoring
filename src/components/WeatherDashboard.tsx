import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { Sun, CloudRain, Snowflake, Wind } from 'lucide-react';
import WeatherChart from './WeatherChart';
import AlertSystem from './AlertSystem';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || '729258e8f0045e4e9b7d2468326ba699';
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

interface WeatherData {
  city: string;
  main: string;
  temp: number;
  feels_like: number;
  dt: number;
}

const fetchWeatherData = async (): Promise<WeatherData[]> => {
  const requests = CITIES.map(city =>
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`)
  );
  const responses = await Promise.all(requests);
  return responses.map(response => ({
    city: response.data.name,
    main: response.data.weather[0].main,
    temp: Number(response.data.main.temp.toFixed(1)),
    feels_like: Number(response.data.main.feels_like.toFixed(1)),
    dt: response.data.dt,
  }));
};

const WeatherDashboard: React.FC = () => {
  const [dailySummaries, setDailySummaries] = useState<Record<string, any>>({});

  const { data: weatherData, isLoading, error } = useQuery<WeatherData[], Error>(
    'weatherData',
    fetchWeatherData,
    { 
      refetchInterval: 300000, // Refetch every 5 minutes
      onError: (error) => console.error('Failed to fetch weather data:', error),
      staleTime: 60000, // Consider data stale after 1 minute
      cacheTime: 300000, // Keep unused data in cache for 5 minutes
    }
  );

  const calculateDailySummaries = useCallback((data: WeatherData[]) => {
    const newSummaries: Record<string, any> = {};
    const today = format(new Date(), 'yyyy-MM-dd');

    data.forEach(item => {
      if (!newSummaries[today]) {
        newSummaries[today] = {};
      }
      if (!newSummaries[today][item.city]) {
        newSummaries[today][item.city] = {
          temps: [],
          conditions: {},
        };
      }

      newSummaries[today][item.city].temps.push(item.temp);
      newSummaries[today][item.city].conditions[item.main] = (newSummaries[today][item.city].conditions[item.main] || 0) + 1;
    });

    // Calculate daily aggregates
    Object.keys(newSummaries[today]).forEach(city => {
      const cityData = newSummaries[today][city];
      cityData.avgTemp = Number((cityData.temps.reduce((a: number, b: number) => a + b, 0) / cityData.temps.length).toFixed(1));
      cityData.maxTemp = Math.max(...cityData.temps);
      cityData.minTemp = Math.min(...cityData.temps);
      cityData.dominantCondition = Object.entries(cityData.conditions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    });

    return newSummaries;
  }, []);

  useEffect(() => {
    if (weatherData) {
      const newSummaries = calculateDailySummaries(weatherData);
      setDailySummaries(newSummaries);
    }
  }, [weatherData, calculateDailySummaries]);

  if (isLoading) return <div className="text-center mt-10">Loading weather data...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'snow': return <Snowflake className="w-8 h-8 text-blue-200" />;
      default: return <Wind className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Weather Monitoring Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherData?.map(data => (
          <div key={data.city} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{data.city}</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{data.temp}°C</p>
                <p className="text-sm text-gray-500">Feels like {data.feels_like}°C</p>
              </div>
              <div className="flex flex-col items-center">
                {getWeatherIcon(data.main)}
                <p className="mt-1">{data.main}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {format(new Date(data.dt * 1000), 'HH:mm:ss')}
            </p>
          </div>
        ))}
      </div>
      <WeatherChart data={weatherData || []} />
      <AlertSystem weatherData={weatherData || []} />
    </div>
  );
};

export default WeatherDashboard;