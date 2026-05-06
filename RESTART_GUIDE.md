# Guia de Reinicialização - ClimaSense

## Problema Resolvido

Foram feitas correções no backend para resolver o erro "Failed to fetch latest reading":

1. **InfluxDB Query**: Corrigida a query do método `getLatestData` para usar `sort` e `limit` ao invés de `last()`
2. **Range de Busca**: Aumentado de 1 hora para 7 dias para garantir que dados antigos sejam encontrados
3. **Frontend**: Melhorado o tratamento de respostas vazias

## Como Reiniciar

### 1. Parar o Backend

No terminal onde o backend está rodando, pressione:
```
Ctrl + C
```

### 2. Reiniciar o Backend

```bash
cd backend
npm run start:dev
```

Aguarde a mensagem:
```
[NestApplication] Nest application successfully started
```

### 3. Verificar se está funcionando

Teste o endpoint:
```bash
curl "http://localhost:21165/dados/latest?deviceId=esp32_01"
```

Deve retornar algo como:
```json
{
  "deviceId": "esp32_01",
  "temperatura": 28.8,
  "umidade": 58.2,
  "timestamp": "2026-05-06T18:15:00Z"
}
```

### 4. Atualizar o Frontend

No navegador, acesse:
```
http://localhost:3001
```

Pressione `Ctrl + Shift + R` para fazer um hard refresh (limpar cache)

## Se ainda houver erro

### Enviar novos dados de teste

```bash
# PowerShell
.\send-test-data.ps1

# Bash
bash send-test-data.sh
```

### Verificar logs do backend

No terminal do backend, procure por mensagens de erro como:
```
[InfluxService] Query error: ...
[SensorService] Error fetching latest reading: ...
```

### Verificar console do navegador

1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Procure por erros em vermelho
4. Vá para a aba Network
5. Procure pela requisição para `/dados/latest`
6. Verifique o status code e a resposta

## Estrutura de Portas

- **Backend**: http://localhost:21165
- **Frontend**: http://localhost:3001
- **InfluxDB**: http://localhost:8086
- **Swagger**: http://localhost:21165/api/docs

## Comandos Úteis

### Verificar se as portas estão em uso

```bash
# Windows
netstat -ano | findstr "21165"
netstat -ano | findstr "3001"
netstat -ano | findstr "8086"

# Linux/Mac
lsof -i :21165
lsof -i :3001
lsof -i :8086
```

### Testar endpoints

```bash
# Dados históricos
curl "http://localhost:21165/dados?deviceId=esp32_01"

# Última leitura
curl "http://localhost:21165/dados/latest?deviceId=esp32_01"

# Previsão do tempo
curl "http://localhost:21165/previsao?latitude=-23.5505&longitude=-46.6333"
```

## Troubleshooting

### Backend não inicia

1. Verifique se a porta 21165 está livre
2. Verifique se o arquivo `.env` existe em `backend/`
3. Verifique se as dependências estão instaladas: `npm install`

### Frontend não conecta ao backend

1. Verifique se o backend está rodando
2. Verifique o arquivo `frontend/.env.local`
3. Deve conter: `NEXT_PUBLIC_API_URL=http://localhost:21165`
4. Reinicie o frontend: `npm run dev`

### InfluxDB não está acessível

1. Verifique se o container está rodando: `docker ps`
2. Inicie o InfluxDB: `start-influxdb.bat` (Windows) ou `bash start-influxdb.sh` (Linux/Mac)
3. Verifique as credenciais no arquivo `backend/.env`

---

**Após reiniciar o backend, o erro deve estar resolvido!**
