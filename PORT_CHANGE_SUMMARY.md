# Port Change Summary

## Overview

The backend port has been changed from **3000** to **21165** to avoid conflicts with the frontend.

## Changes Made

### Configuration Files

#### Backend
- ✅ `backend/.env` - PORT=21165
- ✅ `backend/.env.example` - PORT=21165

#### Frontend
- ✅ `frontend/.env.local` - NEXT_PUBLIC_API_URL=http://localhost:21165
- ✅ `frontend/.env.example` - NEXT_PUBLIC_API_URL=http://localhost:21165
- ✅ `frontend/services/api.ts` - Default fallback URL updated to http://localhost:21165

#### Test Scripts
- ✅ `send-test-data.ps1` - Updated to port 21165
- ✅ `send-test-data.sh` - Updated to port 21165
- ✅ `send-test-data.bat` - Updated to port 21165

### Documentation Files

All documentation has been updated to reference port 21165:

- ✅ `README.md` - Main project README
- ✅ `QUICK_FIX.md` - Quick fix guide
- ✅ `TROUBLESHOOTING.md` - Troubleshooting guide
- ✅ `PROJECT_SUMMARY.md` - Project summary
- ✅ `backend/README.md` - Backend README
- ✅ `backend/STRUCTURE.md` - Backend structure documentation
- ✅ `backend/API_KEY_EXAMPLES.md` - API key usage examples
- ✅ `backend/SECURITY.md` - Security documentation
- ✅ `backend/FORECAST_EXAMPLES.md` - Forecast API examples
- ✅ `frontend/README.md` - Frontend README
- ✅ `frontend/STRUCTURE.md` - Frontend structure documentation

## Port Configuration

### Backend
- **Port**: 21165
- **URL**: http://localhost:21165
- **Swagger**: http://localhost:21165/api/docs

### Frontend
- **Port**: 3001 (Next.js)
- **URL**: http://localhost:3001

### InfluxDB
- **Port**: 8086
- **URL**: http://localhost:8086

## How to Use

### 1. Start InfluxDB

```bash
# Windows
start-influxdb.bat

# Linux/Mac
bash start-influxdb.sh
```

### 2. Start Backend

```bash
cd backend
npm run start:dev
```

Access: http://localhost:21165
Swagger: http://localhost:21165/api/docs

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Access: http://localhost:3001

### 4. Send Test Data

```bash
# Windows PowerShell
.\send-test-data.ps1

# Linux/Mac
bash send-test-data.sh

# Windows CMD
send-test-data.bat
```

### 5. Access Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:21165
- **Swagger Docs**: http://localhost:21165/api/docs
- **InfluxDB UI**: http://localhost:8086

## Testing

### Test Backend

```bash
curl http://localhost:21165/dados
```

### Test Frontend

Open browser: http://localhost:3001

### Send Test Data

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

## Verification

All references to port 3000 have been updated to 21165 in:
- Configuration files (.env, .env.local, .env.example)
- Source code (frontend/services/api.ts)
- Test scripts (send-test-data.*)
- All documentation files

## Next Steps

1. Restart backend: `cd backend && npm run start:dev`
2. Restart frontend: `cd frontend && npm run dev`
3. Verify backend is accessible at http://localhost:21165
4. Verify frontend connects to backend successfully
5. Test complete flow with test data

## Troubleshooting

### Backend won't start on port 21165

Check if port is in use:
```bash
# Windows
netstat -ano | findstr :21165

# Linux/Mac
lsof -i :21165
```

### Frontend can't connect to backend

1. Verify backend is running: `curl http://localhost:21165/dados`
2. Check `.env.local` has correct URL
3. Restart frontend: `npm run dev`
4. Clear browser cache

### Port conflict

If port 21165 is in use, change it in:
1. `backend/.env` - PORT=<new-port>
2. `frontend/.env.local` - NEXT_PUBLIC_API_URL=http://localhost:<new-port>
3. Restart both services

---

**Status**: ✅ COMPLETE - All port references updated from 3000 to 21165
