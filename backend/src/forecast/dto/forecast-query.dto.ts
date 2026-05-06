import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ForecastQueryDto {
  @ApiProperty({
    description: 'Latitude da localização',
    example: -23.5505,
    type: Number,
    minimum: -90,
    maximum: 90,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude da localização',
    example: -46.6333,
    type: Number,
    minimum: -180,
    maximum: 180,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({
    description: 'Número de dias de previsão',
    example: 7,
    type: Number,
    minimum: 1,
    maximum: 16,
    required: false,
    default: 7,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(16)
  days?: number;
}
