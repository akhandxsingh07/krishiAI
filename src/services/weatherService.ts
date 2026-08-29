import { WeatherData } from '../types';

export interface AgriLocation {
  city: string;
  state: string;
  lat: number;
  lon: number;
  primaryCrops: string[];
}

export const POPULAR_AGRI_LOCATIONS: AgriLocation[] = [
  { city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573, primaryCrops: ['Wheat', 'Rice', 'Cotton', 'Mustard'] },
  { city: 'Karnal', state: 'Haryana', lat: 29.6857, lon: 76.9905, primaryCrops: ['Rice (Basmati)', 'Wheat', 'Sugarcane'] },
  { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, primaryCrops: ['Paddy', 'Wheat', 'Vegetables', 'Mustard'] },
  { city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365, primaryCrops: ['Chilli', 'Cotton', 'Paddy', 'Tobacco'] },
  { city: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, primaryCrops: ['Onion', 'Grapes', 'Tomato', 'Sugarcane'] },
  { city: 'Mandya', state: 'Karnataka', lat: 12.5238, lon: 76.8966, primaryCrops: ['Sugarcane', 'Paddy', 'Ragi', 'Coconut'] },
  { city: 'Bardhaman', state: 'West Bengal', lat: 23.2324, lon: 87.8615, primaryCrops: ['Rice (Aman/Boro)', 'Potato', 'Jute'] },
  { city: 'Rajkot', state: 'Gujarat', lat: 22.3039, lon: 70.8022, primaryCrops: ['Groundnut', 'Cotton', 'Cumin', 'Sesame'] },
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, primaryCrops: ['Soybean', 'Wheat', 'Gram', 'Garlic'] },
  { city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, primaryCrops: ['Cotton', 'Sugarcane', 'Banana', 'Coconut'] },
  { city: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lon: 85.3647, primaryCrops: ['Litchi', 'Maize', 'Paddy', 'Pulses'] },
  { city: 'Cuttack', state: 'Odisha', lat: 20.4625, lon: 85.8828, primaryCrops: ['Paddy', 'Pulses', 'Jute', 'Vegetables'] },
];

export async function fetchLiveAgriWeather(lat: number = 30.9010, lon: number = 75.8573, cityName: string = 'Ludhiana', stateName: string = 'Punjab'): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=Asia%2FKolkata`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API fetch failed');
    const data = await res.json();

    const current = data.current;
    const daily = data.daily;

    const temp = Math.round(current.temperature_2m ?? 28);
    const feelsLike = Math.round(current.apparent_temperature ?? temp);
    const humidity = Math.round(current.relative_humidity_2m ?? 65);
    const windSpeedKmH = Math.round(current.wind_speed_10m ?? 12);
    const rainfallMm = Number((current.precipitation ?? 0).toFixed(1));
    const rainProb = daily.precipitation_probability_max?.[0] ?? (rainfallMm > 0 ? 90 : 20);
    const uvIndex = Math.round(daily.uv_index_max?.[0] ?? 6);
    const tempMax = Math.round(daily.temperature_2m_max?.[0] ?? temp + 4);
    const tempMin = Math.round(daily.temperature_2m_min?.[0] ?? temp - 6);

    // Weather condition code translation (WMO standard)
    const code = current.weather_code ?? 0;
    const { condition, icon } = interpretWmoCode(code);

    // Calculate Spray Advisory
    let sprayStatus: 'Optimal' | 'Caution' | 'Unfavorable' = 'Optimal';
    let sprayReason = 'Calm winds (<15 km/h) and dry weather ensure optimal pesticide/fertilizer absorption with minimal drift.';

    if (rainProb > 50 || rainfallMm > 1.0) {
      sprayStatus = 'Unfavorable';
      sprayReason = `High rainfall risk (${rainProb}%). Rain within 6 hours will wash off foliar sprays. Postpone chemical application.`;
    } else if (windSpeedKmH > 20) {
      sprayStatus = 'Unfavorable';
      sprayReason = `High wind speeds (${windSpeedKmH} km/h) will cause severe spray drift to non-target areas and uneven leaf coverage.`;
    } else if (temp > 35 || humidity < 30) {
      sprayStatus = 'Caution';
      sprayReason = `High temperature (${temp}°C) accelerates spray evaporation and risk of chemical leaf scorch. Spray only in late evening.`;
    } else if (humidity > 85) {
      sprayStatus = 'Caution';
      sprayReason = 'High humidity prolongs leaf wetness. Ensure surfactant is added for systemic fungicides.';
    }

    // Soil moisture estimation
    let soilMoisture: 'Dry' | 'Adequate' | 'Moist' | 'Saturated' = 'Adequate';
    if (rainfallMm > 15) soilMoisture = 'Saturated';
    else if (rainfallMm > 3) soilMoisture = 'Moist';
    else if (temp > 32 && humidity < 45) soilMoisture = 'Dry';

    // Irrigation advisory
    let irrigationAdvisory = 'Standard irrigation schedule appropriate. Check topsoil 2-inch moisture depth before pumping.';
    if (sprayStatus === 'Unfavorable' && rainProb > 60) {
      irrigationAdvisory = 'Suspend irrigation. Imminent natural precipitation will provide sufficient root zone moisture.';
    } else if (soilMoisture === 'Dry' || temp > 34) {
      irrigationAdvisory = 'High evapotranspiration loss detected. Provide light, frequent drip or furrow watering during morning hours.';
    }

    // 7-day forecast mapping
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecast = (daily.time || []).slice(0, 7).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr);
      const dayName = idx === 0 ? 'Today' : daysOfWeek[d.getDay()];
      const dCode = daily.weather_code?.[idx] ?? 0;
      const dRainProb = daily.precipitation_probability_max?.[idx] ?? 10;
      const dSpray = dRainProb > 45 ? 'Unfavorable' : dRainProb > 25 ? 'Caution' : 'Optimal';
      
      return {
        day: dayName,
        date: dateStr,
        tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? 30),
        tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? 20),
        rainProb: dRainProb,
        condition: interpretWmoCode(dCode).condition,
        sprayStatus: dSpray as 'Optimal' | 'Caution' | 'Unfavorable',
      };
    });

    return {
      city: cityName,
      state: stateName,
      temp,
      feelsLike,
      tempMin,
      tempMax,
      humidity,
      windSpeedKmH,
      rainfallMm,
      rainProbability: rainProb,
      uvIndex,
      condition,
      icon,
      soilMoistureEstimate: soilMoisture,
      sprayAdvisory: {
        status: sprayStatus,
        reason: sprayReason,
      },
      irrigationAdvisory,
      forecast,
    };
  } catch (err) {
    console.warn('Using resilient fallback agro-weather:', err);
    return getFallbackWeather(cityName, stateName);
  }
}

function interpretWmoCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Clear Sky / Sunny', icon: 'Sun' };
  if (code === 1 || code === 2) return { condition: 'Partly Cloudy', icon: 'CloudSun' };
  if (code === 3) return { condition: 'Overcast / Cloudy', icon: 'Cloud' };
  if (code === 45 || code === 48) return { condition: 'Dense Fog / Mist', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { condition: 'Light Drizzle', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { condition: 'Moderate Rain', icon: 'CloudRain' };
  if (code >= 71 && code <= 75) return { condition: 'Hail / Sleet', icon: 'CloudSnow' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: 'CloudRainWind' };
  if (code >= 95) return { condition: 'Thunderstorm with Rain', icon: 'CloudLightning' };
  return { condition: 'Fair Weather', icon: 'Sun' };
}

function getFallbackWeather(city: string, state: string): WeatherData {
  return {
    city,
    state,
    temp: 29,
    feelsLike: 31,
    tempMin: 22,
    tempMax: 33,
    humidity: 58,
    windSpeedKmH: 11,
    rainfallMm: 0,
    rainProbability: 15,
    uvIndex: 7,
    condition: 'Partly Cloudy',
    icon: 'CloudSun',
    soilMoistureEstimate: 'Adequate',
    sprayAdvisory: {
      status: 'Optimal',
      reason: 'Optimal window for fungicide and nutrient foliar spraying (Calm winds < 12 km/h, rain risk < 20%).',
    },
    irrigationAdvisory: 'Optimal soil moisture profile. Next scheduled irrigation cycle in 2 days.',
    forecast: [
      { day: 'Today', date: '2026-08-29', tempMax: 33, tempMin: 22, rainProb: 15, condition: 'Partly Cloudy', sprayStatus: 'Optimal' },
      { day: 'Sun', date: '2026-08-30', tempMax: 34, tempMin: 23, rainProb: 20, condition: 'Sunny', sprayStatus: 'Optimal' },
      { day: 'Mon', date: '2026-08-31', tempMax: 32, tempMin: 23, rainProb: 40, condition: 'Cloudy with Mist', sprayStatus: 'Caution' },
      { day: 'Tue', date: '2026-09-01', tempMax: 30, tempMin: 21, rainProb: 65, condition: 'Thunder Showers', sprayStatus: 'Unfavorable' },
      { day: 'Wed', date: '2026-09-02', tempMax: 31, tempMin: 22, rainProb: 30, condition: 'Scattered Clouds', sprayStatus: 'Optimal' },
      { day: 'Thu', date: '2026-09-03', tempMax: 33, tempMin: 23, rainProb: 10, condition: 'Clear Sky', sprayStatus: 'Optimal' },
      { day: 'Fri', date: '2026-09-04', tempMax: 34, tempMin: 24, rainProb: 15, condition: 'Sunny', sprayStatus: 'Optimal' },
    ],
  };
}
