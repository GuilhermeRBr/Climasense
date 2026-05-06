Write-Host "Sending test data to ClimaSense API..." -ForegroundColor Green

$apiUrl = "http://localhost:21165/dados"
$apiKey = "dev-api-key-change-in-production"

$headers = @{
    "Content-Type" = "application/json"
    "X-API-Key" = $apiKey
}

for ($i = 1; $i -le 10; $i++) {
    $temp = Get-Random -Minimum 20.0 -Maximum 30.0
    $humid = Get-Random -Minimum 40.0 -Maximum 80.0
    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.000Z")
    
    $body = @{
        deviceId = "esp32_01"
        temperatura = [math]::Round($temp, 2)
        umidade = [math]::Round($humid, 2)
        timestamp = $timestamp
    } | ConvertTo-Json
    
    Write-Host "Sending reading $i : Temp=$([math]::Round($temp, 1))°C, Humidity=$([math]::Round($humid, 1))%" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body
        Write-Host "  Success: $($response.message)" -ForegroundColor Green
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 2
}

Write-Host "`nTest data sent successfully!" -ForegroundColor Green
Write-Host "You can now refresh the dashboard at http://localhost:3001" -ForegroundColor Yellow
