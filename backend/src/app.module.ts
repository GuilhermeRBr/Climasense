import { Module } from '@nestjs/common';
import { SensorModule } from './sensor/sensor.module';
import { WeatherModule } from './weather/weather.module';
import { ForecastModule } from './forecast/forecast.module';
import { InfluxModule } from './influx/influx.module';

@Module({
  imports: [SensorModule, WeatherModule, ForecastModule, InfluxModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
