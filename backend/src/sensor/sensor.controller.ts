import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorDataDto } from './dto/sensor-data.dto';

@Controller('dados')
export class SensorController {
  private readonly logger = new Logger(SensorController.name);

  constructor(private readonly sensorService: SensorService) {}

  /**
   * POST /dados
   * Receive sensor data from ESP32/Mock devices
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async receiveSensorData(@Body() sensorData: SensorDataDto) {
    this.logger.log(`Received data from device: ${sensorData.deviceId}`);
    return await this.sensorService.processSensorData(sensorData);
  }

  /**
   * GET /dados
   * Get historical sensor data
   * Query params:
   * - deviceId (optional): Filter by device
   * - range (optional): Time range (default: -24h)
   */
  @Get()
  async getSensorData(
    @Query('deviceId') deviceId?: string,
    @Query('range') range?: string,
  ) {
    this.logger.log(`Fetching data - deviceId: ${deviceId || 'all'}, range: ${range || '-24h'}`);
    return await this.sensorService.getDeviceData(deviceId, range);
  }

  /**
   * GET /dados/latest
   * Get latest reading for a device
   * Query params:
   * - deviceId (required): Device identifier
   */
  @Get('latest')
  async getLatestData(@Query('deviceId') deviceId: string) {
    if (!deviceId) {
      return { error: 'deviceId query parameter is required' };
    }
    
    this.logger.log(`Fetching latest data for device: ${deviceId}`);
    return await this.sensorService.getLatestReading(deviceId);
  }
}
