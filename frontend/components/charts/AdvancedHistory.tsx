'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import PeriodFilter from './PeriodFilter';
import MetricSelector, { MetricType } from './MetricSelector';

interface AdvancedHistoryProps {
  data: any[];
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function AdvancedHistory({ data, weatherTheme }: AdvancedHistoryProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperature');

  const getMetricConfig = (metric: MetricType) => {
    const configs = {
      temperature: {
        dataKey: 'temperatura',
        unit: '°C',
        color: '#F59E0B',
        label: 'Temperatura',
      },
      humidity: {
        dataKey: 'umidade',
        unit: '%',
        color: '#60A5FA',
        label: 'Umidade',
      },
      pressure: {
        dataKey: 'pressao',
        unit: 'hPa',
        color: '#A78BFA',
        label: 'Pressão',
      },
      wind: {
        dataKey: 'velocidadeVento',
        unit: 'km/h',
        color: '#34D399',
        label: 'Vento',
      },
      rainfall: {
        dataKey: 'chuva',
        unit: 'mm',
        color: '#3B82F6',
        label: 'Chuva',
      },
      luminosity: {
        dataKey: 'luminosidade',
        unit: '%',
        color: '#FBBF24',
        label: 'Luminosidade',
      },
    };
    return configs[metric];
  };

  const config = getMetricConfig(selectedMetric);

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    if (selectedPeriod === '24h') {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (selectedPeriod === '7d') {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">
            {new Date(payload[0].payload.timestamp).toLocaleString('pt-BR')}
          </p>
          <p className="tooltip-value" style={{ color: config.color }}>
            {config.label}: {payload[0].value?.toFixed(1)} {config.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.section
      className="advanced-history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="history-card">
        <div className="history-header">
          <div className="history-title-section">
            <TrendingUp className="history-icon" size={24} style={{ color: config.color }} />
            <h3 className="history-title">Histórico - {config.label}</h3>
          </div>
          <PeriodFilter selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </div>

        <div className="history-metrics">
          <MetricSelector selectedMetric={selectedMetric} onMetricChange={setSelectedMetric} />
        </div>

        <motion.div
          className="history-chart"
          key={`${selectedMetric}-${selectedPeriod}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke="rgba(255, 255, 255, 0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.5)"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value}${config.unit}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                strokeWidth={2}
                fill={`url(#gradient-${selectedMetric})`}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.section>
  );
}
