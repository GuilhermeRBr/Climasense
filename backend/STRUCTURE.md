# ClimaSense - Backend

## Project Structure

```
backend/
├── src/
│   ├── sensor/          # Sensor data reception module ✅
│   │   ├── dto/
│   │   │   ├── sensor-data.dto.ts
│   │   │   ├── sensor-response.dto.ts
│   │   │   └── README.md
│   │   ├── sensor.controller.ts
│   │   ├── sensor.service.ts
│   │   ├── sensor.module.ts
│   │   └── README.md
│   ├── weather/         # Weather data module
│   ├── forecast/        # Weather forecast module (Open-Meteo) ✅
│   │   ├── dto/
│   │   │   ├── forecast-query.dto.ts
│   │   │   └── forecast-response.dto.ts
│   │   ├── forecast.controller.ts
│   │   ├── forecast.service.ts
│   │   └── forecast.module.ts
│   ├── influx/          # InfluxDB integration module ✅
│   │   ├── influx.module.ts
│   │   ├── influx.service.ts
│   │   └── README.md
│   ├── common/          # Common utilities ✅
│   │   ├── guards/
│   │   │   └── api-key.guard.ts
│   │   └── decorators/
│   │       └── public.decorator.ts
│   ├── app.module.ts    # Main application module
│   └── main.ts          # Application entry point (with Swagger) ✅
├── test/                # E2E tests
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── INFLUXDB_SETUP.md    # InfluxDB setup guide
├── SWAGGER_DOCUMENTATION.md  # Swagger documentation guide ✅
├── TEST_EXAMPLES.md     # API testing examples
└── package.json
```

## Modular Architecture

Each module follows the structure:
- **Controller**: Receives HTTP requests (documented with Swagger)
- **Service**: Contains business logic
- **Provider**: Integration with external services (e.g., InfluxDB)
- **DTOs**: Data validation and API documentation

## Modules

### Sensor ✅
Responsible for receiving data from ESP32/Mock devices.

**Status:** Implemented with Swagger documentation and API Key protection

**Endpoints:**
- `POST /dados` - Receive sensor data (Protected with API Key)
- `GET /dados` - Get historical data (Public)
- `GET /dados/latest` - Get latest reading (Public)

**Features:**
- DTO validation with class-validator
- Integration with InfluxService
- Error handling and logging
- Query filters (deviceId, time range)
- **Swagger documentation** ✅
- **Interactive API testing** ✅
- **API Key Guard protection** ✅

**Architecture:**
```
SensorController → SensorService → InfluxService → InfluxDB
```

**DTOs:**
- `SensorDataDto`: Request validation
- `SensorDataResponseDto`: Success response
- `SensorReadingDto`: Historical reading
- `ErrorResponseDto`: Error response

### Weather
Historical weather data management.

**Status:** Pending implementation

### Forecast ✅
Integration with Open-Meteo external API for weather forecasts.

**Status:** Implemented

**Endpoints:**
- `GET /previsao` - Get weather forecast (Public)

**Features:**
- Integration with Open-Meteo API
- Query validation (latitude, longitude, days)
- Data transformation
- Error handling
- Weather code descriptions
- Swagger documentation

**Query Parameters:**
- `latitude` (required): -90 to 90
- `longitude` (required): -180 to 180
- `days` (optional): 1 to 16 (default: 7)

**Response:**
- Daily forecasts
- Temperature (max/min)
- Precipitation
- Wind speed
- Weather code

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

**Swagger:**
- Endpoint: `/api/docs`
- Interactive documentation
- OpenAPI 3.0 specification
- JSON export: `/api/docs-json`
- YAML export: `/api/docs-yaml`

**Security:**
- API Key Guard implemented
- POST /dados protected
- GET endpoints public
- Header: X-API-Key
- Configured via environment variable

## API Documentation

### Swagger UI

Access the interactive API documentation at:

**URL:** `http://localhost:3000/api/docs`

**Features:**
- Complete endpoint listing
- Request/response schemas
- Interactive testing
- Example payloads
- HTTP status codes documentation

**Tags:**
- `sensor`: Sensor data endpoints
- `weather`: Weather data endpoints (future)
- `forecast`: Forecast endpoints (future)

### Documentation Details

**API Information:**
- Title: ClimaSense API
- Description: API para sistema de monitoramento climático com sensores IoT
- Version: 1.0

**Authentication (Future):**
- Type: API Key
- Header: X-API-Key
- Location: header

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

**Swagger Documentation:**
- ✅ Request body schema
- ✅ Response schemas (201, 400, 500)
- ✅ Field validations
- ✅ Examples
- ✅ Descriptions

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

**Swagger Documentation:**
- ✅ Query parameters
- ✅ Response schema
- ✅ Examples
- ✅ Descriptions

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

**Swagger Documentation:**
- ✅ Query parameters
- ✅ Response schemas (200, 400, 500)
- ✅ Examples
- ✅ Descriptions

### GET /previsao
Get weather forecast for a location.

**Query Params:**
- `latitude` (required): Latitude (-90 to 90)
- `longitude` (required): Longitude (-180 to 180)
- `days` (optional): Number of forecast days (1-16, default: 7)

**Response (200):**
```json
{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "timezone": "America/Sao_Paulo",
  "daily": [
    {
      "date": "2026-05-06",
      "temperatureMax": 28.5,
      "temperatureMin": 18.2,
      "precipitation": 2.5,
      "windSpeed": 15.3,
      "weatherCode": 3
    }
  ]
}
```

**Swagger Documentation:**
- ✅ Query parameters with validation
- ✅ Response schema
- ✅ Examples
- ✅ Error responses (400, 502)

## Testing

### Interactive Testing (Swagger UI)

1. Access: `http://localhost:3000/api/docs`
2. Expand endpoint
3. Click "Try it out"
4. Fill in data
5. Click "Execute"
6. View response

### Manual Testing

See `TEST_EXAMPLES.md` for:
- cURL commands
- PowerShell scripts
- Postman collection
- Load testing scripts
- Validation testing

### Export Documentation

- **JSON**: `http://localhost:3000/api/docs-json`
- **YAML**: `http://localhost:3000/api/docs-yaml`

## Development

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Build
npm run build
```

### Accessing Services

- **API**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/api/docs`
- **InfluxDB UI**: `http://localhost:8086`

## Next Steps

- [x] Configure InfluxDB ✅
- [x] Implement Sensor endpoints ✅
- [x] Add validations ✅
- [x] Add Swagger documentation ✅
- [x] Implement API Key Guard ✅
- [x] Implement Forecast module ✅
- [ ] Add error handling middleware
- [ ] Add request logging
- [ ] Add rate limiting
- [ ] Document Weather endpoints
- [ ] Implement Weather module
