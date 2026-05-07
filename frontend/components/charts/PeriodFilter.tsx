'use client';

import { motion } from 'framer-motion';

interface PeriodFilterProps {
  selectedPeriod: '24h' | '7d' | '30d';
  onPeriodChange: (period: '24h' | '7d' | '30d') => void;
}

export default function PeriodFilter({ selectedPeriod, onPeriodChange }: PeriodFilterProps) {
  const periods = [
    { value: '24h' as const, label: '24 Horas' },
    { value: '7d' as const, label: '7 Dias' },
    { value: '30d' as const, label: '30 Dias' },
  ];

  return (
    <div className="period-filter">
      {periods.map((period) => (
        <motion.button
          key={period.value}
          className={`period-button ${selectedPeriod === period.value ? 'active' : ''}`}
          onClick={() => onPeriodChange(period.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {selectedPeriod === period.value && (
            <motion.div
              className="period-button-bg"
              layoutId="period-bg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="period-button-text">{period.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
