'use client';

import { motion } from 'framer-motion';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface LuminosityPanelProps {
  luminosity: number;
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function LuminosityPanel({ luminosity, weatherTheme }: LuminosityPanelProps) {
  const getLuminosityLevel = () => {
    if (luminosity < 20) return 'Muito baixa';
    if (luminosity < 40) return 'Baixa';
    if (luminosity < 60) return 'Moderada';
    if (luminosity < 80) return 'Alta';
    return 'Muito alta';
  };

  const getLuminosityIcon = () => {
    if (luminosity < 20) return Moon;
    if (luminosity < 40) return Sunset;
    if (luminosity < 60) return Sunrise;
    return Sun;
  };

  const getLuminosityColor = () => {
    if (luminosity < 20) return '#8B5CF6';
    if (luminosity < 40) return '#F59E0B';
    if (luminosity < 60) return '#FBBF24';
    return '#FCD34D';
  };

  const Icon = getLuminosityIcon();

  return (
    <motion.section
      className="luminosity-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="luminosity-card">
        <div className="luminosity-header">
          <Sun className="luminosity-header-icon" size={24} />
          <h3 className="luminosity-title">Luminosidade</h3>
        </div>

        <div className="luminosity-content">
          <div className="luminosity-visual">
            <motion.div
              className="luminosity-orb"
              animate={{
                boxShadow: [
                  `0 0 40px ${getLuminosityColor()}40`,
                  `0 0 60px ${getLuminosityColor()}60`,
                  `0 0 40px ${getLuminosityColor()}40`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.div
                className="luminosity-icon-container"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Icon size={64} style={{ color: getLuminosityColor() }} />
              </motion.div>

              <svg className="luminosity-ring" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={getLuminosityColor()}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="565.48"
                  initial={{ strokeDashoffset: 565.48 }}
                  animate={{ strokeDashoffset: 565.48 - (565.48 * luminosity) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '100px 100px',
                  }}
                />
              </svg>
            </motion.div>

            <motion.div
              className="luminosity-percentage"
              key={luminosity}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {Math.round(luminosity)}%
            </motion.div>
          </div>

          <div className="luminosity-data">
            <div className="luminosity-level">
              <div className="level-label">Nível de Luz</div>
              <div
                className="level-badge"
                style={{
                  backgroundColor: `${getLuminosityColor()}20`,
                  color: getLuminosityColor(),
                  borderColor: getLuminosityColor(),
                }}
              >
                {getLuminosityLevel()}
              </div>
            </div>

            <div className="luminosity-scale">
              <div className="scale-label">Escala de Luminosidade</div>
              <div className="scale-bar">
                <motion.div
                  className="scale-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${luminosity}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{
                    background: `linear-gradient(90deg, #8B5CF6 0%, #F59E0B 25%, #FBBF24 50%, #FCD34D 100%)`,
                  }}
                />
              </div>
              <div className="scale-markers">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="luminosity-info">
              <div className="info-item">
                <Moon size={16} />
                <span>Noite: 0-20%</span>
              </div>
              <div className="info-item">
                <Sunset size={16} />
                <span>Crepúsculo: 20-40%</span>
              </div>
              <div className="info-item">
                <Sunrise size={16} />
                <span>Amanhecer: 40-60%</span>
              </div>
              <div className="info-item">
                <Sun size={16} />
                <span>Dia: 60-100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
