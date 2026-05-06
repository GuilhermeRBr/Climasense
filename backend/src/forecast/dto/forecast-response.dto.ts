import { ApiProperty } from '@nestjs/swagger';

export class DailyForecastDto {
  @ApiProperty({
    description: 'Data da previsão',
    example: '2026-05-06',
  })
  date: string;

  @ApiProperty({
    description: 'Temperatura máxima em graus Celsius',
    example: 28.5,
  })
  temperatureMax: number;

  @ApiProperty({
    description: 'Temperatura mínima em graus Celsius',
    example: 18.2,
  })
  temperatureMin: number;

  @ApiProperty({
    description: 'Precipitação em mm',
    example: 2.5,
  })
  precipitation: number;

  @ApiProperty({
    description: 'Velocidade do vento em km/h',
    example: 15.3,
  })
  windSpeed: number;

  @ApiProperty({
    description: 'Código do clima (WMO)',
    example: 3,
  })
  weatherCode: number;
}

export class ForecastResponseDto {
  @ApiProperty({
    description: 'Latitude da localização',
    example: -23.5505,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude da localização',
    example: -46.6333,
  })
  longitude: number;

  @ApiProperty({
    description: 'Timezone da localização',
    example: 'America/Sao_Paulo',
  })
  timezone: string;

  @ApiProperty({
    description: 'Previsões diárias',
    type: [DailyForecastDto],
  })
  daily: DailyForecastDto[];
}
