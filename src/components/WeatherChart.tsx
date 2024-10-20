import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeatherData {
  city: string;
  temp: number;
  dt: number;
}

interface WeatherChartProps {
  data: WeatherData[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.city,
    temperature: item.temp,
    time: new Date(item.dt * 1000).toLocaleTimeString(),
  }));

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Temperature Trends</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;