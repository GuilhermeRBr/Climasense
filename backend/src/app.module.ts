import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SensorModule } from './sensor/sensor.module';
import { WeatherModule } from './weather/weather.module';
import { ForecastModule } from './forecast/forecast.module';
import { InfluxModule } from './influx/influx.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SensorModule,
    WeatherModule,
    ForecastModule,
    InfluxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
