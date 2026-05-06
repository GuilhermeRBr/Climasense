import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { SensorService } from './sensor.service';
import { SensorDataDto } from './dto/sensor-data.dto';
import {
  SensorDataResponseDto,
  SensorReadingDto,
  ErrorResponseDto,
} from './dto/sensor-response.dto';

@ApiTags('sensor')
@Controller('dados')
export class SensorController {
  private readonly logger = new Logger(SensorController.name);

  constructor(private readonly sensorService: SensorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Receber dados dos sensores',
    description:
      'Endpoint para recepção de dados de temperatura e umidade dos dispositivos ESP32/Mock. Os dados são validados e armazenados no InfluxDB.',
  })
  @ApiBody({
    type: SensorDataDto,
    description: 'Dados do sensor a serem armazenados',
  })
  @ApiResponse({
    status: 201,
    description: 'Dados recebidos e armazenados com sucesso',
    type: SensorDataResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou campos obrigatórios ausentes',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno ao processar ou armazenar os dados',
  })
  async receiveSensorData(
    @Body() sensorData: SensorDataDto,
  ): Promise<SensorDataResponseDto> {
    this.logger.log(`Received data from device: ${sensorData.deviceId}`);
    return await this.sensorService.processSensorData(sensorData);
  }

  @Get()
  @ApiOperation({
    summary: 'Consultar dados históricos',
    description:
      'Retorna dados históricos dos sensores com possibilidade de filtrar por dispositivo e período de tempo.',
  })
  @ApiQuery({
    name: 'deviceId',
    required: false,
    description: 'Filtrar por identificador do dispositivo',
    example: 'esp32_01',
  })
  @ApiQuery({
    name: 'range',
    required: false,
    description:
      'Período de tempo para consulta (formato InfluxDB). Exemplos: -1h (última hora), -24h (último dia), -7d (última semana)',
    example: '-24h',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de leituras dos sensores',
    type: [SensorReadingDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao consultar dados no banco',
  })
  async getSensorData(
    @Query('deviceId') deviceId?: string,
    @Query('range') range?: string,
  ): Promise<SensorReadingDto[]> {
    this.logger.log(
      `Fetching data - deviceId: ${deviceId || 'all'}, range: ${range || '-24h'}`,
    );
    return await this.sensorService.getDeviceData(deviceId, range);
  }

  @Get('latest')
  @ApiOperation({
    summary: 'Obter última leitura',
    description:
      'Retorna a leitura mais recente de um dispositivo específico.',
  })
  @ApiQuery({
    name: 'deviceId',
    required: true,
    description: 'Identificador do dispositivo',
    example: 'esp32_01',
  })
  @ApiResponse({
    status: 200,
    description: 'Última leitura do dispositivo',
    type: SensorReadingDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetro deviceId é obrigatório',
  })
  @ApiResponse({
    status: 200,
    description: 'Nenhum dado encontrado para o dispositivo',
    schema: {
      type: 'null',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro ao consultar dados no banco',
  })
  async getLatestData(
    @Query('deviceId') deviceId: string,
  ): Promise<SensorReadingDto | null> {
    if (!deviceId) {
      throw new BadRequestException('deviceId query parameter is required');
    }

    this.logger.log(`Fetching latest data for device: ${deviceId}`);
    return await this.sensorService.getLatestReading(deviceId);
  }
}
