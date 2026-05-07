import { Injectable, Logger } from '@nestjs/common';
import { InfluxService } from '../influx/influx.service';
import { SensorDataDto } from './dto/sensor-data.dto';

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);

  constructor(private readonly influxService: InfluxService) {}

  /**
   * Process and store sensor data
   * @param sensorData - Sensor data from device
   * @returns Success confirmation
   */
  async processSensorData(sensorData: SensorDataDto): Promise<{ message: string; data: SensorDataDto }> {
    try {
      this.logger.log(`Processing data from device: ${sensorData.deviceId}`);

      const timestamp = new Date(sensorData.timestamp);

      await this.influxService.writeSensorData(
        sensorData.deviceId,
        sensorData.temperatura,
        sensorData.umidade,
        sensorData.pressao,
        sensorData.velocidadeVento,
        sensorData.direcaoVento,
        sensorData.chuva,
        sensorData.luminosidade,
        timestamp,
      );

      this.logger.log(`Data successfully stored for device: ${sensorData.deviceId}`);

      return {
        message: 'Data received and stored successfully',
        data: sensorData,
      };
    } catch (error) {
      this.logger.error(`Error processing sensor data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get historical data for a device
   * @param deviceId - Device identifier
   * @param range - Time range (e.g., '-1h', '-24h')
   * @returns Array of sensor readings
   */
  async getDeviceData(deviceId?: string, range: string = '-24h'): Promise<any[]> {
    try {
      this.logger.log(`Fetching data for device: ${deviceId || 'all'}, range: ${range}`);
      
      const data = await this.influxService.querySensorData(deviceId, range);
      
      this.logger.log(`Retrieved ${data.length} records`);
      
      return data;
    } catch (error) {
      this.logger.error(`Error fetching device data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get latest reading for a device
   * @param deviceId - Device identifier
   * @returns Latest sensor reading
   */
  async getLatestReading(deviceId: string): Promise<any> {
    try {
      this.logger.log(`Fetching latest reading for device: ${deviceId}`);
      
      const data = await this.influxService.getLatestData(deviceId);
      
      if (!data) {
        this.logger.warn(`No data found for device: ${deviceId}`);
      }
      
      return data;
    } catch (error) {
      this.logger.error(`Error fetching latest reading: ${error.message}`);
      throw error;
    }
  }
}
