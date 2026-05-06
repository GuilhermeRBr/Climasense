#!/bin/bash

echo "Sending test data to ClimaSense API..."

API_URL="http://localhost:21165/dados"
API_KEY="dev-api-key-change-in-production"

for i in {1..10}
do
  TEMP=$(awk -v min=20 -v max=30 'BEGIN{srand(); print min+rand()*(max-min)}')
  HUMID=$(awk -v min=40 -v max=80 'BEGIN{srand(); print min+rand()*(max-min)}')
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  
  echo "Sending reading $i: Temp=$TEMP°C, Humidity=$HUMID%"
  
  curl -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: $API_KEY" \
    -d "{
      \"deviceId\": \"esp32_01\",
      \"temperatura\": $TEMP,
      \"umidade\": $HUMID,
      \"timestamp\": \"$TIMESTAMP\"
    }" \
    -s -o /dev/null -w "Status: %{http_code}\n"
  
  sleep 2
done

echo "Test data sent successfully!"
