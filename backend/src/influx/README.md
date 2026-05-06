# InfluxDB Module

Module responsible for communication with InfluxDB time-series database.

## Service Methods

### writeSensorData
Writes sensor data to InfluxDB.

**Parameters:**
- `deviceId` (string): Device identifier
- `temperatura` (number): Temperature value
- `umidade` (number): Humidity value
- `timestamp` (Date, optional): Data timestamp (defaults to current time)

**Example:**
```typescript
await influxService.writeSensorData('esp32_01', 25.5, 60.2);
```

### querySensorData
Queries sensor data from InfluxDB.

**Parameters:**
- `deviceId` (string, optional): Device identifier filter
- `range` (string, optional): Time range (default: '-24h')
  - Examples: '-1h', '-24h', '-7d', '-30d'

**Returns:** Array of sensor data points

**Example:**
```typescript
const data = await influxService.querySensorData('esp32_01', '-1h');
```

### getLatestData
Gets the latest sensor data for a specific device.

**Parameters:**
- `deviceId` (string): Device identifier

**Returns:** Latest sensor data point or null

**Example:**
```typescript
const latest = await influxService.getLatestData('esp32_01');
```

### close
Closes the InfluxDB connection.

**Example:**
```typescript
await influxService.close();
```

## Data Structure

### Input (Write)
```typescript
{
  deviceId: string;
  temperatura: number;
  umidade: number;
  timestamp?: Date;
}
```

### Output (Query)
```typescript
{
  deviceId: string;
  temperatura: number;
  umidade: number;
  timestamp: string; // ISO 8601 format
}
```

## Configuration

Required environment variables in `.env`:

```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-token
INFLUXDB_ORG=climasense
INFLUXDB_BUCKET=sensor-data
```

## InfluxDB Setup

### Using Docker

```bash
docker run -d -p 8086:8086 \
  --name influxdb \
  -e DOCKER_INFLUXDB_INIT_MODE=setup \
  -e DOCKER_INFLUXDB_INIT_USERNAME=admin \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=adminpassword \
  -e DOCKER_INFLUXDB_INIT_ORG=climasense \
  -e DOCKER_INFLUXDB_INIT_BUCKET=sensor-data \
  -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=dev-token-change-in-production \
  influxdb:2.7
```

### Access InfluxDB UI

Open browser: `http://localhost:8086`

## Usage in Other Modules

Import the InfluxModule and inject the service:

```typescript
import { Module } from '@nestjs/common';
import { InfluxModule } from '../influx/influx.module';

@Module({
  imports: [InfluxModule],
  // ...
})
export class YourModule {}
```

```typescript
import { Injectable } from '@nestjs/common';
import { InfluxService } from '../influx/influx.service';

@Injectable()
export class YourService {
  constructor(private influxService: InfluxService) {}

  async saveData() {
    await this.influxService.writeSensorData('esp32_01', 25.5, 60.2);
  }
}
```
