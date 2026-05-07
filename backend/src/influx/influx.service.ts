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

    this.logger.log(`Initializing InfluxDB connection...`);
    this.logger.log(`URL: ${url}`);
    this.logger.log(`Org: ${this.org}`);
    this.logger.log(`Bucket: ${this.bucket}`);

    this.influxDB = new InfluxDB({ url, token });
    this.writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
    
    // Configure write options for better reliability
    this.writeApi.useDefaultTags({ source: 'climasense-backend' });
    
    this.queryApi = this.influxDB.getQueryApi(this.org);

    this.logger.log('InfluxDB connection initialized successfully');
  }

  /**
   * Write sensor data to InfluxDB
   * @param deviceId - Device identifier
   * @param temperatura - Temperature value
   * @param umidade - Humidity value
   * @param pressao - Atmospheric pressure (optional)
   * @param velocidadeVento - Wind speed (optional)
   * @param direcaoVento - Wind direction (optional)
   * @param chuva - Rainfall (optional)
   * @param luminosidade - Luminosity (optional)
   * @param timestamp - Data timestamp
   */
  async writeSensorData(
    deviceId: string,
    temperatura: number,
    umidade: number,
    pressao?: number,
    velocidadeVento?: number,
    direcaoVento?: number,
    chuva?: number,
    luminosidade?: number,
    timestamp?: Date,
  ): Promise<void> {
    try {
      const ts = timestamp || new Date();
      
      this.logger.log(`Writing data for device: ${deviceId}`);
      this.logger.log(`  Temperature: ${temperatura}°C`);
      this.logger.log(`  Humidity: ${umidade}%`);
      if (pressao !== undefined) this.logger.log(`  Pressure: ${pressao} hPa`);
      if (velocidadeVento !== undefined) this.logger.log(`  Wind Speed: ${velocidadeVento} km/h`);
      if (direcaoVento !== undefined) this.logger.log(`  Wind Direction: ${direcaoVento}°`);
      if (chuva !== undefined) this.logger.log(`  Rainfall: ${chuva} mm`);
      if (luminosidade !== undefined) this.logger.log(`  Luminosity: ${luminosidade}%`);
      this.logger.log(`  Timestamp: ${ts.toISOString()}`);

      const point = new Point('clima')
        .tag('deviceId', deviceId)
        .floatField('temperatura', temperatura)
        .floatField('umidade', umidade);

      if (pressao !== undefined) {
        point.floatField('pressao', pressao);
      }
      if (velocidadeVento !== undefined) {
        point.floatField('velocidade_vento', velocidadeVento);
      }
      if (direcaoVento !== undefined) {
        point.floatField('direcao_vento', direcaoVento);
      }
      if (chuva !== undefined) {
        point.floatField('chuva', chuva);
      }
      if (luminosidade !== undefined) {
        point.floatField('luminosidade', luminosidade);
      }

      point.timestamp(ts);

      this.writeApi.writePoint(point);
      
      await this.writeApi.flush();

      this.logger.log(`✓ Data successfully written to InfluxDB for device: ${deviceId}`);
    } catch (error) {
      this.logger.error(`✗ Error writing data to InfluxDB: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
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
        ? `|> filter(fn: (r) => r.deviceId == "${deviceId}")`
        : '';

      const fluxQuery = `
        from(bucket: "${this.bucket}")
          |> range(start: ${range})
          |> filter(fn: (r) => r._measurement == "clima")
          ${deviceFilter}
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      `;

      const data: any[] = [];

      return new Promise((resolve, reject) => {
        this.queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const record = tableMeta.toObject(row);
            data.push({
              deviceId: record.deviceId,
              temperatura: record.temperatura,
              umidade: record.umidade,
              pressao: record.pressao,
              velocidadeVento: record.velocidade_vento,
              direcaoVento: record.direcao_vento,
              chuva: record.chuva,
              luminosidade: record.luminosidade,
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
          |> range(start: -7d)
          |> filter(fn: (r) => r._measurement == "clima")
          |> filter(fn: (r) => r.deviceId == "${deviceId}")
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
          |> sort(columns: ["_time"], desc: true)
          |> limit(n: 1)
      `;

      return new Promise((resolve, reject) => {
        let latestData: any = null;

        this.queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const record = tableMeta.toObject(row);
            latestData = {
              deviceId: record.deviceId,
              temperatura: record.temperatura,
              umidade: record.umidade,
              pressao: record.pressao,
              velocidadeVento: record.velocidade_vento,
              direcaoVento: record.direcao_vento,
              chuva: record.chuva,
              luminosidade: record.luminosidade,
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
