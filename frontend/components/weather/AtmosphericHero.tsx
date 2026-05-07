'use client';

import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Moon, CloudDrizzle } from 'lucide-react';

interface AtmosphericHeroProps {
  temperature: number;
  feelsLike: number;
  condition: string;
  city: string;
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function AtmosphericHero({
  temperature,
  feelsLike,
  condition,
  city,
  weatherTheme,
}: AtmosphericHeroProps) {
  const getWeatherIcon = () => {
    switch (weatherTheme) {
      case 'sunny':
        return Sun;
      case 'cloudy':
        return Cloud;
      case 'rainy':
        return CloudRain;
      case 'night':
        return Moon;
      default:
        return Cloud;
    }
  };

  const WeatherIcon = getWeatherIcon();

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.section
      className="atmospheric-hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="hero-background-glow" />
      
      <div className="hero-content">
        <motion.div
          className="hero-location"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="location-city">{city}</span>
          <span className="location-time">{getCurrentTime()}</span>
        </motion.div>

        <motion.div
          className="hero-main"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="hero-icon-container">
            <motion.div
              className="hero-icon-glow"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <WeatherIcon className="hero-icon" size={120} />
          </div>

          <div className="hero-temperature">
            <motion.span
              className="temperature-value"
              key={temperature}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {Math.round(temperature)}
            </motion.span>
            <span className="temperature-unit">°C</span>
          </div>

          <motion.div
            className="hero-condition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {condition}
          </motion.div>

          <motion.div
            className="hero-feels-like"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Sensação térmica {Math.round(feelsLike)}°C
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-decorative-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        />
      </div>
    </motion.section>
  );
}
