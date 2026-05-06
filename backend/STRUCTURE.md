# ClimaSense - Backend

## Project Structure

```
backend/
├── src/
│   ├── sensor/          # Sensor data reception module ✅
│   │   ├── dto/
│   │   │   └── sensor-data.dto.ts
│   │   ├── sensor.controller.ts
│   │   ├── sensor.service.ts
│   │   ├── sensor.module.ts
│   │   └── README.md
│   ├── weather/         # Weather data module
│   ├── forecast/        # Weather forecast module (Open-Meteo)
│   ├── influx/          # InfluxDB integration module ✅
│   │   ├── influx.module.ts
│   │   ├── influx.service.ts
│   │   └── README.md
│   ├── app.module.ts    # Main application module
│   └── main.ts          # Application entry point
├── test/                # E2E tests
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── INFLUXDB_SETUP.md    # InfluxDB setup guide
├── TEST_EXAMPLES.md     # API testing examples
└── package.json
```

## Modular Architecture

Each module follows the structure:
- **Controller**: Receives HTTP requests
- **Service**: Contains business logic
- **Provider**: Integration with external services (e.g., InfluxDB)

## Modules

### Sensor ✅
Responsible for receiving data from ESP32/Mock devices.

**Status:** Implemented

**Endpoints:**
- `POST /dados` - Receive sensor data
- `GET /dados` - Get historical data
- `GET /dados/latest` - Get latest reading

**Features:**
- DTO validation with class-validator
- Integration with InfluxService
- Error handling and logging
- Query filters (deviceId, time range)

**Architecture:**
```
SensorController → SensorService → InfluxService → InfluxDB
```

### Weather
Historical weather data management.

**Status:** Pending implementation

### Forecast
Integration with Open-Meteo external API for weather forecasts.

**Status:** Pending implementation

### Influx ✅
Provider for communication with InfluxDB time-series database.

**Status:** Implemented

**Features:**
- Write sensor data to InfluxDB
- Query historical data with time range filters
- Get latest data for specific devices
- Automatic connection management
- Error handling and logging

**Methods:**
- `writeSensorData()` - Write sensor data
- `querySensorData()` - Query historical data
- `getLatestData()` - Get latest reading
- `close()` - Close connection

## Configuration

### Environment Variables

Required variables in `.env`:

```env
# InfluxDB
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-token
INFLUXDB_ORG=climasense
INFLUXDB_BUCKET=sensor-data

# API
API_KEY=your-api-key
PORT=3000
```

### Global Configuration

**Validation:**
- Global ValidationPipe enabled
- Whitelist mode (strips unknown properties)
- Transform mode (auto-converts types)

**CORS:**
- Enabled for frontend integration

## API Endpoints

### POST /dados
Receive sensor data from devices.

**Request:**
```json
{
  "deviceId": "esp32_01",
  "temperatura": 25.5,
  "umidade": 60.2,
  "timestamp": "2026-05-06T10:30:00Z"
}
```

**Response (201):**
```json
{
  "message": "Data received and stored successfully",
  "data": { ... }
}
```

### GET /dados
Get historical sensor data.

**Query Params:**
- `deviceId` (optional): Filter by device
- `range` (optional): Time range (default: -24h)

**Response (200):**
```json
[
  {
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00Z"
  }
]
```

### GET /dados/latest
Get latest reading for a device.

**Query Params:**
- `deviceId` (required): Device identifier

**Response (200):**
```json
{
  "deviceId": "esp32_01",
  "temperatura": 25.5,
  "umidade": 60.2,
  "timestamp": "2026-05-06T10:30:00Z"
}
```

## Testing

See `TEST_EXAMPLES.md` for detailed testing examples with:
- cURL commands
- PowerShell scripts
- Postman collection
- Load testing scripts
- Validation testing

## Next Steps

- [x] Configure InfluxDB ✅
- [x] Implement Sensor endpoints ✅
- [x] Add validations ✅
- [ ] Implement API Key Guard
- [ ] Implement Forecast module
- [ ] Add error handling middleware
- [ ] Add request logging
- [ ] Add rate limiting
