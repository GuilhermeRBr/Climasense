'use client';

import { motion } from 'framer-motion';
import { Thermometer, Droplets, Gauge, Wind, CloudRain, Sun } from 'lucide-react';

export type MetricType = 'temperature' | 'humidity' | 'pressure' | 'wind' | 'rainfall' | 'luminosity';

interface MetricSelectorProps {
  selectedMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
}

export default function MetricSelector({ selectedMetric, onMetricChange }: MetricSelectorProps) {
  const metrics = [
    { value: 'temperature' as const, label: 'Temperatura', icon: Thermometer, color: '#F59E0B' },
    { value: 'humidity' as const, label: 'Umidade', icon: Droplets, color: '#60A5FA' },
    { value: 'pressure' as const, label: 'Pressão', icon: Gauge, color: '#A78BFA' },
    { value: 'wind' as const, label: 'Vento', icon: Wind, color: '#34D399' },
    { value: 'rainfall' as const, label: 'Chuva', icon: CloudRain, color: '#3B82F6' },
    { value: 'luminosity' as const, label: 'Luminosidade', icon: Sun, color: '#FBBF24' },
  ];

  return (
    <div className="metric-selector">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isSelected = selectedMetric === metric.value;

        return (
          <motion.button
            key={metric.value}
            className={`metric-button ${isSelected ? 'active' : ''}`}
            onClick={() => onMetricChange(metric.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSelected && (
              <motion.div
                className="metric-button-bg"
                layoutId="metric-bg"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ backgroundColor: `${metric.color}20` }}
              />
            )}
            <motion.div
              className="metric-icon"
              animate={{
                rotate: isSelected ? [0, 360] : 0,
              }}
              transition={{ duration: 0.6 }}
            >
              <Icon size={20} style={{ color: isSelected ? metric.color : 'rgba(255, 255, 255, 0.5)' }} />
            </motion.div>
            <span
              className="metric-label"
              style={{ color: isSelected ? metric.color : 'rgba(255, 255, 255, 0.6)' }}
            >
              {metric.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
