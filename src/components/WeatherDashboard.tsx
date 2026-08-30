import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  CloudRain,
  Sun,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  RefreshCw,
  LocateFixed,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Language, WeatherData } from '../types';
import { POPULAR_AGRI_LOCATIONS, AgriLocation, fetchLiveAgriWeather } from '../services/weatherService';
import { getTranslation } from '../locales/translations';

interface WeatherDashboardProps {
  currentLang: Language;
  weatherData: WeatherData | null;
  onRefreshWeather: (location: AgriLocation) => Promise<void>;
  isLoading: boolean;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  currentLang,
  weatherData,
  onRefreshWeather,
  isLoading,
}) => {
  const [selectedLoc, setSelectedLoc] = useState<AgriLocation>(POPULAR_AGRI_LOCATIONS[0]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [allWeatherData, setAllWeatherData] = useState<Map<string, WeatherData>>(new Map());
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  const t = (key: string) => getTranslation(currentLang, key);

  // Fetch weather for all locations on mount and when language changes
  useEffect(() => {
    const fetchAllWeather = async () => {
      setLoadingLocations(true);
      const weatherMap = new Map<string, WeatherData>();
      
      for (const location of POPULAR_AGRI_LOCATIONS) {
        try {
          const weather = await fetchLiveAgriWeather(location.lat, location.lon, location.city, location.state);
          weatherMap.set(location.city, weather);
        } catch (error) {
          console.error(`Failed to fetch weather for ${location.city}:`, error);
        }
      }
      
      setAllWeatherData(weatherMap);
      setLoadingLocations(false);
    };

    fetchAllWeather();
  }, [currentLang]);

  const handleSelectLocation = async (loc: AgriLocation) => {
    setSelectedLoc(loc);
    await onRefreshWeather(loc);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const customLoc: AgriLocation = {
          city: 'My GPS Farm',
          state: 'Local',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          primaryCrops: ['Regional Crops'],
        };
        setSelectedLoc(customLoc);
        await onRefreshWeather(customLoc);
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS location error', err);
        setIsLocating(false);
        alert('Could not determine GPS coordinates. Please select your district from the list.');
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 text-[#a3b18a] text-xs uppercase tracking-widest font-semibold">
          <CloudSun className="w-3.5 h-3.5" />
          <span>Real-Time Hyper-local Agro-Meteorology</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-[#f2f2e8] font-serif">
          {t('weatherTitle')}
        </h2>
        <p className="text-sm sm:text-base text-[#f2f2e8]/70 max-w-3xl mx-auto font-light">
          {t('weatherSubtitle')}
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all ${
            viewMode === 'grid'
              ? 'bg-[#a3b18a] text-[#0a110a] shadow-md'
              : 'bg-[#141d14] hover:bg-[#1a241a] text-[#f2f2e8]/70 border border-[#a3b18a]/20'
          }`}
        >
          All Locations ({allWeatherData.size})
        </button>
        <button
          onClick={() => setViewMode('detail')}
          className={`px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all ${
            viewMode === 'detail'
              ? 'bg-[#a3b18a] text-[#0a110a] shadow-md'
              : 'bg-[#141d14] hover:bg-[#1a241a] text-[#f2f2e8]/70 border border-[#a3b18a]/20'
          }`}
        >
          Detailed View
        </button>
      </div>

      {/* Grid View - All Locations */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          {loadingLocations ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-[#a3b18a]">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading weather for all locations...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {POPULAR_AGRI_LOCATIONS.map((location) => {
                const weather = allWeatherData.get(location.city);
                
                if (!weather) {
                  return (
                    <div
                      key={location.city}
                      className="p-4 rounded-xl bg-[#121b12] border border-red-600/30 text-center text-red-300/70 text-xs"
                    >
                      <p className="font-semibold">{location.city}, {location.state}</p>
                      <p className="text-[11px] mt-1">Failed to load weather data</p>
                    </div>
                  );
                }

                return (
                  <div
                    key={location.city}
                    onClick={() => {
                      setSelectedLoc(location);
                      setViewMode('detail');
                    }}
                    className="p-4 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 hover:border-[#a3b18a]/50 cursor-pointer hover:shadow-lg transition-all space-y-3"
                  >
                    <div>
                      <p className="font-bold text-sm text-[#a3b18a]">{location.city}</p>
                      <p className="text-[11px] text-[#f2f2e8]/50">{location.state}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-[#f2f2e8]">
                        {weather.temp}°C
                      </div>
                      <p className="text-[10px] text-[#f2f2e8]/70">{weather.condition}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center gap-1 text-[#f2f2e8]/60">
                        <Wind className="w-3 h-3 text-[#a3b18a]" />
                        <span>{weather.windSpeedKmH} km/h</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#f2f2e8]/60">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        <span>{weather.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#f2f2e8]/60">
                        <CloudRain className="w-3 h-3 text-blue-400" />
                        <span>{weather.rainProbability}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#f2f2e8]/60">
                        <Thermometer className="w-3 h-3 text-amber-400" />
                        <span>{weather.tempMax}°/{weather.tempMin}°</span>
                      </div>
                    </div>

                    <div className={`text-[10px] font-bold px-2 py-1 rounded text-center uppercase tracking-wider ${
                      weather.sprayAdvisory.status === 'Optimal'
                        ? 'bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/30'
                        : weather.sprayAdvisory.status === 'Caution'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {weather.sprayAdvisory.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Detail View - Selected Location */}
      {viewMode === 'detail' && (
        <div className="space-y-6">
          {/* District Selector & GPS Button */}
          <div className="p-5 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#a3b18a] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#a3b18a]" />
                <span>Select Agricultural District:</span>
              </div>

              <button
                onClick={handleUseGPS}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] font-semibold transition-colors self-start sm:self-auto uppercase tracking-wider text-[11px]"
              >
                <LocateFixed className={`w-3.5 h-3.5 text-[#a3b18a] ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'Use My GPS Farm Location'}</span>
              </button>
            </div>

            {/* Quick District Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
              {POPULAR_AGRI_LOCATIONS.map((loc) => {
                const isSelected = selectedLoc.city === loc.city;
                return (
                  <button
                    key={loc.city}
                    onClick={() => handleSelectLocation(loc)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'bg-[#a3b18a] text-[#0a110a] font-bold shadow-md'
                        : 'bg-[#0a110a] hover:bg-[#1a241a] text-[#f2f2e8]/70 border border-[#a3b18a]/20'
                    }`}
                  >
                    {loc.city} ({loc.state})
                  </button>
                );
              })}
            </div>
          </div>

          {weatherData && (
        <div className="space-y-6">
          {/* Main Weather Metric Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Current Weather Card */}
            <div className="lg:col-span-7 p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a3b18a]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{weatherData.city}, {weatherData.state}</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-light font-serif text-[#f2f2e8] mt-1">
                    {weatherData.temp}°C
                  </h3>
                  <p className="text-xs text-[#f2f2e8]/70 mt-0.5 font-light">
                    {weatherData.condition} • Feels like {weatherData.feelsLike}°C
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-[#f2f2e8]/50">Day Range</div>
                  <div className="text-sm font-bold text-[#f2f2e8] font-mono">
                    <span className="text-red-400">↑{weatherData.tempMax}°</span>{' '}
                    <span className="text-blue-400">↓{weatherData.tempMin}°</span>
                  </div>
                  <div className="text-[11px] text-[#a3b18a] mt-1 font-mono">
                    UV Index: {weatherData.uvIndex}
                  </div>
                </div>
              </div>

              {/* 4 Micro Weather Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-1">
                  <div className="flex items-center gap-1 text-[#f2f2e8]/60 text-[11px]">
                    <Droplets className="w-3.5 h-3.5 text-[#a3b18a]" />
                    <span>{t('humidity')}</span>
                  </div>
                  <p className="text-base font-bold text-[#f2f2e8] font-mono">{weatherData.humidity}%</p>
                </div>

                <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-1">
                  <div className="flex items-center gap-1 text-[#f2f2e8]/60 text-[11px]">
                    <Wind className="w-3.5 h-3.5 text-[#a3b18a]" />
                    <span>{t('windSpeed')}</span>
                  </div>
                  <p className="text-base font-bold text-[#f2f2e8] font-mono">{weatherData.windSpeedKmH} km/h</p>
                </div>

                <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-1">
                  <div className="flex items-center gap-1 text-[#f2f2e8]/60 text-[11px]">
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('rainProb')}</span>
                  </div>
                  <p className="text-base font-bold text-[#f2f2e8] font-mono">{weatherData.rainProbability}%</p>
                </div>

                <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-1">
                  <div className="flex items-center gap-1 text-[#f2f2e8]/60 text-[11px]">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Soil Moisture</span>
                  </div>
                  <p className="text-base font-bold text-[#a3b18a]">{weatherData.soilMoistureEstimate}</p>
                </div>
              </div>

              {/* District Primary Crops Context */}
              {selectedLoc.primaryCrops && (
                <div className="pt-2 flex items-center gap-2 text-xs border-t border-[#a3b18a]/20">
                  <span className="text-[#f2f2e8]/50 text-[11px]">Major District Crops:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedLoc.primaryCrops.map((crop, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#141d14] border border-[#a3b18a]/20 text-[#a3b18a] text-[11px]">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Spray Window & Irrigation Advisory Card */}
            <div className="lg:col-span-5 space-y-4">
              {/* Spray Advisory */}
              <div className={`p-5 rounded-xl border shadow-2xl space-y-3 ${
                weatherData.sprayAdvisory.status === 'Optimal'
                  ? 'bg-[#121b12] border-[#a3b18a]/40 text-[#f2f2e8]'
                  : weatherData.sprayAdvisory.status === 'Caution'
                  ? 'bg-amber-950/30 border-amber-600/40 text-amber-100'
                  : 'bg-red-950/30 border-red-600/40 text-red-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {weatherData.sprayAdvisory.status === 'Optimal' ? (
                      <ShieldCheck className="w-5 h-5 text-[#a3b18a]" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="font-semibold text-xs uppercase tracking-wider">
                      {t('sprayAdvisoryTitle')}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${
                    weatherData.sprayAdvisory.status === 'Optimal'
                      ? 'bg-[#a3b18a] text-[#0a110a]'
                      : weatherData.sprayAdvisory.status === 'Caution'
                      ? 'bg-amber-500 text-black'
                      : 'bg-red-600 text-white'
                  }`}>
                    {weatherData.sprayAdvisory.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#f2f2e8]/80 font-light">
                  {weatherData.sprayAdvisory.reason}
                </p>
              </div>

              {/* Irrigation Advisory */}
              <div className="p-5 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-2xl space-y-2 text-[#f2f2e8]">
                <div className="flex items-center gap-2 text-[#a3b18a] font-semibold text-xs uppercase tracking-wider">
                  <Droplets className="w-4 h-4 text-[#a3b18a]" />
                  <span>{t('irrigationAdvice')}</span>
                </div>
                <p className="text-xs text-[#f2f2e8]/80 leading-relaxed font-light">
                  {weatherData.irrigationAdvisory}
                </p>
              </div>
            </div>
          </div>

          {/* 7-Day Agricultural Forecast Table */}
          <div className="p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-light font-serif text-[#f2f2e8] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#a3b18a]" />
                <span>{t('forecast7Days')}</span>
              </h3>
              <span className="text-[11px] uppercase tracking-wider text-[#f2f2e8]/40">Open-Meteo Global Agro Model</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weatherData.forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-center space-y-2"
                >
                  <p className="font-bold text-xs uppercase tracking-wider text-[#a3b18a]">{day.day}</p>
                  <p className="text-[10px] text-[#f2f2e8]/40">{day.date.split('-').slice(1).join('/')}</p>
                  
                  <div className="py-1">
                    <CloudSun className="w-6 h-6 text-[#a3b18a] mx-auto" />
                  </div>

                  <div className="text-xs font-mono font-bold text-[#f2f2e8]">
                    <span className="text-red-300">{day.tempMax}°</span>{' '}
                    <span className="text-[#f2f2e8]/30 font-normal">/</span>{' '}
                    <span className="text-blue-300">{day.tempMin}°</span>
                  </div>

                  <div className="text-[10px] text-[#f2f2e8]/60">
                    <CloudRain className="w-3 h-3 text-blue-400 inline mr-1" />
                    <span>{day.rainProb}%</span>
                  </div>

                  <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    day.sprayStatus === 'Optimal'
                      ? 'bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/30'
                      : day.sprayStatus === 'Caution'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {day.sprayStatus === 'Optimal' ? 'Spray OK' : day.sprayStatus === 'Caution' ? 'Caution' : 'No Spray'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          )}
        </div>
      )}
    </div>
  );
};
