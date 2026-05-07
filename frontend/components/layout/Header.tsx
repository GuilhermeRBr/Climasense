'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import '@/styles/components/header.css';

interface HeaderProps {
  city: string;
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function Header({ city, weatherTheme }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-content">
        <div className="location">
          <MapPin className="icon" size={20} />
          <span className="city-name">{city}</span>
        </div>

        <div className="time">
          <Clock className="icon" size={20} />
          <span className="current-time">{currentTime}</span>
        </div>
      </div>
    </motion.header>
  );
}
