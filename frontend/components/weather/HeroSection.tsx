'use client';

import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Moon } from 'lucide-react';
import AnimatedNumber from '@/components/effects/AnimatedNumber';
import '@/styles/components/hero-section.css';

interface HeroSectionProps {
  temperature: number;
  condition: string;
  feelsLike: number;
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  night: Moon,
};

export default function HeroSection({
  temperature,
  condition,
  feelsLike,
  weatherTheme,
}: HeroSectionProps) {
  const WeatherIcon = weatherIcons[weatherTheme];

  return (
    <motion.section
      className="hero-section"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="hero-content">
        <motion.div
          className="weather-icon-container"
          animate={{
            rotate: weatherTheme === 'sunny' ? [0, 360] : 0,
            y: weatherTheme === 'cloudy' ? [0, -10, 0] : 0,
            scale: weatherTheme === 'rainy' ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: weatherTheme === 'sunny' ? 20 : 3,
            repeat: Infinity,
            ease: weatherTheme === 'sunny' ? 'linear' : 'easeInOut',
          }}
        >
          <WeatherIcon className="weather-icon" size={80} />
        </motion.div>

        <motion.div
          className="temperature-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatedNumber 
            value={Math.round(temperature)} 
            className="temperature-value"
          />
          <span className="temperature-unit">°C</span>
        </motion.div>

        <motion.p
          className="weather-condition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {condition}
        </motion.p>

        <motion.p
          className="feels-like"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Sensação térmica <AnimatedNumber value={Math.round(feelsLike)} />°C
        </motion.p>
      </div>
    </motion.section>
  );
}
