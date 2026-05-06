# ClimaSense - Troubleshooting Guide

## Problem: Dashboard shows "Carregando dados..." but doesn't load

### Solution Steps:

### 1. Check if Backend is Running

```bash
curl http://localhost:21165/dados
```

**Expected**: Should return `[]` or array of data

**If fails**: Start the backend
```bash
cd backend
npm run start:dev
```

### 2. Check if InfluxDB is Running

```bash
docker ps | grep influxdb
```

**Expected**: Should show running container

**If fails**: Start InfluxDB
```bash
# Windows
start-influxdb.bat

# Linux/Mac
bash start-influxdb.sh
```

### 3. Send Test Data

The database is empty. Send some test data:

```bash
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File send-test-data.ps1

# Linux/Mac
bash send-test-data.sh
```

### 4. Verify Data in API

```bash
curl "http://localhost:21165/dados?deviceId=esp32_01"
```

**Expected**: Should return array with sensor readings

### 5. Check Frontend Environment Variables

Verify `frontend/.env.local` exists and contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:21165
```

### 6. Restart Frontend

The frontend needs to be restarted after changing `.env.local`:

```bash
cd frontend

# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 7. Check Browser Console

Open browser DevTools (F12) and check Console tab for errors.

Common errors:
- **CORS error**: Backend CORS is not enabled (should be enabled by default)
- **Network error**: Backend is not running
- **404 error**: Wrong API URL

### 8. Verify CORS is Enabled

Check `backend/src/main.ts` has:

```typescript
app.enableCors();
```

### 9. Test API Directly

Open browser and navigate to:
- `http://localhost:21165/dados?deviceId=esp32_01`

You should see JSON data.

### 10. Clear Browser Cache

Sometimes the browser caches the old version:
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear cache in DevTools

## Common Issues

### Issue: "Failed to fetch sensor data"

**Cause**: Backend is not running or wrong URL

**Solution**:
1. Check backend is running: `curl http://localhost:21165/dados`
2. Check `.env.local` has correct URL
3. Restart frontend

### Issue: Empty array returned

**Cause**: No data in InfluxDB

**Solution**: Run `send-test-data.ps1` to populate database

### Issue: CORS error in browser console

**Cause**: CORS not enabled in backend

**Solution**: 
1. Check `backend/src/main.ts` has `app.enableCors()`
2. Restart backend

### Issue: 401 Unauthorized on POST

**Cause**: Missing or wrong API Key

**Solution**: 
- GET endpoints are public (no API Key needed)
- POST endpoint requires API Key header
- Use `send-test-data.ps1` which includes the correct API Key

### Issue: Frontend shows old data

**Cause**: Browser cache

**Solution**: Hard refresh (`Ctrl+Shift+R`)

## Quick Fix Checklist

- [ ] InfluxDB is running (`docker ps`)
- [ ] Backend is running (`curl http://localhost:21165/dados`)
- [ ] Database has data (run `send-test-data.ps1`)
- [ ] Frontend `.env.local` exists with correct URL
- [ ] Frontend was restarted after `.env.local` changes
- [ ] Browser was hard refreshed (`Ctrl+Shift+R`)

## Testing the Complete Flow

### 1. Start all services:

```bash
# Terminal 1: InfluxDB
start-influxdb.bat

# Terminal 2: Backend
cd backend
npm run start:dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

### 2. Send test data:

```bash
# Terminal 4
powershell -ExecutionPolicy Bypass -File send-test-data.ps1
```

### 3. Access frontend:

Open browser: `http://localhost:3001`

You should see:
- Current reading card with temperature and humidity
- Historical data table with 10 readings

## Still Not Working?

### Check Backend Logs

Look at the terminal where backend is running for errors.

### Check Frontend Logs

Look at the terminal where frontend is running for errors.

### Check Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for requests to `localhost:21165`
5. Check if they return 200 OK
6. Check response content

### Verify Ports

Make sure ports are not in use:
- Backend: 21165
- Frontend: 3000 (Next.js default)
- InfluxDB: 8086

```bash
# Windows
netstat -ano | findstr :21165
netstat -ano | findstr :3001
netstat -ano | findstr :8086
```

## Need More Help?

1. Check backend logs for errors
2. Check browser console for errors
3. Verify all services are running
4. Try sending data manually with curl
5. Check if data appears in InfluxDB UI (`http://localhost:8086`)

## Quick Test Commands

```bash
# Test backend
curl http://localhost:21165/dados

# Test with device filter
curl "http://localhost:21165/dados?deviceId=esp32_01"

# Test latest reading
curl "http://localhost:21165/dados/latest?deviceId=esp32_01"

# Test forecast
curl "http://localhost:21165/previsao?latitude=-23.5505&longitude=-46.6333&days=7"

# Send single test data
curl -X POST http://localhost:21165/dados \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-change-in-production" \
  -d '{"deviceId":"esp32_01","temperatura":25.5,"umidade":60.2,"timestamp":"2026-05-06T10:00:00.000Z"}'
```
