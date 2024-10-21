# Real-Time Weather Monitoring System

This project is a real-time data processing system for monitoring weather conditions in major Indian cities. It provides summarized insights using rollups and aggregates, utilizing data from the OpenWeatherMap API.

## Features

- Real-time weather data retrieval for major Indian cities
- Daily weather summaries with aggregates
- Temperature trend visualization
- Alerting system for high temperatures
- Responsive design for various screen sizes

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- An OpenWeatherMap API key

## Installation


1. Install the dependencies:
   ```
   npm install
   ```

2. I have left my Api key in the code so that its easy to run.

## Running the Application

To run the application in development mode:

```
npm run dev
```

This will start the development server. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.(please wait for a minute for the application to start)

## Building for Production

To build the application for production:

```
npm run build
```

This will create a `dist` folder with the production-ready files.

## Design Choices

- **React with TypeScript**: For type-safe component development and better developer experience.
- **Vite**: As a fast build tool and development server.
- **Tailwind CSS**: For rapid UI development with utility classes.
- **React Query**: For efficient data fetching and caching.
- **Recharts**: For creating interactive and responsive charts.
- **Lucide React**: For consistent and customizable icons.
- **Date-fns**: For easy date manipulation and formatting.

## Project Structure

```
src/
├── components/
│   ├── WeatherDashboard.tsx
│   ├── WeatherChart.tsx
│   └── AlertSystem.tsx
├── App.tsx
├── main.tsx
└── index.css
```

- `WeatherDashboard.tsx`: Main component that fetches and displays weather data.
- `WeatherChart.tsx`: Renders the temperature trend chart.
- `AlertSystem.tsx`: Handles and displays weather alerts.

