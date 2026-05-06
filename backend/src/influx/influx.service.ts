import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InfluxDB, Point, WriteApi, QueryApi } from '@influxdata/influxdb-client';

@Injectable()
export class InfluxService implements OnModuleInit {
  private readonly logger = new Logger(InfluxService.name);
  private influxDB: InfluxDB;
  private writeApi: WriteApi;
  private queryApi: QueryApi;
  private bucket: string;
  private org: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('INFLUXDB_URL') || 'http://localhost:8086';
    const token = this.configService.get<string>('INFLUXDB_TOKEN') || '';
    this.org = this.configService.get<string>('INFLUXDB_ORG') || 'climasense';
    this.bucket = this.configService.get<string>('INFLUXDB_BUCKET') || 'sensor-data';

    this.influxDB = new InfluxDB({ url, token });
    this.writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
    this.queryApi = this.influxDB.getQueryApi(this.org);

    this.logger.log('InfluxDB connection initialized');
  }

  /**
   * Write sensor data to InfluxDB
   * @param deviceId - Device identifier
   * @param temperatura - Temperature value
   * @param umidade - Humidity value
   * @param timestamp - Data timestamp
   */
  async writeSensorData(
    deviceId: string,
    temperatura: number,
    umidade: number,
    timestamp?: Date,
  ): Promise<void> {
    try {
      const point = new Point('sensor_data')
        .tag('device_id', deviceId)
        .floatField('temperatura', temperatura)
        .floatField('umidade', umidade)
        .timestamp(timestamp || new Date());

      this.writeApi.writePoint(point);
      await this.writeApi.flush();

      this.logger.log(`Data written for device: ${deviceId}`);
    } catch (error) {
      this.logger.error(`Error writing data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Query sensor data from InfluxDB
   * @param deviceId - Device identifier (optional)
   * @param range - Time range (e.g., '-1h', '-24h', '-7d')
   * @returns Array of sensor data points
   */
  async querySensorData(
    deviceId?: string,
    range: string = '-24h',
  ): Promise<any[]> {
    try {
      const deviceFilter = deviceId
        ? `|> filter(fn: (r) => r.device_id == "${deviceId}")`
        : '';

      const fluxQuery = `
        from(bucket: "${this.bucket}")
          |> range(start: ${range})
          |> filter(fn: (r) => r._measurement == "sensor_data")
          ${deviceFilter}
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      `;

      const data: any[] = [];

      return new Promise((resolve, reject) => {
        this.queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const record = tableMeta.toObject(row);
            data.push({
              deviceId: record.device_id,
              temperatura: record.temperatura,
              umidade: record.umidade,
              timestamp: record._time,
            });
          },
          error: (error) => {
            this.logger.error(`Query error: ${error.message}`);
            reject(error);
          },
          complete: () => {
            this.logger.log(`Query completed: ${data.length} records found`);
            resolve(data);
          },
        });
      });
    } catch (error) {
      this.logger.error(`Error querying data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get latest sensor data for a device
   * @param deviceId - Device identifier
   * @returns Latest sensor data point
   */
  async getLatestData(deviceId: string): Promise<any> {
    try {
      const fluxQuery = `
        from(bucket: "${this.bucket}")
          |> range(start: -1h)
          |> filter(fn: (r) => r._measurement == "sensor_data")
          |> filter(fn: (r) => r.device_id == "${deviceId}")
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
          |> last()
      `;

      return new Promise((resolve, reject) => {
        let latestData: any = null;

        this.queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const record = tableMeta.toObject(row);
            latestData = {
              deviceId: record.device_id,
              temperatura: record.temperatura,
              umidade: record.umidade,
              timestamp: record._time,
            };
          },
          error: (error) => {
            this.logger.error(`Query error: ${error.message}`);
            reject(error);
          },
          complete: () => {
            resolve(latestData);
          },
        });
      });
    } catch (error) {
      this.logger.error(`Error getting latest data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Close InfluxDB connection
   */
  async close(): Promise<void> {
    try {
      await this.writeApi.close();
      this.logger.log('InfluxDB connection closed');
    } catch (error) {
      this.logger.error(`Error closing connection: ${error.message}`);
      throw error;
    }
  }
}
