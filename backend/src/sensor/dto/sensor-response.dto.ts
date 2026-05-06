import { ApiProperty } from '@nestjs/swagger';
import { SensorDataDto } from './sensor-data.dto';

export class SensorDataResponseDto {
  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'Data received and stored successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Dados do sensor recebidos',
    type: SensorDataDto,
  })
  data: SensorDataDto;
}

export class SensorReadingDto {
  @ApiProperty({
    description: 'Identificador único do dispositivo',
    example: 'esp32_01',
  })
  deviceId: string;

  @ApiProperty({
    description: 'Temperatura em graus Celsius',
    example: 25.5,
  })
  temperatura: number;

  @ApiProperty({
    description: 'Umidade relativa do ar em porcentagem',
    example: 60.2,
  })
  umidade: number;

  @ApiProperty({
    description: 'Timestamp da leitura',
    example: '2026-05-06T10:30:00.000Z',
  })
  timestamp: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensagens de erro',
    example: ['deviceId should not be empty', 'temperatura must be a number'],
    type: [String],
  })
  message: string[];

  @ApiProperty({
    description: 'Tipo de erro',
    example: 'Bad Request',
  })
  error: string;
}
