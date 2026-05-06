# ClimaSense Backend

API RESTful para sistema de monitoramento climático com sensores IoT.

## Visão Geral

Backend desenvolvido com NestJS que recebe dados de sensores ESP32, armazena em banco de dados time-series (InfluxDB) e disponibiliza endpoints para consulta e visualização.

## Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Linguagem com tipagem estática
- **InfluxDB** - Banco de dados time-series
- **Swagger** - Documentação interativa da API
- **class-validator** - Validação de dados
- **Docker** - Containerização do InfluxDB

## Início Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar InfluxDB

```bash
# Windows
start-influxdb.bat

# Linux/Mac
bash start-influxdb.sh
```

### 3. Iniciar o backend

```bash
npm run start:dev
```

### 4. Acessar documentação

Abra o navegador em: `http://localhost:3000/api/docs`

## Documentação

### Guias Principais

- **[README.md](README.md)** - Este arquivo
- **[STRUCTURE.md](STRUCTURE.md)** - Estrutura do projeto e arquitetura
- **[SECURITY.md](SECURITY.md)** - Implementação de segurança e API Key
- **[API_KEY_EXAMPLES.md](API_KEY_EXAMPLES.md)** - Exemplos de uso com API Key

### Documentação dos Módulos

- **[src/sensor/README.md](src/sensor/README.md)** - Módulo de sensores
- **[src/influx/README.md](src/influx/README.md)** - Módulo InfluxDB
- **[src/sensor/dto/README.md](src/sensor/dto/README.md)** - DTOs e validações

## Endpoints Disponíveis

### POST /dados (Protegido)
Receber dados dos sensores

**Autenticação**: API Key obrigatória (header `X-API-Key`)

**Request:**
```json
{
  "deviceId": "esp32_01",
  "temperatura": 25.5,
  "umidade": 60.2,
  "timestamp": "2026-05-06T10:30:00.000Z"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/dados \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-change-in-production" \
  -d '{"deviceId":"esp32_01","temperatura":25.5,"umidade":60.2,"timestamp":"2026-05-06T10:30:00.000Z"}'
```

### GET /dados (Público)
Consultar dados históricos

**Query params:**
- `deviceId` (opcional): Filtrar por dispositivo
- `range` (opcional): Período (padrão: -24h)

### GET /dados/latest (Público)
Obter última leitura de um dispositivo

**Query params:**
- `deviceId` (obrigatório): Identificador do dispositivo

### GET /previsao (Público)
Obter previsão do tempo

**Query params:**
- `latitude` (obrigatório): Latitude da localização (-90 a 90)
- `longitude` (obrigatório): Longitude da localização (-180 a 180)
- `days` (opcional): Número de dias de previsão (1 a 16, padrão: 7)

**Exemplo:**
```bash
curl "http://localhost:3000/previsao?latitude=-23.5505&longitude=-46.6333&days=7"
```

## Swagger UI

Documentação interativa disponível em:

**URL:** `http://localhost:3000/api/docs`

**Recursos:**
- Teste interativo de endpoints
- Schemas de dados
- Exemplos de requests/responses
- Códigos de status HTTP
- Validações documentadas

## Arquitetura

```
Controller → Service → Provider (InfluxDB)
```

### Módulos Implementados

- ✅ **Sensor** - Recepção e consulta de dados
- ✅ **Influx** - Integração com InfluxDB
- ✅ **Swagger** - Documentação interativa
- ✅ **Forecast** - Previsão do tempo (Open-Meteo)
- ⏳ **Weather** - Dados climáticos (futuro)

## Configuração

### Variáveis de Ambiente (.env)

```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=dev-token-change-in-production
INFLUXDB_ORG=climasense
INFLUXDB_BUCKET=sensor-data
API_KEY=dev-api-key-change-in-production
PORT=3000
```

## Scripts Disponíveis

```bash
# Desenvolvimento (hot-reload)
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Lint
npm run lint

# Format
npm run format

# Tests
npm run test
```

## Estrutura de Pastas

```
backend/
├── src/
│   ├── sensor/          # Módulo de sensores
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── sensor.controller.ts
│   │   ├── sensor.service.ts
│   │   └── sensor.module.ts
│   ├── influx/          # Módulo InfluxDB
│   │   ├── influx.service.ts
│   │   └── influx.module.ts
│   ├── weather/         # Módulo weather (futuro)
│   ├── forecast/        # Módulo forecast (futuro)
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env
├── QUICK_START.md
├── SWAGGER_DOCUMENTATION.md
└── STRUCTURE.md
```

## Validações

Todas as requisições são validadas automaticamente:

- **deviceId**: string obrigatória
- **temperatura**: número obrigatório (-50 a 100°C)
- **umidade**: número obrigatório (0 a 100%)
- **timestamp**: string ISO 8601 obrigatória

## Testes

### Teste Rápido com cURL

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

### Teste com Swagger UI

1. Acesse: `http://localhost:3000/api/docs`
2. Expanda `POST /dados`
3. Clique em "Try it out"
4. Edite o JSON e clique em "Execute"

## Recursos

- **API**: `http://localhost:3000`
- **Swagger**: `http://localhost:3000/api/docs`
- **OpenAPI JSON**: `http://localhost:3000/api/docs-json`
- **InfluxDB UI**: `http://localhost:8086`

## Status do Projeto

### Implementado ✅

- [x] Estrutura modular NestJS
- [x] Integração com InfluxDB
- [x] Endpoints de sensores (POST, GET)
- [x] Validação de dados com DTOs
- [x] Documentação Swagger completa
- [x] CORS habilitado
- [x] Logging implementado
- [x] Error handling
- [x] API Key Guard (proteção de endpoints)
- [x] Integração com Open-Meteo API

### Próximas Etapas ⏳

- [ ] API Key Guard
- [ ] Módulo Forecast (Open-Meteo)
- [ ] Módulo Weather
- [ ] Rate limiting
- [ ] Request logging middleware
- [ ] Testes unitários
- [ ] Testes E2E

## Troubleshooting

### Backend não inicia

Verifique se a porta 3000 está disponível ou altere no `.env`

### InfluxDB connection error

Verifique se o InfluxDB está rodando:
```bash
docker ps | grep climasense-influxdb
```

### Swagger não carrega

Limpe o cache do navegador e acesse: `http://localhost:3000/api/docs`

## Suporte

Para mais detalhes, consulte a documentação completa:

- [QUICK_START.md](QUICK_START.md) - Guia de início
- [SWAGGER_DOCUMENTATION.md](SWAGGER_DOCUMENTATION.md) - Swagger
- [STRUCTURE.md](STRUCTURE.md) - Arquitetura

## Licença

Este projeto está em desenvolvimento.

---

**Desenvolvido com NestJS, TypeScript e boas práticas de Clean Code**
