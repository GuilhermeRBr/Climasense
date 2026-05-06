# Sensor Module

Module responsible for receiving and managing sensor data from ESP32/Mock devices.

## Endpoints

### POST /dados
Receive sensor data from devices.

**Request Body:**
```json
{
  "deviceId": "esp32_01",
  "temperatura": 25.5,
  "umidade": 60.2,
  "timestamp": "2026-05-06T10:30:00Z"
}
```

**Validation Rules:**
- `deviceId`: Required, must be a non-empty string
- `temperatura`: Required, must be a number
- `umidade`: Required, must be a number
- `timestamp`: Required, must be a valid ISO 8601 date string

**Response (201 Created):**
```json
{
  "message": "Data received and stored successfully",
  "data": {
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "deviceId should not be empty",
    "temperatura must be a number"
  ],
  "error": "Bad Request"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/dados \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00Z"
  }'
```

---

### GET /dados
Get historical sensor data.

**Query Parameters:**
- `deviceId` (optional): Filter by specific device
- `range` (optional): Time range (default: `-24h`)
  - Examples: `-1h`, `-24h`, `-7d`, `-30d`

**Response (200 OK):**
```json
[
  {
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00Z"
  },
  {
    "deviceId": "esp32_01",
    "temperatura": 26.0,
    "umidade": 58.5,
    "timestamp": "2026-05-06T10:35:00Z"
  }
]
```

**cURL Examples:**
```bash
# Get all data from last 24 hours
curl http://localhost:3000/dados

# Get data for specific device
curl http://localhost:3000/dados?deviceId=esp32_01

# Get data from last hour
curl http://localhost:3000/dados?range=-1h

# Get data for specific device from last 7 days
curl "http://localhost:3000/dados?deviceId=esp32_01&range=-7d"
```

---

### GET /dados/latest
Get the latest reading for a specific device.

**Query Parameters:**
- `deviceId` (required): Device identifier

**Response (200 OK):**
```json
{
  "deviceId": "esp32_01",
  "temperatura": 25.5,
  "umidade": 60.2,
  "timestamp": "2026-05-06T10:30:00Z"
}
```

**Response when no data found:**
```json
null
```

**cURL Example:**
```bash
curl "http://localhost:3000/dados/latest?deviceId=esp32_01"
```

---

## Architecture

```
Controller → Service → InfluxService → InfluxDB
```

### SensorController
- Handles HTTP requests
- Validates input using DTOs
- Returns HTTP responses

### SensorService
- Contains business logic
- Processes sensor data
- Communicates with InfluxService

### InfluxService
- Writes data to InfluxDB
- Queries historical data
- Manages database connection

---

## Data Flow

1. **Device sends data** → POST /dados
2. **Controller receives** → Validates with DTO
3. **Service processes** → Converts timestamp
4. **InfluxService writes** → Stores in InfluxDB
5. **Response sent** → Confirmation to device

---

## Testing

### Manual Testing with cURL

**1. Send test data:**
```bash
curl -X POST http://localhost:3000/dados \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00.000Z"
  }'
```

**2. Retrieve data:**
```bash
curl http://localhost:3000/dados?deviceId=esp32_01
```

**3. Get latest reading:**
```bash
curl "http://localhost:3000/dados/latest?deviceId=esp32_01"
```

### Testing with Postman

**POST /dados**
- Method: POST
- URL: `http://localhost:3000/dados`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "deviceId": "esp32_01",
  "temperatura": 25.5,
  "umidade": 60.2,
  "timestamp": "2026-05-06T10:30:00.000Z"
}
```

---

## Error Handling

The module handles the following errors:

- **Validation errors**: Returns 400 with detailed validation messages
- **Database errors**: Logs error and returns 500
- **Missing required fields**: Returns 400 with field names

---

## Integration with ESP32

### Arduino/ESP32 Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* serverUrl = "http://your-server:3000/dados";

void sendSensorData(float temp, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    StaticJsonDocument<200> doc;
    doc["deviceId"] = "esp32_01";
    doc["temperatura"] = temp;
    doc["umidade"] = humidity;
    doc["timestamp"] = getISOTimestamp(); // Implement this function
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully");
    } else {
      Serial.println("Error sending data");
    }
    
    http.end();
  }
}
```

---

## Next Steps

- [ ] Add API Key authentication (Step 4)
- [ ] Add rate limiting
- [ ] Add request logging middleware
- [ ] Add data aggregation endpoints
- [ ] Add device management endpoints
