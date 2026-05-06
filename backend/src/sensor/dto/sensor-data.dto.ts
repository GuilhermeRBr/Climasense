import { IsString, IsNumber, IsISO8601, IsNotEmpty } from 'class-validator';
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
  umidade: number;

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
