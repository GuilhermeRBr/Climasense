# Security Implementation

Este documento descreve a implementação de segurança do backend ClimaSense.

## API Key Authentication

### Visão Geral

O sistema utiliza autenticação via API Key para proteger endpoints sensíveis. A API Key deve ser enviada no header `X-API-Key` de cada requisição protegida.

### Implementação

#### ApiKeyGuard

Localização: `src/common/guards/api-key.guard.ts`

O guard verifica:
1. Se o endpoint é público (decorator @Public())
2. Se o header X-API-Key está presente
3. Se a API Key é válida

```typescript
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Verifica se é público
    // Valida API Key
    // Retorna true/false
  }
}
```

#### Public Decorator

Localização: `src/common/decorators/public.decorator.ts`

Permite marcar endpoints como públicos:

```typescript
@Get()
@Public()
async getPublicData() {
  // Não requer API Key
}
```

### Endpoints Protegidos

#### POST /dados
- **Proteção**: API Key obrigatória
- **Motivo**: Prevenir envio não autorizado de dados
- **Header**: `X-API-Key: sua-api-key`

### Endpoints Públicos

#### GET /dados
- **Proteção**: Nenhuma
- **Motivo**: Permitir consulta de dados históricos

#### GET /dados/latest
- **Proteção**: Nenhuma
- **Motivo**: Permitir consulta da última leitura

## Configuração

### Variável de Ambiente

```env
API_KEY=dev-api-key-change-in-production
```

**IMPORTANTE**: 
- Altere este valor em produção
- Use uma chave forte e aleatória
- Nunca commite a chave no código

### Gerando API Key Segura

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"
```

## Uso

### cURL

```bash
curl -X POST http://localhost:21165/dados \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua-api-key" \
  -d '{"deviceId":"esp32_01","temperatura":25.5,"umidade":60.2,"timestamp":"2026-05-06T10:30:00.000Z"}'
```

### Swagger UI

1. Clique em "Authorize"
2. Insira a API Key
3. Clique em "Authorize"
4. Teste os endpoints protegidos

### ESP32

```cpp
http.addHeader("X-API-Key", "sua-api-key");
```

## Respostas de Erro

### 401 Unauthorized - API Key Ausente

```json
{
  "statusCode": 401,
  "message": "API Key is required",
  "error": "Unauthorized"
}
```

### 401 Unauthorized - API Key Inválida

```json
{
  "statusCode": 401,
  "message": "Invalid API Key",
  "error": "Unauthorized"
}
```

## Logs

### Sucesso

```
[ApiKeyGuard] API Key validated successfully
```

### Falha - API Key Ausente

```
[ApiKeyGuard] API Key missing in request
```

### Falha - API Key Inválida

```
[ApiKeyGuard] Invalid API Key provided
```

## Boas Práticas

### Desenvolvimento

1. Use API Key simples para facilitar testes
2. Documente a API Key no README
3. Inclua exemplos com API Key

### Produção

1. **Gere chave forte**: Mínimo 32 bytes aleatórios
2. **Use HTTPS**: Nunca envie API Key em HTTP
3. **Rotacione chaves**: Periodicamente
4. **Monitore acessos**: Log de tentativas falhadas
5. **Rate limiting**: Limite requisições por chave
6. **Múltiplas chaves**: Uma por dispositivo/cliente
7. **Revogação**: Capacidade de invalidar chaves

## Limitações Atuais

1. **Chave única**: Todos os dispositivos usam a mesma chave
2. **Sem expiração**: Chaves não expiram automaticamente
3. **Sem rate limiting**: Sem limite de requisições
4. **Sem auditoria**: Logs básicos apenas
5. **Sem revogação**: Não há sistema de revogação

## Melhorias Futuras

### Curto Prazo

- [ ] Rate limiting por API Key
- [ ] Logs de auditoria detalhados
- [ ] Múltiplas API Keys

### Médio Prazo

- [ ] Expiração de chaves
- [ ] Sistema de revogação
- [ ] Dashboard de monitoramento
- [ ] Alertas de uso suspeito

### Longo Prazo

- [ ] OAuth 2.0
- [ ] JWT tokens
- [ ] Autenticação de usuários
- [ ] Permissões granulares

## Testes

### Teste 1: Requisição com API Key válida

```bash
curl -X POST http://localhost:21165/dados \
  -H "X-API-Key: dev-api-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test","temperatura":25,"umidade":60,"timestamp":"2026-05-06T10:00:00.000Z"}'
```

**Esperado**: 201 Created

### Teste 2: Requisição sem API Key

```bash
curl -X POST http://localhost:21165/dados \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test","temperatura":25,"umidade":60,"timestamp":"2026-05-06T10:00:00.000Z"}'
```

**Esperado**: 401 Unauthorized

### Teste 3: Requisição com API Key inválida

```bash
curl -X POST http://localhost:21165/dados \
  -H "X-API-Key: wrong-key" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test","temperatura":25,"umidade":60,"timestamp":"2026-05-06T10:00:00.000Z"}'
```

**Esperado**: 401 Unauthorized

### Teste 4: Endpoint público (GET)

```bash
curl http://localhost:21165/dados
```

**Esperado**: 200 OK (sem API Key necessária)

## Troubleshooting

### Problema: Sempre retorna 401

**Causa**: API Key no .env diferente da enviada

**Solução**: Verifique o valor em `.env` e use a mesma chave

### Problema: Endpoints GET retornam 401

**Causa**: Decorator @Public() ausente

**Solução**: Adicione @Public() nos métodos GET

### Problema: Guard não é executado

**Causa**: @UseGuards() não aplicado no controller

**Solução**: Adicione @UseGuards(ApiKeyGuard) no controller

## Referências

- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [API Key Best Practices](https://cloud.google.com/endpoints/docs/openapi/when-why-api-key)
