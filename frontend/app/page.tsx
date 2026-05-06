'use client';

import { useState, useEffect } from 'react';
import { api, SensorReading } from '@/services/api';
import './page.css';

export default function Dashboard() {
  const [data, setData] = useState<SensorReading[]>([]);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceId] = useState('esp32_01');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [historicalData, latest] = await Promise.all([
          api.getSensorData(deviceId, '-24h'),
          api.getLatestReading(deviceId),
        ]);

        setData(historicalData);
        setLatestReading(latest);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [deviceId]);

  if (loading) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="loading">Carregando dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="error">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {latestReading && (
        <div className="latest-reading">
          <h2>Leitura Atual</h2>
          <div className="reading-cards">
            <div className="reading-card">
              <div className="reading-label">Temperatura</div>
              <div className="reading-value">{latestReading.temperatura.toFixed(1)}°C</div>
            </div>
            <div className="reading-card">
              <div className="reading-label">Umidade</div>
              <div className="reading-value">{latestReading.umidade.toFixed(1)}%</div>
            </div>
            <div className="reading-card">
              <div className="reading-label">Dispositivo</div>
              <div className="reading-value device-id">{latestReading.deviceId}</div>
            </div>
          </div>
          <div className="reading-timestamp">
            Ultima atualizacao: {new Date(latestReading.timestamp).toLocaleString('pt-BR')}
          </div>
        </div>
      )}

      <div className="historical-data">
        <h2>Dados Historicos (Ultimas 24h)</h2>
        {data.length === 0 ? (
          <div className="no-data">Nenhum dado disponivel</div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Temperatura</th>
                  <th>Umidade</th>
                  <th>Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 20).map((reading, index) => (
                  <tr key={index}>
                    <td>{new Date(reading.timestamp).toLocaleString('pt-BR')}</td>
                    <td>{reading.temperatura.toFixed(1)}°C</td>
                    <td>{reading.umidade.toFixed(1)}%</td>
                    <td>{reading.deviceId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="data-count">
          Total de leituras: {data.length}
        </div>
      </div>
    </div>
  );
}
