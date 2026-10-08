<div align="center">

<h1 align="center">Climasense — Monitoramento Climático em Tempo Real</h1>

<p align="center">
  <strong>Climasense é uma plataforma open-source para monitoramento climático com sensores IoT, desenvolvida para visualizar dados atmosféricos em tempo real com Next.js, NestJS, TypeScript e InfluxDB.</strong>
</p>

<p align="center">
  <a href="#"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue"></a>
  <a href="#"><img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/GuilhermeRBr/Climasense?color=green"></a>
  <a href="#"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/GuilhermeRBr/Climasense?color=purple"></a>
</p>

<br />

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,ts,nestjs,docker" alt="Tech Stack Icons" />
</p>

</div>

---

## Sobre o projeto

O **Climasense** é uma aplicação web para **monitoramento climático em tempo real**, com foco em leitura de sensores IoT (ESP32), visualização de dados atmosféricos e previsão do tempo.

> Desenvolvido para quem quer acompanhar condições climáticas com precisão, com uma interface visual moderna e dados em tempo real armazenados em série temporal via InfluxDB.

Funcionalidades:

- Painel principal com temperatura, umidade, pressão, vento, chuva e luminosidade
- Leitura em tempo real do sensor ESP32 com atualização automática a cada 30 segundos
- Histórico avançado de leituras com filtros por período e métrica
- Previsão do tempo para 7 dias via API Open-Meteo (sem necessidade de chave)
- Insights climáticos gerados a partir dos dados históricos
- Tema visual dinâmico que muda conforme as condições (ensolarado, nublado, chuvoso, noturno)
- Partículas animadas e efeitos de transição no fundo
- API protegida por API Key para ingestão de dados dos sensores
- Documentação automática via Swagger em `/api/docs`
- Script de mock para simular dados do sensor sem hardware físico

---

## Tecnologias Usadas

| Tecnologia | Descrição |
|------------|-----------|
| ![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat&logo=next.js&logoColor=white) | Frontend com App Router |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Tipagem estática em todo o projeto |
| ![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) | Backend modular e escalável |
| ![InfluxDB](https://img.shields.io/badge/-InfluxDB-22ADF6?style=flat&logo=influxdb&logoColor=white) | Banco de dados de série temporal para leituras dos sensores |
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white) | Ambiente de desenvolvimento local |
| ![Recharts](https://img.shields.io/badge/-Recharts-FF6384?style=flat&logo=react&logoColor=white) | Gráficos interativos no frontend |

---

## Como rodar o projeto

### Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- [Docker](https://www.docker.com) (para o InfluxDB)
- npm ou yarn

### 1. InfluxDB

```bash
# Suba o InfluxDB via Docker
docker run -d \
  --name influxdb \
  -p 8086:8086 \
  influxdb:2.0

# Acesse http://localhost:8086 e crie:
# - Organização: climasense
# - Bucket: sensor-data
# - Copie o token gerado para o .env do backend
```

### 2. Backend

```bash
cd backend

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com INFLUXDB_URL, INFLUXDB_TOKEN, INFLUXDB_ORG, INFLUXDB_BUCKET e API_KEY

# Instale as dependências
npm install

# Inicie o servidor
npm run start:dev
```

> Backend disponível em `http://localhost:21165`
> Documentação Swagger em `http://localhost:21165/api/docs`

### 3. Frontend

```bash
cd frontend

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com NEXT_PUBLIC_API_URL=http://localhost:21165

# Instale as dependências
npm install

# Inicie o servidor
npm run dev
```

> Frontend disponível em `http://localhost:3000`

### 4. Simular dados do sensor (opcional)

Caso não tenha hardware físico, use o script de mock:

```bash
cd backend

# Envia uma leitura única
npm run mock:send

# Envia 24 horas de dados históricos
npm run mock:historical

# Envia dados continuamente em loop
npm run mock:continuous
```

---

## Estrutura de Pastas

```
Climasense/
├── backend/
│   └── src/
│       ├── common/
│       │   ├── decorators/
│       │   └── guards/
│       ├── forecast/
│       │   └── dto/
│       ├── influx/
│       ├── scripts/
│       └── sensor/
│           ├── dto/
│           └── interfaces/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── previsao/
│   ├── components/
│   │   ├── charts/
│   │   ├── effects/
│   │   ├── layout/
│   │   ├── loading/
│   │   └── weather/
│   ├── services/
│   └── styles/
└── README.md
```

---

## Colaboradores

<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/GuilhermeRBr.png" width="100px;" alt="Guilherme Rebouças"/><br />
      <sub><b>Guilherme Rebouças</b></sub><br />
      <a href="https://github.com/GuilhermeRBr" target="_blank">@GuilhermeRBr</a>
    </td>
  </tr>
</table>

---

## Atribuição de dados

A previsão do tempo é fornecida pela [Open-Meteo API](https://open-meteo.com/), que é gratuita e de código aberto para uso não comercial.

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
