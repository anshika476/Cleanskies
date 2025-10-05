// CSV parsing and data management utilities

export interface AirQualityData {
  city: string;
  zipCode: string;
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  so2?: number;
  co?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  timestamp?: string;
}

export interface ProcessedAirQualityData extends AirQualityData {
  aqi: number;
  status: 'clean' | 'moderate' | 'unhealthy' | 'hazardous';
}

// Parse CSV string into AirQualityData array
export const parseCSV = (csvContent: string): AirQualityData[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const data: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      
      // Map different possible column names to our standard format
      switch (header) {
        case 'city':
        case 'city_name':
        case 'location':
          data.city = value;
          break;
        case 'zip':
        case 'zip_code':
        case 'zipcode':
          data.zipCode = value;
          break;
        case 'pm2.5':
        case 'pm25':
        case 'pm_2_5':
          data.pm25 = parseFloat(value) || 0;
          break;
        case 'pm10':
        case 'pm_10':
          data.pm10 = parseFloat(value) || 0;
          break;
        case 'ozone':
        case 'o3':
        case 'o_3':
          data.ozone = parseFloat(value) || 0;
          break;
        case 'no2':
        case 'nitrogen_dioxide':
        case 'no_2':
          data.no2 = parseFloat(value) || 0;
          break;
        case 'so2':
        case 'sulfur_dioxide':
        case 'so_2':
          data.so2 = parseFloat(value) || 0;
          break;
        case 'co':
        case 'carbon_monoxide':
        case 'carbon_monoxide_ppm':
          data.co = parseFloat(value) || 0;
          break;
        case 'temperature':
        case 'temp':
        case 'temp_c':
          data.temperature = parseFloat(value) || 0;
          break;
        case 'humidity':
        case 'humidity_percent':
          data.humidity = parseFloat(value) || 0;
          break;
        case 'wind_speed':
        case 'wind':
        case 'wind_kmh':
          data.windSpeed = parseFloat(value) || 0;
          break;
        case 'timestamp':
        case 'date':
        case 'time':
          data.timestamp = value;
          break;
      }
    });
    
    return data as AirQualityData;
  });
};

// Calculate AQI from pollutant concentrations
export const calculateAQI = (pm25: number, pm10: number, ozone: number, no2: number): number => {
  // Simplified AQI calculation - in practice, you'd use EPA's complex formula
  const pm25AQI = Math.min(Math.max((pm25 / 12) * 50, 0), 500);
  const pm10AQI = Math.min(Math.max((pm10 / 54) * 50, 0), 500);
  const ozoneAQI = Math.min(Math.max((ozone / 54) * 50, 0), 500);
  const no2AQI = Math.min(Math.max((no2 / 53) * 50, 0), 500);
  
  return Math.round(Math.max(pm25AQI, pm10AQI, ozoneAQI, no2AQI));
};

// Determine air quality status based on AQI
export const getAirQualityStatus = (aqi: number): 'clean' | 'moderate' | 'unhealthy' | 'hazardous' => {
  if (aqi <= 50) return 'clean';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  return 'hazardous';
};

// Process raw CSV data into our application format
export const processAirQualityData = (rawData: AirQualityData[]): ProcessedAirQualityData[] => {
  return rawData.map(data => {
    const aqi = calculateAQI(data.pm25, data.pm10, data.ozone, data.no2);
    const status = getAirQualityStatus(aqi);
    
    return {
      ...data,
      aqi,
      status
    };
  });
};

// Find data by zip code
export const findDataByZipCode = (data: ProcessedAirQualityData[], zipCode: string): ProcessedAirQualityData | null => {
  return data.find(item => item.zipCode === zipCode) || null;
};

// Find data by city name
export const findDataByCity = (data: ProcessedAirQualityData[], cityName: string): ProcessedAirQualityData | null => {
  return data.find(item => 
    item.city.toLowerCase().includes(cityName.toLowerCase())
  ) || null;
};

// Generate trend data for charts
export const generateTrendData = (currentData: ProcessedAirQualityData) => {
  const baseAQI = currentData.aqi;
  const trendData = [];
  
  // Generate historical data (past 6 hours)
  for (let i = 6; i > 0; i--) {
    const variation = (Math.random() - 0.5) * 20; // ±10 AQI variation
    trendData.push({
      time: `${i}h ago`,
      aqi: Math.max(0, Math.round(baseAQI + variation))
    });
  }
  
  // Current reading
  trendData.push({
    time: "Now",
    aqi: baseAQI
  });
  
  // Generate predictions (next 48 hours)
  for (let i = 6; i <= 48; i += 6) {
    const variation = (Math.random() - 0.5) * 30; // ±15 AQI variation for predictions
    trendData.push({
      time: `+${i}h`,
      predicted: Math.max(0, Math.round(baseAQI + variation))
    });
  }
  
  return trendData;
};
