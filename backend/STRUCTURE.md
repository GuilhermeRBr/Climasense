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
│   ├── forecast/        # Weather forecast module (Open-Meteo)
│   ├── influx/          # InfluxDB integration module ✅
│   │   ├── influx.module.ts
│   │   ├── influx.service.ts
│   │   └── README.md
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

**Status:** Implemented with Swagger documentation

**Endpoints:**
- `POST /dados` - Receive sensor data
- `GET /dados` - Get historical data
- `GET /dados/latest` - Get latest reading

**Features:**
- DTO validation with class-validator
- Integration with InfluxService
- Error handling and logging
- Query filters (deviceId, time range)
- **Swagger documentation** ✅
- **Interactive API testing** ✅

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

**Swagger:**
- Endpoint: `/api/docs`
- Interactive documentation
- OpenAPI 3.0 specification
- JSON export: `/api/docs-json`
- YAML export: `/api/docs-yaml`

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
- [ ] Implement API Key Guard
- [ ] Implement Forecast module
- [ ] Add error handling middleware
- [ ] Add request logging
- [ ] Add rate limiting
- [ ] Document Weather endpoints
- [ ] Document Forecast endpoints
