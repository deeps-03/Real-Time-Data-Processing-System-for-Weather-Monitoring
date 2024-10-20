import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import WeatherDashboard from './components/WeatherDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <WeatherDashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;