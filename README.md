# ClimaSense - Sistema de Monitoramento Climático

Sistema completo de monitoramento climático em tempo real utilizando sensores IoT, armazenamento de séries temporais e dashboard web interativo.

## Sobre o Projeto

O **ClimaSense** é uma solução integrada para coleta, armazenamento e visualização de dados climáticos. O sistema permite o monitoramento contínuo de temperatura e umidade através de dispositivos ESP32, armazenando os dados em um banco de dados otimizado para séries temporais (InfluxDB) e apresentando as informações em um dashboard web moderno e responsivo.

Além dos dados coletados pelos sensores, o sistema também integra previsões meteorológicas através da API Open-Meteo, proporcionando uma visão completa das condições climáticas atuais e futuras.

## Funcionalidades

- **Coleta de Dados em Tempo Real**: Recepção de dados de temperatura e umidade de dispositivos ESP32
- **Armazenamento Time-Series**: Utilização do InfluxDB para armazenamento eficiente de dados temporais
- **Dashboard Interativo**: Visualização em tempo real dos dados coletados
- **Gráficos Históricos**: Análise de tendências através de gráficos de séries temporais
- **Previsão do Tempo**: Integração com API externa para previsões meteorológicas
- **API RESTful**: Backend robusto com endpoints documentados
- **Segurança**: Proteção de endpoints através de API Key

## Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js progressivo para construção de aplicações server-side eficientes e escaláveis
- **TypeScript** - Superset JavaScript com tipagem estática
- **InfluxDB** - Banco de dados otimizado para séries temporais

### Frontend
- **Next.js** - Framework React para produção
- **TypeScript** - Desenvolvimento type-safe
- **CSS Modules** - Estilização modular e isolada

### Integrações
- **Open-Meteo API** - Dados meteorológicos e previsões
- **ESP32** - Dispositivos IoT para coleta de dados

## Arquitetura

O projeto segue uma arquitetura modular e escalável:

- **Backend**: API RESTful construída com NestJS seguindo os princípios de Clean Code
- **Frontend**: Aplicação web desenvolvida em Next.js com componentes reutilizáveis
- **Banco de Dados**: InfluxDB para armazenamento eficiente de dados temporais
- **IoT**: Dispositivos ESP32 para coleta de dados ambientais

## Fluxo de Dados

```
ESP32 → Backend (NestJS) → InfluxDB → Frontend (Next.js)
                ↓
         Open-Meteo API
```

## Status do Projeto

**Em desenvolvimento ativo**

O projeto está sendo desenvolvido de forma incremental, seguindo boas práticas de engenharia de software e arquitetura modular.

## Como Executar

### Passo 1: Configurar InfluxDB Cloud

O projeto usa **InfluxDB Cloud**. As credenciais já estão configuradas em `backend/.env`.

### Passo 2: Iniciar Backend

```bash
cd backend
npm install
npm run start:dev
```

Acesse a documentação da API: `http://localhost:21165/api/docs`

### Passo 3: Gerar Dados Mockados (Recomendado)

Em um **novo terminal**, execute o gerador de dados mockados:

**Windows:**
```powershell
.\mock-data-generator.ps1
```

**Linux/Mac:**
```bash
chmod +x mock-data-generator.sh
./mock-data-generator.sh
```

O gerador enviará dados automaticamente a cada 10 segundos enquanto estiver rodando.

**Ou envie 10 leituras de uma vez:**
```powershell
.\send-test-data.ps1
```

### Passo 4: Iniciar Frontend

Em um **terceiro terminal**:

```bash
cd frontend
npm install
npm run dev
```

Acesse a aplicação: `http://localhost:3001`

### Passo 5: Verificar

- **Dashboard**: http://localhost:3001 - Dados de temperatura e umidade
- **Previsão**: http://localhost:3001/previsao - Previsão do tempo
- **API Swagger**: http://localhost:21165/api/docs - Documentação interativa
- **InfluxDB Cloud**: https://cloud2.influxdata.com - Visualizar dados no banco

## Gerador de Dados Mockados

Para simular sensores IoT continuamente, use o gerador de dados mockados:

```powershell
# Intervalo padrão (10 segundos)
.\mock-data-generator.ps1

# Intervalo personalizado (5 segundos)
.\mock-data-generator.ps1 -IntervalSeconds 5

# Device ID personalizado
.\mock-data-generator.ps1 -DeviceId "esp32_02"
```

Ver `MOCK_DATA_GUIDE.md` para guia completo.

## Troubleshooting

Se o dashboard mostrar "Carregando dados..." mas não carregar:

1. **Envie dados de teste**: `powershell -ExecutionPolicy Bypass -File send-test-data.ps1`
2. **Reinicie o frontend**: Pare (Ctrl+C) e inicie novamente com `npm run dev`
3. **Atualize o navegador**: Ctrl+Shift+R (hard refresh)

Ver `QUICK_FIX.md` para solução rápida ou `TROUBLESHOOTING.md` para guia completo.

## Documentação

- **Backend**: Ver `backend/README.md`
- **Frontend**: Ver `frontend/README.md`
- **API**: `http://localhost:21165/api/docs` (Swagger)

## Licença

Este projeto está em desenvolvimento.

---

**Desenvolvido com foco em Clean Code, arquitetura modular e boas práticas de desenvolvimento**
