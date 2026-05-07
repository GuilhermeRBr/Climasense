'use client';

import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';
import { ForecastData } from '@/services/api';
import '@/styles/components/hourly-forecast.css';

interface HourlyForecastProps {
  forecast: ForecastData | null;
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

const getWeatherIcon = (code: number) => {
  if (code === 0 || code === 1) return Sun;
  if (code === 2 || code === 3) return Cloud;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  return Cloud;
};

export default function HourlyForecast({ forecast, weatherTheme }: HourlyForecastProps) {
  if (!forecast) return null;

  const dailyForecasts = forecast.daily.slice(0, 7);

  return (
    <motion.section
      className="forecast-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h2 className="forecast-title">Previsão dos Próximos Dias</h2>
      
      <div className="forecast-scroll">
        <div className="forecast-container">
          {dailyForecasts.map((day, index) => {
            const WeatherIcon = getWeatherIcon(day.weatherCode);
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });

            return (
              <motion.div
                key={day.date}
                className="forecast-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="forecast-day">{dayName}</div>
                
                <WeatherIcon className="forecast-icon" size={32} />
                
                <div className="forecast-temps">
                  <span className="temp-max">{Math.round(day.temperatureMax)}°</span>
                  <span className="temp-min">{Math.round(day.temperatureMin)}°</span>
                </div>
                
                {day.precipitation > 0 && (
                  <div className="forecast-rain">
                    {Math.round(day.precipitation)}mm
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
