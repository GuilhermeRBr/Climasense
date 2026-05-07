# ClimaSense Backend - Quick Start

## 1. Iniciar o Backend

```bash
cd backend
npm run start:dev
```

O backend deve iniciar na porta **21165**.

Você verá:
```
Application is running on: http://localhost:21165
Swagger documentation available at: http://localhost:21165/api/docs
```

---

## 2. Testar a API

### Verificar se está rodando:
```bash
curl http://localhost:21165/dados/latest?deviceId=esp32_01
```

### Acessar documentação Swagger:
```
http://localhost:21165/api/docs
```

---

## 3. Enviar Dados Mock

### Enviar 1 leitura:
```bash
npm run mock:send
```

### Gerar 24 horas de histórico:
```bash
npm run mock:historical
```

### Modo contínuo (a cada 30s):
```bash
npm run mock:continuous
```

---

## 4. Verificar Dados no InfluxDB

1. Acesse: https://cloud2.influxdata.com/
2. Login com suas credenciais
3. Navegue até: Data Explorer
4. Bucket: `climasense`
5. Measurement: `clima`

---

## 5. Configuração

### Arquivo .env:
```env
# InfluxDB
INFLUXDB_URL=https://us-east-1-1.aws.cloud2.influxdata.com
INFLUXDB_TOKEN=seu_token_aqui
INFLUXDB_ORG=GRapps
INFLUXDB_BUCKET=climasense

# API
API_KEY=dev-api-key-change-in-production
PORT=21165
```

---

## 6. Troubleshooting

### Backend não inicia na porta 21165:
- Verifique se o arquivo `.env` existe
- Reinicie o backend: `Ctrl+C` e `npm run start:dev`

### Mock retorna erro 401:
- Verifique se a API_KEY no `.env` é: `dev-api-key-change-in-production`
- Verifique se o backend está rodando

### Mock retorna erro de conexão:
- Verifique se o backend está rodando na porta 21165
- Teste: `curl http://localhost:21165/dados/latest?deviceId=esp32_01`

### Dados não aparecem no InfluxDB:
- Verifique se o INFLUXDB_URL não tem barra no final
- Verifique se o token está correto
- Verifique os logs do backend

---

## 7. Endpoints Disponíveis

### POST /dados (protegido)
Enviar dados dos sensores
- Header: `X-API-Key: dev-api-key-change-in-production`

### GET /dados (público)
Consultar histórico
- Query: `?deviceId=esp32_01&range=-24h`

### GET /dados/latest (público)
Última leitura
- Query: `?deviceId=esp32_01`

### GET /previsao (público)
Previsão do tempo
- Query: `?latitude=-23.5505&longitude=-46.6333&days=7`

---

## 8. Próximos Passos

1. ✅ Backend rodando
2. ✅ Dados mock sendo enviados
3. ✅ Dados salvos no InfluxDB
4. ⏭️ Iniciar frontend: `cd frontend && npm run dev`
5. ⏭️ Conectar ESP32 real (usar mesmo endpoint POST /dados)
