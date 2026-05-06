import { IsString, IsNumber, IsISO8601, IsNotEmpty } from 'class-validator';

export class SensorDataDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsNumber()
  @IsNotEmpty()
  temperatura: number;

  @IsNumber()
  @IsNotEmpty()
  umidade: number;

  @IsISO8601()
  @IsNotEmpty()
  timestamp: string;
}
