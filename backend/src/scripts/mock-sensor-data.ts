import axios from 'axios';

const API_URL = 'http://localhost:21165/dados';
const API_KEY = 'dev-api-key-change-in-production';
const DEVICE_ID = 'esp32_01';

interface MockSensorData {
  deviceId: string;
  temperatura: number;
  umidade: number;
  pressao?: number;
  velocidadeVento?: number;
  direcaoVento?: number;
  chuva?: number;
  luminosidade?: number;
  timestamp: string;
}

function generateRandomValue(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateMockData(): MockSensorData {
  const now = new Date();
  
  const temperatura = generateRandomValue(15, 35);
  const umidade = generateRandomValue(30, 90);
  const pressao = generateRandomValue(980, 1030);
  const velocidadeVento = generateRandomValue(0, 50);
  const direcaoVento = generateRandomValue(0, 360);
  const chuva = Math.random() > 0.7 ? generateRandomValue(0, 10) : 0;
  
  const hour = now.getHours();
  let luminosidade: number;
  if (hour >= 6 && hour < 8) {
    luminosidade = generateRandomValue(20, 40);
  } else if (hour >= 8 && hour < 18) {
    luminosidade = generateRandomValue(60, 100);
  } else if (hour >= 18 && hour < 20) {
    luminosidade = generateRandomValue(20, 40);
  } else {
    luminosidade = generateRandomValue(0, 20);
  }

  return {
    deviceId: DEVICE_ID,
    temperatura: parseFloat(temperatura.toFixed(2)),
    umidade: parseFloat(umidade.toFixed(2)),
    pressao: parseFloat(pressao.toFixed(2)),
    velocidadeVento: parseFloat(velocidadeVento.toFixed(2)),
    direcaoVento: parseFloat(direcaoVento.toFixed(0)),
    chuva: parseFloat(chuva.toFixed(2)),
    luminosidade: parseFloat(luminosidade.toFixed(2)),
    timestamp: now.toISOString(),
  };
}

async function sendMockData(): Promise<void> {
  try {
    const data = generateMockData();
    
    console.log('\n📡 Sending mock sensor data:');
    console.log(`   Device: ${data.deviceId}`);
    console.log(`   Temperature: ${data.temperatura}°C`);
    console.log(`   Humidity: ${data.umidade}%`);
    console.log(`   Pressure: ${data.pressao} hPa`);
    console.log(`   Wind Speed: ${data.velocidadeVento} km/h`);
    console.log(`   Wind Direction: ${data.direcaoVento}°`);
    console.log(`   Rainfall: ${data.chuva} mm`);
    console.log(`   Luminosity: ${data.luminosidade}%`);
    console.log(`   Timestamp: ${data.timestamp}`);

    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    });

    console.log('✅ Data sent successfully!');
    console.log(`   Response: ${response.data.message}`);
  } catch (error: any) {
    console.error('❌ Error sending data:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

async function generateHistoricalData(hours: number = 24): Promise<void> {
  console.log(`\n🔄 Generating ${hours} hours of historical data...\n`);
  
  const now = new Date();
  const dataPoints: MockSensorData[] = [];
  
  for (let i = hours * 6; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000);
    
    const hour = timestamp.getHours();
    let luminosidade: number;
    if (hour >= 6 && hour < 8) {
      luminosidade = generateRandomValue(20, 40);
    } else if (hour >= 8 && hour < 18) {
      luminosidade = generateRandomValue(60, 100);
    } else if (hour >= 18 && hour < 20) {
      luminosidade = generateRandomValue(20, 40);
    } else {
      luminosidade = generateRandomValue(0, 20);
    }

    const data: MockSensorData = {
      deviceId: DEVICE_ID,
      temperatura: parseFloat(generateRandomValue(15, 35).toFixed(2)),
      umidade: parseFloat(generateRandomValue(30, 90).toFixed(2)),
      pressao: parseFloat(generateRandomValue(980, 1030).toFixed(2)),
      velocidadeVento: parseFloat(generateRandomValue(0, 50).toFixed(2)),
      direcaoVento: parseFloat(generateRandomValue(0, 360).toFixed(0)),
      chuva: Math.random() > 0.7 ? parseFloat(generateRandomValue(0, 10).toFixed(2)) : 0,
      luminosidade: parseFloat(luminosidade.toFixed(2)),
      timestamp: timestamp.toISOString(),
    };

    dataPoints.push(data);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const data of dataPoints) {
    try {
      await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
      });
      successCount++;
      process.stdout.write(`\r✅ Progress: ${successCount}/${dataPoints.length} records sent`);
    } catch (error) {
      errorCount++;
    }
  }

  console.log(`\n\n📊 Historical data generation complete!`);
  console.log(`   Success: ${successCount} records`);
  console.log(`   Errors: ${errorCount} records`);
}

const args = process.argv.slice(2);
const command = args[0];

if (command === 'historical') {
  const hours = parseInt(args[1]) || 24;
  generateHistoricalData(hours);
} else if (command === 'continuous') {
  console.log('🔄 Starting continuous mock data generation...');
  console.log('   Press Ctrl+C to stop\n');
  
  sendMockData();
  setInterval(sendMockData, 30000);
} else {
  sendMockData();
}
