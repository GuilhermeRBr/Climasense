'use client';

import { motion } from 'framer-motion';
import { Wind, Navigation } from 'lucide-react';

interface WindPanelProps {
  speed: number;
  direction: number;
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function WindPanel({ speed, direction, weatherTheme }: WindPanelProps) {
  const getWindDescription = (speed: number) => {
    if (speed < 5) return 'Calmo';
    if (speed < 15) return 'Brisa leve';
    if (speed < 30) return 'Vento moderado';
    if (speed < 50) return 'Vento forte';
    return 'Ventania';
  };

  const getCardinalDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round(((degrees % 360) / 45)) % 8;
    return directions[index];
  };

  return (
    <motion.section
      className="wind-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="wind-card">
        <div className="wind-header">
          <Wind className="wind-header-icon" size={24} />
          <h3 className="wind-title">Vento</h3>
        </div>

        <div className="wind-content">
          <div className="wind-compass">
            <motion.div
              className="compass-ring"
              animate={{ rotate: 360 }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="compass-marker compass-n">N</div>
              <div className="compass-marker compass-e">L</div>
              <div className="compass-marker compass-s">S</div>
              <div className="compass-marker compass-w">O</div>
            </motion.div>

            <motion.div
              className="compass-needle"
              animate={{ rotate: direction }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Navigation size={32} />
            </motion.div>

            <div className="compass-center" />
          </div>

          <div className="wind-data">
            <motion.div
              className="wind-speed"
              key={speed}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="speed-value">{speed.toFixed(1)}</span>
              <span className="speed-unit">km/h</span>
            </motion.div>

            <div className="wind-direction-text">
              <span className="direction-label">Direção</span>
              <span className="direction-value">{getCardinalDirection(direction)}</span>
            </div>

            <div className="wind-description">{getWindDescription(speed)}</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
