# ClimaSense

Sistema de monitoramento climático em tempo real com interface moderna e imersiva.

## Stack

### Frontend
- Next.js + TypeScript
- CSS puro (separado)
- Framer Motion
- Recharts
- Lucide Icons

### Backend
- NestJS + TypeScript
- InfluxDB
- Open-Meteo API

## Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure NEXT_PUBLIC_API_URL
npm run dev
```

## Acesso

- Frontend: http://localhost:3001
- Backend: http://localhost:21165

## Estrutura

```
climasense/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── sensor/   # Endpoints de sensores
│   │   ├── forecast/ # Previsão meteorológica
│   │   ├── influx/   # Serviço InfluxDB
│   │   └── common/   # Guards e utilidades
│   └── .env
│
├── frontend/         # Next.js App
│   ├── app/          # Páginas
│   ├── components/   # Componentes React
│   ├── services/     # API services
│   ├── styles/       # CSS separado
│   └── .env.local
│
└── docs/             # Documentação
```

## API Endpoints

### Sensor
- `POST /sensor/data` - Receber dados
- `GET /sensor/data` - Dados históricos
- `GET /sensor/latest/:id` - Última leitura

### Forecast
- `GET /forecast` - Previsão meteorológica

## Desenvolvimento

### Backend
```bash
npm run start:dev    # Desenvolvimento
npm run build        # Build
npm run start:prod   # Produção
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build
npm start            # Produção
```

## Características

- Interface moderna inspirada em Apple Weather
- Temas dinâmicos baseados no clima
- Animações suaves com Framer Motion
- Glassmorphism e backdrop blur
- Responsivo (mobile, tablet, desktop)
- Dados em tempo real
- Gráficos históricos

## Licença

Projeto educacional
