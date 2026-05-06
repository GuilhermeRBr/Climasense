const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SensorData {
  deviceId: string;
  temperatura: number;
  umidade: number;
  timestamp: string;
}

export interface SensorReading {
  deviceId: string;
  temperatura: number;
  umidade: number;
  timestamp: string;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
}

export interface ForecastData {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: DailyForecast[];
}

export const api = {
  async getSensorData(deviceId?: string, range?: string): Promise<SensorReading[]> {
    const params = new URLSearchParams();
    if (deviceId) params.append('deviceId', deviceId);
    if (range) params.append('range', range);

    const response = await fetch(`${API_BASE_URL}/dados?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sensor data');
    }
    
    return response.json();
  },

  async getLatestReading(deviceId: string): Promise<SensorReading | null> {
    const response = await fetch(`${API_BASE_URL}/dados/latest?deviceId=${deviceId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch latest reading');
    }
    
    return response.json();
  },

  async getForecast(latitude: number, longitude: number, days: number = 7): Promise<ForecastData> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      days: days.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/previsao?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast');
    }
    
    return response.json();
  },
};
