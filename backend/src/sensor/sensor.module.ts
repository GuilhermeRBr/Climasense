import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { InfluxModule } from '../influx/influx.module';

@Module({
  imports: [InfluxModule],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {}
