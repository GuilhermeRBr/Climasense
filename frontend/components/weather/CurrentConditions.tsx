'use client';

import { motion } from 'framer-motion';
import { Droplets, Sun, Wind, Gauge, CloudRain, Activity } from 'lucide-react';

interface CurrentConditionsProps {
  humidity: number;
  luminosity: number;
  pressure?: number;
  windSpeed?: number;
  rainfall: number;
  sensorStatus: 'online' | 'offline';
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function CurrentConditions({
  humidity,
  luminosity,
  pressure = 1013,
  windSpeed = 0,
  rainfall,
  sensorStatus,
  weatherTheme,
}: CurrentConditionsProps) {
  const conditions = [
    {
      id: 'humidity',
      icon: Droplets,
      label: 'Umidade',
      value: `${Math.round(humidity)}%`,
      color: '#60A5FA',
    },
    {
      id: 'luminosity',
      icon: Sun,
      label: 'Luminosidade',
      value: `${Math.round(luminosity)}%`,
      color: '#FBBF24',
    },
    {
      id: 'pressure',
      icon: Gauge,
      label: 'Pressão',
      value: `${Math.round(pressure)} hPa`,
      color: '#A78BFA',
    },
    {
      id: 'wind',
      icon: Wind,
      label: 'Vento',
      value: `${windSpeed.toFixed(1)} km/h`,
      color: '#34D399',
    },
    {
      id: 'rainfall',
      icon: CloudRain,
      label: 'Chuva',
      value: `${rainfall.toFixed(1)} mm`,
      color: '#60A5FA',
    },
    {
      id: 'sensor',
      icon: Activity,
      label: 'Sensor',
      value: sensorStatus === 'online' ? 'Online' : 'Offline',
      color: sensorStatus === 'online' ? '#34D399' : '#EF4444',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      className="current-conditions"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="conditions-grid">
        {conditions.map((condition) => {
          const Icon = condition.icon;
          return (
            <motion.div
              key={condition.id}
              className="condition-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="card-glow" style={{ backgroundColor: condition.color }} />
              
              <div className="card-header">
                <motion.div
                  className="card-icon"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon size={24} style={{ color: condition.color }} />
                </motion.div>
                <span className="card-label">{condition.label}</span>
              </div>

              <motion.div
                className="card-value"
                key={condition.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {condition.value}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
