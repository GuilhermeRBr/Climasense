# Forecast API Examples

Este documento contém exemplos de uso do endpoint de previsão do tempo.

## Endpoint

**GET /previsao**

Retorna a previsão do tempo para uma localização específica usando a API Open-Meteo.

## Parâmetros

### latitude (obrigatório)
- **Tipo**: Number
- **Limites**: -90 a 90
- **Descrição**: Latitude da localização
- **Exemplo**: -23.5505 (São Paulo)

### longitude (obrigatório)
- **Tipo**: Number
- **Limites**: -180 a 180
- **Descrição**: Longitude da localização
- **Exemplo**: -46.6333 (São Paulo)

### days (opcional)
- **Tipo**: Number
- **Limites**: 1 a 16
- **Padrão**: 7
- **Descrição**: Número de dias de previsão
- **Exemplo**: 7

## Exemplos de Uso

### cURL - São Paulo (7 dias)

```bash
curl "http://localhost:3000/previsao?latitude=-23.5505&longitude=-46.6333&days=7"
```

### cURL - Rio de Janeiro (3 dias)

```bash
curl "http://localhost:3000/previsao?latitude=-22.9068&longitude=-43.1729&days=3"
```

### cURL - Brasília (14 dias)

```bash
curl "http://localhost:3000/previsao?latitude=-15.7939&longitude=-47.8828&days=14"
```

### PowerShell

```powershell
$params = @{
    latitude = -23.5505
    longitude = -46.6333
    days = 7
}

$query = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&"
$url = "http://localhost:3000/previsao?$query"

Invoke-RestMethod -Uri $url -Method Get
```

### JavaScript/Node.js

```javascript
const axios = require('axios');

const getForecast = async (latitude, longitude, days = 7) => {
  try {
    const response = await axios.get('http://localhost:3000/previsao', {
      params: { latitude, longitude, days }
    });
    
    console.log('Forecast:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

// São Paulo
getForecast(-23.5505, -46.6333, 7);
```

### Python

```python
import requests

def get_forecast(latitude, longitude, days=7):
    url = "http://localhost:3000/previsao"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "days": days
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.json())
        return None

# São Paulo
forecast = get_forecast(-23.5505, -46.6333, 7)
if forecast:
    print(f"Location: {forecast['latitude']}, {forecast['longitude']}")
    print(f"Timezone: {forecast['timezone']}")
    for day in forecast['daily']:
        print(f"{day['date']}: {day['temperatureMin']}°C - {day['temperatureMax']}°C")
```

## Resposta

### Estrutura

```json
{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "timezone": "America/Sao_Paulo",
  "daily": [
    {
      "date": "2026-05-06",
      "temperatureMax": 28.5,
      "temperatureMin": 18.2,
      "precipitation": 2.5,
      "windSpeed": 15.3,
      "weatherCode": 3
    }
  ]
}
```

### Campos

#### latitude
Latitude da localização (retornada pela API)

#### longitude
Longitude da localização (retornada pela API)

#### timezone
Timezone da localização (ex: "America/Sao_Paulo")

#### daily
Array de previsões diárias

##### date
Data da previsão (formato: YYYY-MM-DD)

##### temperatureMax
Temperatura máxima do dia em graus Celsius

##### temperatureMin
Temperatura mínima do dia em graus Celsius

##### precipitation
Precipitação total do dia em milímetros

##### windSpeed
Velocidade máxima do vento em km/h

##### weatherCode
Código WMO do clima (ver tabela abaixo)

## Weather Codes (WMO)

| Código | Descrição |
|--------|-----------|
| 0 | Clear sky |
| 1 | Mainly clear |
| 2 | Partly cloudy |
| 3 | Overcast |
| 45 | Foggy |
| 48 | Depositing rime fog |
| 51 | Light drizzle |
| 53 | Moderate drizzle |
| 55 | Dense drizzle |
| 61 | Slight rain |
| 63 | Moderate rain |
| 65 | Heavy rain |
| 71 | Slight snow |
| 73 | Moderate snow |
| 75 | Heavy snow |
| 77 | Snow grains |
| 80 | Slight rain showers |
| 81 | Moderate rain showers |
| 82 | Violent rain showers |
| 85 | Slight snow showers |
| 86 | Heavy snow showers |
| 95 | Thunderstorm |
| 96 | Thunderstorm with slight hail |
| 99 | Thunderstorm with heavy hail |

## Cidades Brasileiras

### Principais Capitais

```bash
# São Paulo
curl "http://localhost:3000/previsao?latitude=-23.5505&longitude=-46.6333"

# Rio de Janeiro
curl "http://localhost:3000/previsao?latitude=-22.9068&longitude=-43.1729"

# Brasília
curl "http://localhost:3000/previsao?latitude=-15.7939&longitude=-47.8828"

# Salvador
curl "http://localhost:3000/previsao?latitude=-12.9714&longitude=-38.5014"

# Fortaleza
curl "http://localhost:3000/previsao?latitude=-3.7172&longitude=-38.5433"

# Belo Horizonte
curl "http://localhost:3000/previsao?latitude=-19.9167&longitude=-43.9345"

# Manaus
curl "http://localhost:3000/previsao?latitude=-3.1190&longitude=-60.0217"

# Curitiba
curl "http://localhost:3000/previsao?latitude=-25.4284&longitude=-49.2733"

# Recife
curl "http://localhost:3000/previsao?latitude=-8.0476&longitude=-34.8770"

# Porto Alegre
curl "http://localhost:3000/previsao?latitude=-30.0346&longitude=-51.2177"
```

## Erros

### 400 Bad Request - Parâmetros Inválidos

```json
{
  "statusCode": 400,
  "message": [
    "latitude must not be less than -90",
    "longitude must not be greater than 180"
  ],
  "error": "Bad Request"
}
```

**Causas:**
- Latitude fora do intervalo -90 a 90
- Longitude fora do intervalo -180 a 180
- Days fora do intervalo 1 a 16
- Parâmetros ausentes

### 502 Bad Gateway - Erro na API Externa

```json
{
  "statusCode": 502,
  "message": "Failed to fetch forecast from Open-Meteo: Network Error"
}
```

**Causas:**
- API Open-Meteo indisponível
- Timeout na requisição
- Erro de rede

## Swagger UI

### Testando no Swagger

1. Acesse: `http://localhost:3000/api/docs`
2. Expanda `GET /previsao`
3. Clique em "Try it out"
4. Preencha os parâmetros:
   - latitude: -23.5505
   - longitude: -46.6333
   - days: 7
5. Clique em "Execute"
6. Veja a resposta

## Integração Frontend

### React/Next.js

```typescript
import { useState, useEffect } from 'react';

interface ForecastData {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: Array<{
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
  }>;
}

const useForecast = (latitude: number, longitude: number, days: number = 7) => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/previsao?latitude=${latitude}&longitude=${longitude}&days=${days}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch forecast');
        }
        
        const data = await response.json();
        setForecast(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [latitude, longitude, days]);

  return { forecast, loading, error };
};

export default useForecast;
```

## Limitações

### API Open-Meteo

- **Limite de requisições**: Sem limite para uso não comercial
- **Dados históricos**: Limitados
- **Resolução**: Dados diários (não horários neste endpoint)
- **Cobertura**: Global

### Endpoint

- **Cache**: Não implementado (cada requisição consulta a API)
- **Rate limiting**: Não implementado
- **Autenticação**: Não requerida (endpoint público)

## Melhorias Futuras

- [ ] Implementar cache de previsões
- [ ] Adicionar previsão horária
- [ ] Adicionar dados de UV index
- [ ] Adicionar qualidade do ar
- [ ] Implementar rate limiting
- [ ] Adicionar múltiplas fontes de dados
- [ ] Implementar fallback para outras APIs

## Troubleshooting

### Erro: "latitude must be a number"

**Causa**: Parâmetro latitude não é um número válido

**Solução**: Certifique-se de enviar um número, não uma string

### Erro: "Failed to fetch forecast from Open-Meteo"

**Causa**: Problema de conectividade com a API externa

**Solução**: 
1. Verifique sua conexão com a internet
2. Tente novamente após alguns segundos
3. Verifique se a API Open-Meteo está online

### Resposta vazia ou null

**Causa**: Coordenadas inválidas ou fora de cobertura

**Solução**: Verifique se as coordenadas estão corretas

## Referências

- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [WMO Weather Codes](https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
