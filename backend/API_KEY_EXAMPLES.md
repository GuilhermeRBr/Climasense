# API Key Authentication Examples

Este documento contém exemplos de como usar a autenticação via API Key.

## Configuração

A API Key está configurada no arquivo `.env`:

```env
API_KEY=dev-api-key-change-in-production
```

**IMPORTANTE**: Altere este valor em produção para uma chave segura.

## Endpoints Protegidos

### POST /dados
Requer API Key no header `X-API-Key`

### GET /dados
Público (não requer API Key)

### GET /dados/latest
Público (não requer API Key)

## Exemplos de Uso

### cURL - Com API Key (Sucesso)

```bash
curl -X POST http://localhost:21165/dados \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-change-in-production" \
  -d '{
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00.000Z"
  }'
```

**Resposta esperada (201 Created):**
```json
{
  "message": "Data received and stored successfully",
  "data": {
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00.000Z"
  }
}
```

### cURL - Sem API Key (Erro)

```bash
curl -X POST http://localhost:21165/dados \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00.000Z"
  }'
```

**Resposta esperada (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "API Key is required",
  "error": "Unauthorized"
}
```

### cURL - API Key Inválida (Erro)

```bash
curl -X POST http://localhost:21165/dados \
  -H "Content-Type: application/json" \
  -H "X-API-Key: wrong-key" \
  -d '{
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": "2026-05-06T10:30:00.000Z"
  }'
```

**Resposta esperada (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid API Key",
  "error": "Unauthorized"
}
```

### PowerShell - Com API Key

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "X-API-Key" = "dev-api-key-change-in-production"
}

$body = @{
    deviceId = "esp32_01"
    temperatura = 25.5
    umidade = 60.2
    timestamp = "2026-05-06T10:30:00.000Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:21165/dados" `
  -Method Post `
  -Headers $headers `
  -Body $body
```

### PowerShell - Sem API Key (Erro)

```powershell
$body = @{
    deviceId = "esp32_01"
    temperatura = 25.5
    umidade = 60.2
    timestamp = "2026-05-06T10:30:00.000Z"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:21165/dados" `
      -Method Post `
      -ContentType "application/json" `
      -Body $body
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    $_.Exception.Response
}
```

## Swagger UI

### Testando com API Key no Swagger

1. Acesse: `http://localhost:21165/api/docs`
2. Clique no botão **"Authorize"** no topo da página
3. No campo **"api-key (apiKey)"**, insira: `dev-api-key-change-in-production`
4. Clique em **"Authorize"**
5. Clique em **"Close"**
6. Agora você pode testar o endpoint `POST /dados`

### Testando sem Autorização

1. Se estiver autorizado, clique em **"Authorize"** e depois em **"Logout"**
2. Tente executar `POST /dados`
3. Você receberá erro 401 Unauthorized

## Integração ESP32

### Arduino/ESP32 Code

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* serverUrl = "http://your-server:21165/dados";
const char* apiKey = "dev-api-key-change-in-production";

void sendSensorData(float temp, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-API-Key", apiKey);
    
    StaticJsonDocument<200> doc;
    doc["deviceId"] = "esp32_01";
    doc["temperatura"] = temp;
    doc["umidade"] = humidity;
    doc["timestamp"] = getISOTimestamp();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode == 201) {
      Serial.println("Data sent successfully");
    } else if (httpResponseCode == 401) {
      Serial.println("Authentication failed - Check API Key");
    } else {
      Serial.printf("Error: %d\n", httpResponseCode);
    }
    
    http.end();
  }
}
```

## Python Script

### Com API Key

```python
import requests
from datetime import datetime

url = "http://localhost:21165/dados"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "dev-api-key-change-in-production"
}

data = {
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": datetime.utcnow().isoformat() + "Z"
}

response = requests.post(url, json=data, headers=headers)

if response.status_code == 201:
    print("Success:", response.json())
elif response.status_code == 401:
    print("Authentication failed:", response.json())
else:
    print("Error:", response.status_code, response.text)
```

### Sem API Key (Erro)

```python
import requests
from datetime import datetime

url = "http://localhost:21165/dados"
headers = {
    "Content-Type": "application/json"
}

data = {
    "deviceId": "esp32_01",
    "temperatura": 25.5,
    "umidade": 60.2,
    "timestamp": datetime.utcnow().isoformat() + "Z"
}

response = requests.post(url, json=data, headers=headers)
print("Status:", response.status_code)
print("Response:", response.json())
```

## JavaScript/Node.js

### Com API Key

```javascript
const axios = require('axios');

const sendData = async () => {
  try {
    const response = await axios.post('http://localhost:21165/dados', {
      deviceId: 'esp32_01',
      temperatura: 25.5,
      umidade: 60.2,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'dev-api-key-change-in-production'
      }
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Authentication failed:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

sendData();
```

## Postman

### Configurar API Key

1. Abra a requisição `POST /dados`
2. Vá para a aba **"Headers"**
3. Adicione um novo header:
   - **Key**: `X-API-Key`
   - **Value**: `dev-api-key-change-in-production`
4. Execute a requisição

### Variável de Ambiente no Postman

1. Crie uma variável de ambiente chamada `api_key`
2. Valor: `dev-api-key-change-in-production`
3. No header, use: `{{api_key}}`

## Segurança

### Boas Práticas

1. **Nunca commite a API Key** no código
2. **Use variáveis de ambiente** (.env)
3. **Gere chaves fortes** em produção
4. **Rotacione as chaves** periodicamente
5. **Use HTTPS** em produção
6. **Monitore tentativas** de acesso não autorizado

### Gerando API Key Segura

#### Node.js
```javascript
const crypto = require('crypto');
const apiKey = crypto.randomBytes(32).toString('hex');
console.log(apiKey);
```

#### Python
```python
import secrets
api_key = secrets.token_hex(32)
print(api_key)
```

#### Bash
```bash
openssl rand -hex 32
```

## Troubleshooting

### Erro: "API Key is required"

**Causa**: Header `X-API-Key` não foi enviado

**Solução**: Adicione o header na requisição

### Erro: "Invalid API Key"

**Causa**: API Key enviada não corresponde à configurada no `.env`

**Solução**: Verifique o valor no `.env` e use a mesma chave

### Erro: "Cannot read properties of undefined"

**Causa**: Variável `API_KEY` não está definida no `.env`

**Solução**: Adicione `API_KEY=sua-chave` no arquivo `.env`

### Endpoints GET retornam 401

**Causa**: Guard aplicado incorretamente

**Solução**: Verifique se o decorator `@Public()` está presente nos métodos GET

## Logs

Quando a autenticação é bem-sucedida, você verá no console:

```
[ApiKeyGuard] API Key validated successfully
[SensorController] Received data from device: esp32_01
```

Quando falha:

```
[ApiKeyGuard] API Key missing in request
```

ou

```
[ApiKeyGuard] Invalid API Key provided
```

## Próximos Passos

- [ ] Implementar rate limiting por API Key
- [ ] Adicionar múltiplas API Keys
- [ ] Implementar expiração de chaves
- [ ] Adicionar logs de auditoria
- [ ] Implementar revogação de chaves
