export interface SensorReading {
  deviceId: string;
  temperatura: number;
  umidade: number;
  pressao?: number;
  velocidadeVento?: number;
  direcaoVento?: number;
  chuva?: number;
  luminosidade?: number;
  timestamp: Date | string;
}

export interface ClimateData {
  temperatura: number;
  umidade: number;
  pressao?: number;
  velocidadeVento?: number;
  direcaoVento?: number;
  chuva?: number;
  luminosidade?: number;
}

export interface DeviceInfo {
  deviceId: string;
  lastSeen?: Date;
  status: 'online' | 'offline';
}
