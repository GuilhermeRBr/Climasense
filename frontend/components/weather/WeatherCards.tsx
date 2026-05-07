'use client';

import { motion } from 'framer-motion';
import { Droplets, Sun, CloudRain, Activity } from 'lucide-react';
import '@/styles/components/weather-cards.css';

interface WeatherCardsProps {
  humidity: number;
  luminosity: number;
  rainfall: number;
  sensorStatus: 'online' | 'offline';
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function WeatherCards({
  humidity,
  luminosity,
  rainfall,
  sensorStatus,
  weatherTheme,
}: WeatherCardsProps) {
  const cards = [
    {
      icon: Droplets,
      label: 'Umidade',
      value: `${Math.round(humidity)}%`,
      color: 'blue',
    },
    {
      icon: Sun,
      label: 'Luminosidade',
      value: `${Math.round(luminosity)}%`,
      color: 'yellow',
    },
    {
      icon: CloudRain,
      label: 'Chuva',
      value: `${rainfall}mm`,
      color: 'cyan',
    },
    {
      icon: Activity,
      label: 'Sensor',
      value: sensorStatus === 'online' ? 'Online' : 'Offline',
      color: sensorStatus === 'online' ? 'green' : 'red',
    },
  ];

  return (
    <motion.section
      className="weather-cards"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="cards-grid">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            className={`weather-card card-${card.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="card-content">
              <div className="card-header">
                <card.icon className="card-icon" size={24} />
                <span className="card-label">{card.label}</span>
              </div>
              <div className="card-value">{card.value}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
