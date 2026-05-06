'use client';

import { useState, useEffect } from 'react';
import { api, ForecastData } from '@/services/api';
import './page.css';

const weatherDescriptions: { [key: number]: string } = {
  0: 'Ceu limpo',
  1: 'Principalmente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa densa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Graos de neve',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva violentas',
  85: 'Pancadas de neve leves',
  86: 'Pancadas de neve fortes',
  95: 'Tempestade',
  96: 'Tempestade com granizo leve',
  99: 'Tempestade com granizo forte',
};

export default function PrevisaoPage() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latitude] = useState(-23.5505);
  const [longitude] = useState(-46.6333);
  const [days] = useState(7);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await api.getForecast(latitude, longitude, days);
        setForecast(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [latitude, longitude, days]);

  if (loading) {
    return (
      <div className="previsao">
        <h1>Previsao do Tempo</h1>
        <div className="loading">Carregando previsao...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="previsao">
        <h1>Previsao do Tempo</h1>
        <div className="error">Erro: {error}</div>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="previsao">
        <h1>Previsao do Tempo</h1>
        <div className="no-data">Nenhum dado disponivel</div>
      </div>
    );
  }

  return (
    <div className="previsao">
      <h1>Previsao do Tempo</h1>

      <div className="location-info">
        <div className="location-item">
          <span className="location-label">Localizacao:</span>
          <span className="location-value">Sao Paulo, SP</span>
        </div>
        <div className="location-item">
          <span className="location-label">Coordenadas:</span>
          <span className="location-value">
            {forecast.latitude.toFixed(4)}, {forecast.longitude.toFixed(4)}
          </span>
        </div>
        <div className="location-item">
          <span className="location-label">Timezone:</span>
          <span className="location-value">{forecast.timezone}</span>
        </div>
      </div>

      <div className="forecast-grid">
        {forecast.daily.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-date">
              {new Date(day.date).toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
              })}
            </div>

            <div className="forecast-weather">
              {weatherDescriptions[day.weatherCode] || 'Desconhecido'}
            </div>

            <div className="forecast-temps">
              <div className="temp-max">
                <span className="temp-label">Max</span>
                <span className="temp-value">{day.temperatureMax.toFixed(1)}°C</span>
              </div>
              <div className="temp-min">
                <span className="temp-label">Min</span>
                <span className="temp-value">{day.temperatureMin.toFixed(1)}°C</span>
              </div>
            </div>

            <div className="forecast-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-value">{day.precipitation.toFixed(1)} mm</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <span className="detail-value">{day.windSpeed.toFixed(1)} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
