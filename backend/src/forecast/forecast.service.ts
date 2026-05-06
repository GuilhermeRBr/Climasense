import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ForecastQueryDto } from './dto/forecast-query.dto';
import { ForecastResponseDto, DailyForecastDto } from './dto/forecast-response.dto';

@Injectable()
export class ForecastService {
  private readonly logger = new Logger(ForecastService.name);
  private readonly openMeteoUrl = 'https://api.open-meteo.com/v1/forecast';

  async getForecast(query: ForecastQueryDto): Promise<ForecastResponseDto> {
    try {
      const { latitude, longitude, days = 7 } = query;

      this.logger.log(
        `Fetching forecast for lat: ${latitude}, lon: ${longitude}, days: ${days}`,
      );

      const response = await axios.get(this.openMeteoUrl, {
        params: {
          latitude,
          longitude,
          daily: [
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_sum',
            'windspeed_10m_max',
            'weathercode',
          ].join(','),
          timezone: 'auto',
          forecast_days: days,
        },
      });

      const data = response.data;

      const daily: DailyForecastDto[] = data.daily.time.map(
        (date: string, index: number) => ({
          date,
          temperatureMax: data.daily.temperature_2m_max[index],
          temperatureMin: data.daily.temperature_2m_min[index],
          precipitation: data.daily.precipitation_sum[index],
          windSpeed: data.daily.windspeed_10m_max[index],
          weatherCode: data.daily.weathercode[index],
        }),
      );

      const forecast: ForecastResponseDto = {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        daily,
      };

      this.logger.log(`Forecast retrieved successfully: ${daily.length} days`);

      return forecast;
    } catch (error) {
      this.logger.error(`Error fetching forecast: ${error.message}`);

      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Failed to fetch forecast from Open-Meteo: ${error.message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      throw new HttpException(
        'Internal server error while fetching forecast',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    return weatherCodes[code] || 'Unknown';
  }
}
