'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Info, Sparkles } from 'lucide-react';

interface SensorReading {
  temperatura: number;
  umidade: number;
  timestamp: string;
}

interface WeatherInsightsProps {
  currentData: SensorReading | null;
  historicalData: SensorReading[];
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function WeatherInsights({ currentData, historicalData, weatherTheme }: WeatherInsightsProps) {
  const generateInsights = () => {
    if (!currentData || historicalData.length < 2) {
      return [];
    }

    const insights: Array<{
      type: 'info' | 'warning' | 'trend';
      icon: any;
      title: string;
      description: string;
      color: string;
    }> = [];

    const recentData = historicalData.slice(-6);
    const avgTemp = recentData.reduce((sum, d) => sum + d.temperatura, 0) / recentData.length;
    const avgHumidity = recentData.reduce((sum, d) => sum + d.umidade, 0) / recentData.length;

    const tempDiff = currentData.temperatura - avgTemp;
    const humidityDiff = currentData.umidade - avgHumidity;

    if (Math.abs(tempDiff) > 2) {
      insights.push({
        type: 'trend',
        icon: tempDiff > 0 ? TrendingUp : TrendingDown,
        title: tempDiff > 0 ? 'Temperatura em alta' : 'Temperatura em queda',
        description: `${Math.abs(tempDiff).toFixed(1)}°C ${tempDiff > 0 ? 'acima' : 'abaixo'} da média das últimas horas`,
        color: tempDiff > 0 ? '#F59E0B' : '#60A5FA',
      });
    }

    if (currentData.umidade > 80) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Umidade elevada',
        description: 'Possibilidade de chuva ou formação de neblina',
        color: '#60A5FA',
      });
    }

    if (currentData.umidade < 30) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Ar muito seco',
        description: 'Recomenda-se aumentar a hidratação',
        color: '#F59E0B',
      });
    }

    if (Math.abs(humidityDiff) > 15) {
      insights.push({
        type: 'trend',
        icon: humidityDiff > 0 ? TrendingUp : TrendingDown,
        title: humidityDiff > 0 ? 'Umidade aumentando' : 'Umidade diminuindo',
        description: `${Math.abs(humidityDiff).toFixed(0)}% ${humidityDiff > 0 ? 'acima' : 'abaixo'} da média recente`,
        color: '#60A5FA',
      });
    }

    if (currentData.temperatura > 30) {
      insights.push({
        type: 'info',
        icon: Info,
        title: 'Temperatura alta',
        description: 'Mantenha-se hidratado e evite exposição prolongada ao sol',
        color: '#F59E0B',
      });
    }

    if (currentData.temperatura < 15) {
      insights.push({
        type: 'info',
        icon: Info,
        title: 'Temperatura baixa',
        description: 'Vista roupas adequadas para o frio',
        color: '#60A5FA',
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        icon: Sparkles,
        title: 'Condições estáveis',
        description: 'O clima está dentro dos padrões normais',
        color: '#34D399',
      });
    }

    return insights.slice(0, 4);
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="weather-insights"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="insights-header">
        <Sparkles className="insights-icon" size={24} />
        <h3 className="insights-title">Insights Climáticos</h3>
      </div>

      <motion.div
        className="insights-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              className={`insight-card insight-${insight.type}`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="insight-glow" style={{ backgroundColor: insight.color }} />
              
              <div className="insight-icon-container">
                <Icon size={24} style={{ color: insight.color }} />
              </div>

              <div className="insight-content">
                <h4 className="insight-title">{insight.title}</h4>
                <p className="insight-description">{insight.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
