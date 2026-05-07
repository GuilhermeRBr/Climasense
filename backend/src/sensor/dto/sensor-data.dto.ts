import { IsString, IsNumber, IsISO8601, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SensorDataDto {
  @ApiProperty({
    description: 'Identificador único do dispositivo',
    example: 'esp32_01',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description: 'Temperatura em graus Celsius',
    example: 25.5,
    type: Number,
    minimum: -50,
    maximum: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-50)
  @Max(100)
  temperatura: number;

  @ApiProperty({
    description: 'Umidade relativa do ar em porcentagem',
    example: 60.2,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  umidade: number;

  @ApiProperty({
    description: 'Pressão atmosférica em hPa',
    example: 1013.25,
    type: Number,
    minimum: 800,
    maximum: 1200,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(800)
  @Max(1200)
  pressao?: number;

  @ApiProperty({
    description: 'Velocidade do vento em km/h',
    example: 12.5,
    type: Number,
    minimum: 0,
    maximum: 200,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(200)
  velocidadeVento?: number;

  @ApiProperty({
    description: 'Direção do vento em graus (0-360)',
    example: 180,
    type: Number,
    minimum: 0,
    maximum: 360,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(360)
  direcaoVento?: number;

  @ApiProperty({
    description: 'Precipitação de chuva em mm',
    example: 2.5,
    type: Number,
    minimum: 0,
    maximum: 500,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(500)
  chuva?: number;

  @ApiProperty({
    description: 'Luminosidade em porcentagem (0-100)',
    example: 75.0,
    type: Number,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  luminosidade?: number;

  @ApiProperty({
    description: 'Timestamp da coleta dos dados em formato ISO 8601',
    example: '2026-05-06T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsISO8601()
  @IsNotEmpty()
  timestamp: string;
}
