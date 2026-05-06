# ClimaSense Frontend

Frontend da aplicacao ClimaSense desenvolvido com Next.js e TypeScript.

## Tecnologias

- **Next.js 16** - Framework React para producao
- **TypeScript** - Linguagem com tipagem estatica
- **CSS Modules** - Estilizacao modular e isolada
- **App Router** - Sistema de roteamento do Next.js

## Estrutura do Projeto

```
frontend/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Dashboard (home)
│   ├── page.css             # Estilos do dashboard
│   ├── globals.css          # Estilos globais
│   └── previsao/
│       ├── page.tsx         # Pagina de previsao
│       └── page.css         # Estilos da previsao
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Componente de cabecalho
│   │   └── Header.css       # Estilos do cabecalho
│   ├── charts/              # Componentes de graficos (futuro)
│   └── cards/               # Componentes de cards (futuro)
├── services/
│   └── api.ts               # Cliente da API
├── styles/
│   ├── pages/               # Estilos por pagina
│   └── components/          # Estilos por componente
└── public/                  # Arquivos estaticos
```

## Configuracao

### Variaveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:21165
```

## Instalacao

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3001`

## Build

```bash
npm run build
npm run start
```

## Paginas

### Dashboard (/)

Pagina principal que exibe:
- Leitura atual do sensor
- Dados historicos das ultimas 24 horas
- Atualizacao automatica a cada 30 segundos

### Previsao (/previsao)

Pagina de previsao do tempo que exibe:
- Previsao para os proximos 7 dias
- Temperatura maxima e minima
- Precipitacao
- Velocidade do vento
- Condicao do tempo

## Servicos

### API Client

O arquivo `services/api.ts` contem funcoes para comunicacao com o backend:

- `getSensorData()` - Buscar dados historicos
- `getLatestReading()` - Buscar ultima leitura
- `getForecast()` - Buscar previsao do tempo

## Componentes

### Header

Componente de navegacao principal com links para:
- Dashboard
- Previsao

## Estilos

- CSS puro separado por pagina e componente
- Sem frameworks CSS (Tailwind, Bootstrap, etc.)
- Design responsivo
- Tema escuro no header

## Funcionalidades

### Dashboard

- Exibicao de dados em tempo real
- Tabela de dados historicos
- Cards com metricas principais
- Atualizacao automatica

### Previsao

- Grid de cards de previsao
- Informacoes de localizacao
- Icones e descricoes do tempo
- Design responsivo

## Proximos Passos

- [ ] Adicionar graficos de temperatura e umidade
- [ ] Implementar selecao de dispositivo
- [ ] Adicionar filtros de data
- [ ] Implementar comparacao de dados
- [ ] Adicionar notificacoes
- [ ] Implementar modo escuro
- [ ] Adicionar PWA support

## Scripts Disponiveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Producao
npm run start

# Lint
npm run lint
```

## Requisitos

- Node.js 18+
- Backend rodando em http://localhost:21165

## Troubleshooting

### Erro de conexao com API

Verifique se:
1. Backend esta rodando
2. URL da API esta correta no `.env.local`
3. CORS esta habilitado no backend

### Pagina em branco

1. Verifique o console do navegador
2. Verifique se o build foi feito corretamente
3. Limpe o cache: `rm -rf .next`

## Licenca

Este projeto esta em desenvolvimento.
