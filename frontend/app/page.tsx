'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/weather/HeroSection';
import WeatherCards from '@/components/weather/WeatherCards';
import TemperatureChart from '@/components/charts/TemperatureChart';
import HourlyForecast from '@/components/weather/HourlyForecast';
import BackgroundParticles from '@/components/effects/BackgroundParticles';
import LoadingScreen from '@/components/loading/LoadingScreen';
import RefreshIndicator from '@/components/effects/RefreshIndicator';
import ThemeTransition from '@/components/effects/ThemeTransition';
import SkeletonCard from '@/components/loading/SkeletonCard';
import { api, SensorReading, ForecastData } from '@/services/api';
import '@/styles/pages/home.css';

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorReading | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorReading[]>([]);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weatherTheme, setWeatherTheme] = useState<'sunny' | 'cloudy' | 'rainy' | 'night'>('sunny');

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    determineWeatherTheme();
  }, [sensorData]);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

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
      if (isRefresh) {
        setTimeout(() => setIsRefreshing(false), 1000);
      } else {
        setLoading(false);
      }
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

    if (sensorData.umidade > 80) {
      setWeatherTheme('rainy');
    } else if (sensorData.umidade > 60) {
      setWeatherTheme('cloudy');
    } else {
      setWeatherTheme('sunny');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className={`home-container theme-${weatherTheme}`}>
      <div className="background-gradient" />
      <BackgroundParticles weatherTheme={weatherTheme} />
      <ThemeTransition theme={weatherTheme} />
      <RefreshIndicator isRefreshing={isRefreshing} />
      
      <motion.div
        className="content-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Header city="São Paulo" weatherTheme={weatherTheme} />
        </motion.div>
        
        <main className="main-content">
          <motion.div variants={itemVariants}>
            <HeroSection 
              temperature={sensorData?.temperatura || 0}
              condition="Parcialmente Nublado"
              feelsLike={sensorData?.temperatura ? sensorData.temperatura - 2 : 0}
              weatherTheme={weatherTheme}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {sensorData ? (
                <WeatherCards 
                  key="weather-cards"
                  humidity={sensorData.umidade}
                  luminosity={75}
                  rainfall={0}
                  sensorStatus="online"
                  weatherTheme={weatherTheme}
                />
              ) : (
                <div className="cards-grid" key="skeleton-cards">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants}>
            <TemperatureChart 
              data={historicalData}
              weatherTheme={weatherTheme}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <HourlyForecast 
              forecast={forecast}
              weatherTheme={weatherTheme}
            />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
