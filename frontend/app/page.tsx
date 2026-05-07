'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/weather/HeroSection';
import WeatherCards from '@/components/weather/WeatherCards';
import TemperatureChart from '@/components/charts/TemperatureChart';
import HourlyForecast from '@/components/weather/HourlyForecast';
import { api, SensorReading, ForecastData } from '@/services/api';
import '@/styles/pages/home.css';

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorReading | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorReading[]>([]);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherTheme, setWeatherTheme] = useState<'sunny' | 'cloudy' | 'rainy' | 'night'>('sunny');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    determineWeatherTheme();
  }, [sensorData]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [latest, historical, forecastData] = await Promise.all([
        api.getLatestReading('esp32_01'),
        api.getSensorData('esp32_01', '-24h'),
        api.getForecast(-23.5505, -46.6333, 7),
      ]);

      setSensorData(latest);
      setHistoricalData(historical);
      setForecast(forecastData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const determineWeatherTheme = () => {
    if (!sensorData) return;

    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;

    if (isNight) {
      setWeatherTheme('night');
      return;
    }

    // Simular condição climática baseada em umidade
    if (sensorData.umidade > 80) {
      setWeatherTheme('rainy');
    } else if (sensorData.umidade > 60) {
      setWeatherTheme('cloudy');
    } else {
      setWeatherTheme('sunny');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className={`home-container theme-${weatherTheme}`}>
      <div className="background-gradient" />
      <div className="content-wrapper">
        <Header city="São Paulo" weatherTheme={weatherTheme} />
        
        <main className="main-content">
          <HeroSection 
            temperature={sensorData?.temperatura || 0}
            condition="Parcialmente Nublado"
            feelsLike={sensorData?.temperatura ? sensorData.temperatura - 2 : 0}
            weatherTheme={weatherTheme}
          />

          <WeatherCards 
            humidity={sensorData?.umidade || 0}
            luminosity={75}
            rainfall={0}
            sensorStatus="online"
            weatherTheme={weatherTheme}
          />

          <TemperatureChart 
            data={historicalData}
            weatherTheme={weatherTheme}
          />

          <HourlyForecast 
            forecast={forecast}
            weatherTheme={weatherTheme}
          />
        </main>
      </div>
    </div>
  );
}
