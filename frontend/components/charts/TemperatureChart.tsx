'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { SensorReading } from '@/services/api';
import '@/styles/components/temperature-chart.css';

interface TemperatureChartProps {
  data: SensorReading[];
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function TemperatureChart({ data, weatherTheme }: TemperatureChartProps) {
  const chartData = data.slice(-20).map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    temperatura: Math.round(reading.temperatura * 10) / 10,
    umidade: Math.round(reading.umidade * 10) / 10,
  }));

  const themeColors = {
    sunny: { temp: '#FF6B35', humidity: '#4ECDC4' },
    cloudy: { temp: '#95B8D1', humidity: '#809BCE' },
    rainy: { temp: '#5E7CE2', humidity: '#4A5899' },
    night: { temp: '#A78BFA', humidity: '#818CF8' },
  };

  const colors = themeColors[weatherTheme];

  return (
    <motion.section
      className="chart-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="chart-container">
        <h2 className="chart-title">Histórico Recente</h2>
        
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.temp} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.temp} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.humidity} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.humidity} stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <XAxis
                dataKey="time"
                stroke="rgba(255, 255, 255, 0.5)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                tickLine={false}
              />
              
              <YAxis
                stroke="rgba(255, 255, 255, 0.5)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                tickLine={false}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                }}
                labelStyle={{ color: '#fff', marginBottom: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              
              <Area
                type="monotone"
                dataKey="temperatura"
                stroke={colors.temp}
                strokeWidth={3}
                fill="url(#tempGradient)"
                name="Temperatura (°C)"
              />
              
              <Area
                type="monotone"
                dataKey="umidade"
                stroke={colors.humidity}
                strokeWidth={3}
                fill="url(#humidityGradient)"
                name="Umidade (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}
