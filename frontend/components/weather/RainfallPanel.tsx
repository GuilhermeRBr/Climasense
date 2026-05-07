'use client';

import { motion } from 'framer-motion';
import { CloudRain, Droplets, TrendingUp } from 'lucide-react';

interface RainfallPanelProps {
  current: number;
  dailyTotal: number;
  intensity: 'none' | 'light' | 'moderate' | 'heavy';
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function RainfallPanel({
  current,
  dailyTotal,
  intensity,
  weatherTheme,
}: RainfallPanelProps) {
  const getIntensityLabel = () => {
    switch (intensity) {
      case 'none':
        return 'Sem chuva';
      case 'light':
        return 'Chuva leve';
      case 'moderate':
        return 'Chuva moderada';
      case 'heavy':
        return 'Chuva forte';
      default:
        return 'Sem chuva';
    }
  };

  const getIntensityColor = () => {
    switch (intensity) {
      case 'none':
        return '#94A3B8';
      case 'light':
        return '#60A5FA';
      case 'moderate':
        return '#3B82F6';
      case 'heavy':
        return '#1E40AF';
      default:
        return '#94A3B8';
    }
  };

  const getIntensityPercentage = () => {
    switch (intensity) {
      case 'none':
        return 0;
      case 'light':
        return 33;
      case 'moderate':
        return 66;
      case 'heavy':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <motion.section
      className="rainfall-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="rainfall-card">
        <div className="rainfall-header">
          <CloudRain className="rainfall-header-icon" size={24} />
          <h3 className="rainfall-title">Pluviômetro</h3>
        </div>

        <div className="rainfall-content">
          <div className="rainfall-visual">
            <div className="rain-container">
              <motion.div
                className="rain-level"
                initial={{ height: 0 }}
                animate={{ height: `${getIntensityPercentage()}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ backgroundColor: getIntensityColor() }}
              />
              
              <div className="rain-drops">
                {intensity !== 'none' && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="rain-drop"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{
                          y: [0, 100],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: 'linear',
                        }}
                      >
                        <Droplets size={16} style={{ color: getIntensityColor() }} />
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              <div className="rain-markers">
                <span className="marker">100mm</span>
                <span className="marker">50mm</span>
                <span className="marker">0mm</span>
              </div>
            </div>
          </div>

          <div className="rainfall-data">
            <div className="rainfall-metric">
              <div className="metric-label">
                <CloudRain size={18} />
                <span>Atual</span>
              </div>
              <motion.div
                className="metric-value"
                key={current}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {current.toFixed(1)} <span className="metric-unit">mm/h</span>
              </motion.div>
            </div>

            <div className="rainfall-metric">
              <div className="metric-label">
                <TrendingUp size={18} />
                <span>Acumulado Hoje</span>
              </div>
              <motion.div
                className="metric-value"
                key={dailyTotal}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {dailyTotal.toFixed(1)} <span className="metric-unit">mm</span>
              </motion.div>
            </div>

            <div className="rainfall-intensity">
              <div className="intensity-label">Intensidade</div>
              <div
                className="intensity-badge"
                style={{
                  backgroundColor: `${getIntensityColor()}20`,
                  color: getIntensityColor(),
                  borderColor: getIntensityColor(),
                }}
              >
                {getIntensityLabel()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
