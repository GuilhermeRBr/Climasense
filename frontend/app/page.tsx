'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AtmosphericHero from '@/components/weather/AtmosphericHero';
import CurrentConditions from '@/components/weather/CurrentConditions';
import WindPanel from '@/components/weather/WindPanel';
import RainfallPanel from '@/components/weather/RainfallPanel';
import LuminosityPanel from '@/components/weather/LuminosityPanel';
import AdvancedHistory from '@/components/charts/AdvancedHistory';
import HourlyForecast from '@/components/weather/HourlyForecast';
import BackgroundParticles from '@/components/effects/BackgroundParticles';
import LoadingScreen from '@/components/loading/LoadingScreen';
import RefreshIndicator from '@/components/effects/RefreshIndicator';
import ThemeTransition from '@/components/effects/ThemeTransition';
import { api, SensorReading, ForecastData } from '@/services/api';
import '@/styles/pages/home.css';
import '@/styles/components/atmospheric-hero.css';
import '@/styles/components/current-conditions.css';
import '@/styles/components/wind-panel.css';
import '@/styles/components/rainfall-panel.css';
import '@/styles/components/luminosity-panel.css';
import '@/styles/components/period-filter.css';
import '@/styles/components/metric-selector.css';
import '@/styles/components/advanced-history.css';

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
        <main className="main-content">
          <motion.div variants={itemVariants}>
            <AtmosphericHero
              temperature={sensorData?.temperatura || 0}
              feelsLike={sensorData?.temperatura ? sensorData.temperatura - 2 : 0}
              condition="Parcialmente Nublado"
              city="São Paulo"
              weatherTheme={weatherTheme}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <CurrentConditions
              humidity={sensorData?.umidade || 0}
              luminosity={75}
              pressure={1013}
              windSpeed={12.5}
              rainfall={0}
              sensorStatus="online"
              weatherTheme={weatherTheme}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <WindPanel
              speed={12.5}
              direction={180}
              weatherTheme={weatherTheme}
            />
          </motion.div>

          <div className="panels-grid">
            <motion.div variants={itemVariants}>
              <RainfallPanel
                current={0}
                dailyTotal={0}
                intensity="none"
                weatherTheme={weatherTheme}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <LuminosityPanel
                luminosity={75}
                weatherTheme={weatherTheme}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <AdvancedHistory 
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
