@echo off
echo Sending test data to ClimaSense API...

set API_URL=http://localhost:21165/dados
set API_KEY=dev-api-key-change-in-production

for /L %%i in (1,1,10) do (
    set /a TEMP=20 + !RANDOM! %% 10
    set /a HUMID=40 + !RANDOM! %% 40
    
    echo Sending reading %%i...
    
    curl -X POST "%API_URL%" ^
      -H "Content-Type: application/json" ^
      -H "X-API-Key: %API_KEY%" ^
      -d "{\"deviceId\":\"esp32_01\",\"temperatura\":25.5,\"umidade\":60.2,\"timestamp\":\"%date:~-4%-%date:~3,2%-%date:~0,2%T%time:~0,2%:%time:~3,2%:%time:~6,2%.000Z\"}"
    
    timeout /t 2 /nobreak >nul
)

echo Test data sent successfully!
pause
