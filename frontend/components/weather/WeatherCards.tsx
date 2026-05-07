'use client';

import { motion } from 'framer-motion';
import { Droplets, Sun, CloudRain, Activity } from 'lucide-react';
import AnimatedNumber from '@/components/effects/AnimatedNumber';
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
      value: humidity,
      unit: '%',
      color: 'blue',
      animated: true,
    },
    {
      icon: Sun,
      label: 'Luminosidade',
      value: luminosity,
      unit: '%',
      color: 'yellow',
      animated: true,
    },
    {
      icon: CloudRain,
      label: 'Chuva',
      value: rainfall,
      unit: 'mm',
      color: 'cyan',
      animated: true,
    },
    {
      icon: Activity,
      label: 'Sensor',
      value: sensorStatus === 'online' ? 'Online' : 'Offline',
      unit: '',
      color: sensorStatus === 'online' ? 'green' : 'red',
      animated: false,
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
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-header">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <card.icon className="card-icon" size={24} />
                </motion.div>
                <span className="card-label">{card.label}</span>
              </div>
              <div className="card-value">
                {card.animated && typeof card.value === 'number' ? (
                  <>
                    <AnimatedNumber value={Math.round(card.value)} />
                    {card.unit}
                  </>
                ) : (
                  <>
                    {card.value}
                    {card.unit}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
