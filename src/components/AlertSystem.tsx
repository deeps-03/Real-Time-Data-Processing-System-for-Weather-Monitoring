import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface WeatherData {
  city: string;
  temp: number;
}

interface AlertSystemProps {
  weatherData: WeatherData[];
}

const AlertSystem: React.FC<AlertSystemProps> = ({ weatherData }) => {
  const [alerts, setAlerts] = useState<string[]>([]);
  const temperatureThreshold = 35; // Celsius

  useEffect(() => {
    const newAlerts = weatherData.filter(data => data.temp > temperatureThreshold)
      .map(data => `High temperature alert for ${data.city}: ${data.temp.toFixed(1)}°C`);
    
    setAlerts(newAlerts);
  }, [weatherData]);

  if (alerts.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Weather Alerts</h2>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <p className="font-bold">Attention</p>
        </div>
        <ul className="list-disc list-inside mt-2">
          {alerts.map((alert, index) => (
            <li key={index}>{alert}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AlertSystem;