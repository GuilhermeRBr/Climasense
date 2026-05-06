# Quick Fix - Dashboard Not Loading Data

## The Problem

Dashboard shows "Carregando dados..." but never loads.

## The Solution (3 steps)

### Step 1: Send Test Data

Run this command in the project root:

```powershell
powershell -ExecutionPolicy Bypass -File send-test-data.ps1
```

This will send 10 test readings to the database.

### Step 2: Restart Frontend

```bash
cd frontend

# Stop the server (Ctrl+C in the terminal where it's running)
# Then start again:
npm run dev
```

**IMPORTANT**: The frontend must be restarted to pick up environment variables!

### Step 3: Refresh Browser

Open `http://localhost:3001` and hard refresh:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

## Verify It Works

You should now see:
- ✅ Current reading card with temperature and humidity
- ✅ Historical data table with 10 readings
- ✅ Device ID: esp32_01

## If Still Not Working

Run these checks:

### 1. Backend Running?
```bash
curl http://localhost:21165/dados
```
Should return data (not empty array).

### 2. InfluxDB Running?
```bash
docker ps | grep influxdb
```
Should show a running container.

### 3. Data in Database?
```bash
curl "http://localhost:21165/dados?deviceId=esp32_01"
```
Should return JSON array with readings.

## Need More Data?

Run the test data script again:
```powershell
powershell -ExecutionPolicy Bypass -File send-test-data.ps1
```

Each run adds 10 more readings.

## Complete Restart

If nothing works, restart everything:

```bash
# 1. Stop all (Ctrl+C in each terminal)

# 2. Start InfluxDB
start-influxdb.bat

# 3. Start Backend
cd backend
npm run start:dev

# 4. Start Frontend
cd frontend
npm run dev

# 5. Send test data
powershell -ExecutionPolicy Bypass -File send-test-data.ps1

# 6. Open browser
# http://localhost:3001
```

## Success!

Once working, the dashboard will:
- Show current temperature and humidity
- Display historical data table
- Auto-refresh every 30 seconds
- Show "esp32_01" as device ID

The forecast page (`/previsao`) should work immediately as it doesn't need database data.
