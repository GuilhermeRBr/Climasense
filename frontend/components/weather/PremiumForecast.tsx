'use client';

import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudDrizzle, CloudSnow, Wind, Droplets, TrendingUp, TrendingDown } from 'lucide-react';

interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
}

interface PremiumForecastProps {
  forecast: {
    daily: DailyForecast[];
  } | null;
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function PremiumForecast({ forecast, weatherTheme }: PremiumForecastProps) {
  const getWeatherIcon = (code: number) => {
    if (code === 0) return Sun;
    if (code <= 3) return Cloud;
    if (code <= 67) return CloudRain;
    if (code <= 77) return CloudSnow;
    return CloudDrizzle;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Céu limpo';
    if (code <= 3) return 'Parcialmente nublado';
    if (code <= 67) return 'Chuva';
    if (code <= 77) return 'Neve';
    return 'Garoa';
  };

  const getWeatherColor = (code: number) => {
    if (code === 0) return '#FBBF24';
    if (code <= 3) return '#94A3B8';
    if (code <= 67) return '#60A5FA';
    if (code <= 77) return '#A5B4FC';
    return '#93C5FD';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
    }
  };

  if (!forecast || !forecast.daily || forecast.daily.length === 0) {
    return null;
  }

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      className="premium-forecast"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="forecast-header">
        <h3 className="forecast-title">Previsão dos Próximos Dias</h3>
        <span className="forecast-subtitle">{forecast.daily.length} dias</span>
      </div>

      <motion.div
        className="forecast-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {forecast.daily.map((day, index) => {
          const Icon = getWeatherIcon(day.weatherCode);
          const color = getWeatherColor(day.weatherCode);
          const isToday = index === 0;

          return (
            <motion.div
              key={day.date}
              className={`forecast-card ${isToday ? 'today' : ''}`}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="forecast-card-glow" style={{ backgroundColor: color }} />

              <div className="forecast-date">
                <span className="date-label">{formatDate(day.date)}</span>
                {isToday && <span className="today-badge">Hoje</span>}
              </div>

              <motion.div
                className="forecast-icon"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2,
                }}
              >
                <Icon size={48} style={{ color }} />
              </motion.div>

              <div className="forecast-description">{getWeatherDescription(day.weatherCode)}</div>

              <div className="forecast-temps">
                <div className="temp-max">
                  <TrendingUp size={16} />
                  <span>{Math.round(day.temperatureMax)}°</span>
                </div>
                <div className="temp-divider" />
                <div className="temp-min">
                  <TrendingDown size={16} />
                  <span>{Math.round(day.temperatureMin)}°</span>
                </div>
              </div>

              <div className="forecast-details">
                <div className="detail-item">
                  <Droplets size={14} />
                  <span>{day.precipitation.toFixed(0)}mm</span>
                </div>
                <div className="detail-item">
                  <Wind size={14} />
                  <span>{day.windSpeed.toFixed(0)}km/h</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
