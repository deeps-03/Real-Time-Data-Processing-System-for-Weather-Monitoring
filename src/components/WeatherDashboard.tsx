import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { Sun, CloudRain, Snowflake, Wind } from 'lucide-react';
import WeatherChart from './WeatherChart';
import AlertSystem from './AlertSystem';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || '729258e8f0045e4e9b7d2468326ba699'; // OpenWeatherMap API key
const CITIES = ['Chennai', 'Bangalore', 'Kolkata', 'Mumbai', 'Delhi', 'Hyderabad'];

interface WeatherData {
  city: string;
  main: string;
  temp: number;
  feels_like: number;
  dt: number;
}

interface HistoricalRecord {
  temp: number;
  timestamp: number;
}

interface CityHistory {
  [city: string]: HistoricalRecord[];
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
  const [historicalData, setHistoricalData] = useState<CityHistory>(() => {
    try {
      const saved = localStorage.getItem('weatherHistory');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  });

  const { data: weatherData, isLoading, error } = useQuery<WeatherData[], Error>(
    'weatherData',
    fetchWeatherData,
    { 
      refetchInterval: 300000,
      onError: (error) => console.error('Failed to fetch weather data:', error),
      staleTime: 60000,
      cacheTime: 300000,
    }
  );

  useEffect(() => {
    if (weatherData) {
      const today = new Date().setHours(0, 0, 0, 0);
      
      setHistoricalData(prev => {
        const newData = { ...prev };
        
        weatherData.forEach(data => {
          // Initialize array for city if it doesn't exist
          if (!newData[data.city]) {
            newData[data.city] = [];
          }
          
          // Add new reading
          const newReading = {
            temp: data.temp,
            timestamp: data.dt
          };
          
          // Check if reading already exists
          const existingIndex = newData[data.city].findIndex(
            record => record.timestamp === data.dt
          );
          
          if (existingIndex === -1) {
            newData[data.city].push(newReading);
          }
          
          // Filter out old readings and sort by timestamp
          newData[data.city] = newData[data.city]
            .filter(record => 
              new Date(record.timestamp * 1000).setHours(0, 0, 0, 0) === today
            )
            .sort((a, b) => a.timestamp - b.timestamp);
        });

        try {
          localStorage.setItem('weatherHistory', JSON.stringify(newData));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }

        return newData;
      });
    }
  }, [weatherData]);

  const calculateStats = useCallback((city: string) => {
    if (!historicalData[city] || historicalData[city].length === 0) {
      const currentData = weatherData?.find(d => d.city === city);
      if (currentData) {
        return {
          avg: currentData.temp,
          max: currentData.temp,
          min: currentData.temp,
          count: 1
        };
      }
      return { avg: 0, max: 0, min: 0, count: 0 };
    }

    const temps = historicalData[city].map(record => record.temp);
    
    return {
      avg: Number((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)),
      max: Number(Math.max(...temps).toFixed(1)),
      min: Number(Math.min(...temps).toFixed(1)),
      count: temps.length
    };
  }, [historicalData, weatherData]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'snow': return <Snowflake className="w-8 h-8 text-blue-200" />;
      default: return <Wind className="w-8 h-8 text-gray-400" />;
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading weather data...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Weather Monitoring Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherData?.map(data => {
          const stats = calculateStats(data.city);
          
          return (
            <div key={data.city} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{data.city}</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold">{data.temp}°C</p>
                  <p className="text-sm text-gray-500">Feels like {data.feels_like}°C</p>
                </div>
                <div className="flex flex-col items-center">
                  {getWeatherIcon(data.main)}
                  <p className="mt-1">{data.main}</p>
                </div>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600">Average</p>
                    <p className="text-lg">{stats.avg}°C</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-red-600">Max</p>
                    <p className="text-lg">{stats.max}°C</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-blue-600">Min</p>
                    <p className="text-lg">{stats.min}°C</p>
                  </div>
                </div>
                <p className="text-xs text-gray- 500 mt-2 text-center">
                  Based on {stats.count} readings today
                </p>
              </div>
  
              <p className="text-sm text-gray-500 mt-4">
                Last updated: {format(new Date(data.dt * 1000), 'HH:mm:ss')}
              </p>
            </div>
          );
        })}
      </div>
      <WeatherChart data={weatherData || []} />
      <AlertSystem weatherData={weatherData || []} />
    </div>
  );
};

export default WeatherDashboard;