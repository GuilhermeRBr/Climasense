import { Controller, Get, Query, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiBadGatewayResponse,
} from '@nestjs/swagger';
import { ForecastService } from './forecast.service';
import { ForecastQueryDto } from './dto/forecast-query.dto';
import { ForecastResponseDto } from './dto/forecast-response.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('forecast')
@Controller('previsao')
export class ForecastController {
  private readonly logger = new Logger(ForecastController.name);

  constructor(private readonly forecastService: ForecastService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obter previsão do tempo',
    description:
      'Retorna a previsão do tempo para uma localização específica usando a API Open-Meteo. Endpoint público, não requer autenticação.',
  })
  @ApiQuery({
    name: 'latitude',
    required: true,
    description: 'Latitude da localização (-90 a 90)',
    example: -23.5505,
    type: Number,
  })
  @ApiQuery({
    name: 'longitude',
    required: true,
    description: 'Longitude da localização (-180 a 180)',
    example: -46.6333,
    type: Number,
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Número de dias de previsão (1 a 16, padrão: 7)',
    example: 7,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Previsão do tempo obtida com sucesso',
    type: ForecastResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros inválidos (latitude/longitude fora dos limites)',
  })
  @ApiBadGatewayResponse({
    description: 'Erro ao comunicar com a API Open-Meteo',
  })
  async getForecast(
    @Query() query: ForecastQueryDto,
  ): Promise<ForecastResponseDto> {
    this.logger.log(
      `Forecast request - lat: ${query.latitude}, lon: ${query.longitude}, days: ${query.days || 7}`,
    );
    return await this.forecastService.getForecast(query);
  }
}
