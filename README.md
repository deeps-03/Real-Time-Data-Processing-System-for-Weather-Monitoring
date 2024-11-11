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


## Docker Usage

To run the application using Docker, follow these steps:

1. **Build the Docker image and Start the application:**:
```bash
   docker-compose up --build -d  
```

2. Access the application: Open your web browser and go to http://localhost:4000/ to access the UI.


3. **Stop the Docker container:**:
```bash
docker-compose down
```

4. **To rebuild and restart the application:**:
```bash
docker-compose up --build -d
```


## Docker Hub Link

Link: https://hub.docker.com/repository/docker/deepaksuresh03/real-time-data-processing-system-for-weather-monitoring/general


## Installation


1. Install the dependencies:
   ```
   npm install
   ```


## Running the Application

To run the application in development mode:

```
npm run dev
```



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

