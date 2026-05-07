# ClimaSense API Endpoints

## Base URL
```
http://localhost:21165
```

## Authentication
POST endpoints require API Key authentication via header:
```
X-API-Key: climasense-dev-key-2024
```

---

## Endpoints

### 1. POST /dados
Receive and store sensor data from ESP32 or mock devices.

**Authentication:** Required (API Key)

**Request Body:**
```json
{
  "deviceId": "esp32_01",
  "temperatura": 25.5,
  "umidade": 60.2,
  "pressao": 1013.25,
  "velocidadeVento": 12.5,
  "direcaoVento": 180,
  "chuva": 2.5,
  "luminosidade": 75.0,
  "timestamp": "2026-05-06T10:30:00.000Z"
}
```

**Required Fields:**
- `deviceId` (string)
- `temperatura` (number, -50 to 100)
- `umidade` (number, 0 to 100)
- `timestamp` (ISO 8601 string)

**Optional Fields:**
- `pressao` (number, 800 to 1200 hPa)
- `velocidadeVento` (number, 0 to 200 km/h)
- `direcaoVento` (number, 0 to 360 degrees)
- `chuva` (number, 0 to 500 mm)
- `luminosidade` (number, 0 to 100%)

**Response (201):**
```json
{
  "message": "Data received and stored successfully",
  "data": { ... }
}
```

---

### 2. GET /dados
Query historical sensor data.

**Authentication:** Public

**Query Parameters:**
- `deviceId` (optional): Filter by device ID
- `range` (optional): Time range (default: `-24h`)
  - Examples: `-1h`, `-24h`, `-7d`, `-30d`

**Response (200):**
```json
[
  {
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "pressao": 1013.25,
    "velocidadeVento": 12.5,
    "direcaoVento": 180,
    "chuva": 2.5,
    "luminosidade": 75.0,
    "timestamp": "2026-05-06T10:30:00.000Z"
  }
]
```

---

### 3. GET /dados/latest
Get the latest reading from a specific device.

**Authentication:** Public

**Query Parameters:**
- `deviceId` (required): Device identifier

**Response (200):**
```json
{
  "deviceId": "esp32_01",
  "temperatura": 25.5,
  "umidade": 60.2,
  "pressao": 1013.25,
  "velocidadeVento": 12.5,
  "direcaoVento": 180,
  "chuva": 2.5,
  "luminosidade": 75.0,
  "timestamp": "2026-05-06T10:30:00.000Z"
}
```

---

### 4. GET /previsao
Get weather forecast from Open-Meteo.

**Authentication:** Public

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `days` (optional): Number of forecast days (default: 7)

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

---

## Mock Data Scripts

### Send single mock data point
```bash
npm run mock:send
```

### Generate 24 hours of historical data
```bash
npm run mock:historical
```

### Start continuous mock data generation (every 30s)
```bash
npm run mock:continuous
```

---

## InfluxDB Structure

**Measurement:** `clima`

**Tags:**
- `deviceId`: Device identifier

**Fields:**
- `temperatura`: Temperature (°C)
- `umidade`: Humidity (%)
- `pressao`: Atmospheric pressure (hPa)
- `velocidade_vento`: Wind speed (km/h)
- `direcao_vento`: Wind direction (degrees)
- `chuva`: Rainfall (mm)
- `luminosidade`: Luminosity (%)

**Timestamp:** Automatic

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["deviceId should not be empty"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "API Key is required",
  "error": "Unauthorized"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```
