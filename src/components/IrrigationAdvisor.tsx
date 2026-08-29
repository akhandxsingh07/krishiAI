import React, { useState, useEffect } from 'react';
import { Droplets, Calculator, Sparkles, Sprout, CheckCircle2, TrendingDown, Clock, Layers, ArrowRight } from 'lucide-react';
import { IrrigationPlan, Language, WeatherData } from '../types';
import { getTranslation } from '../locales/translations';

interface IrrigationAdvisorProps {
  currentLang: Language;
  weatherData: WeatherData | null;
}

export const IrrigationAdvisor: React.FC<IrrigationAdvisorProps> = ({ currentLang, weatherData }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [growthStage, setGrowthStage] = useState<string>('Vegetative');
  const [soilType, setSoilType] = useState<string>('Alluvial');
  const [acres, setAcres] = useState<number>(2);
  const [irrigationPlan, setIrrigationPlan] = useState<IrrigationPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // NPK Calculator State
  const [npkCrop, setNpkCrop] = useState<string>('Wheat');
  const [npkAcres, setNpkAcres] = useState<number>(2);

  const t = (key: string) => getTranslation(currentLang, key);

  const calculateIrrigation = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/irrigation-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop,
          growthStage,
          soilType,
          acres,
          temp: weatherData?.temp || 30,
          rainfallForecastMm: weatherData?.rainfallMm || 0,
        }),
      });

      if (!res.ok) throw new Error('Failed to calculate');
      const data: IrrigationPlan = await res.json();
      setIrrigationPlan(data);
    } catch (e) {
      console.warn('Calculating client fallback', e);
      // Fallback calculation
      const baseMap: Record<string, number> = { Wheat: 11000, 'Rice / Paddy': 22000, Cotton: 14000, Sugarcane: 25000, Tomato: 9500 };
      const water = (baseMap[selectedCrop] || 10000) * acres;
      setIrrigationPlan({
        crop: selectedCrop,
        growthStage,
        soilType,
        acres,
        waterRequiredLitersPerDay: water,
        irrigationFrequencyHours: 24,
        dripRunTimeHours: Number((water / (10000 * acres)).toFixed(1)),
        floodIrrigationHours: Number((water / (40000 * acres)).toFixed(1)),
        recommendation: `Apply ${water.toLocaleString()} Liters per day for optimal canopy growth.`,
        savingsVsTraditionalPct: 38,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    calculateIrrigation();
  }, [selectedCrop, growthStage, soilType, acres]);

  // NPK Fertilizer Dosage Database (kg per acre according to ICAR recommendations)
  const npkGuidelines: Record<
    string,
    { ureaKg: number; dapKg: number; mopKg: number; zincKg: number; splits: string }
  > = {
    Wheat: {
      ureaKg: 110,
      dapKg: 55,
      mopKg: 20,
      zincKg: 10,
      splits: 'Apply full DAP, MOP & 1/3 Urea at sowing; 1/3 Urea at 1st CRI watering (21 days); 1/3 Urea at tillering.',
    },
    'Rice / Paddy': {
      ureaKg: 110,
      dapKg: 45,
      mopKg: 25,
      zincKg: 10,
      splits: 'Apply full DAP, MOP + 1/3rd Urea as basal; 1/3rd Urea at tillering (21 DAT); 1/3rd Urea at panicle initiation.',
    },
    Cotton: {
      ureaKg: 130,
      dapKg: 50,
      mopKg: 30,
      zincKg: 10,
      splits: 'Split Urea into 3 equal doses: at thinning, square initiation, and peak flowering.',
    },
    Sugarcane: {
      ureaKg: 220,
      dapKg: 85,
      mopKg: 60,
      zincKg: 15,
      splits: 'Apply in 4 split doses: basal planting, 45 DAP, 90 DAP, and final earthing-up (120 DAP).',
    },
    Tomato: {
      ureaKg: 85,
      dapKg: 65,
      mopKg: 40,
      zincKg: 5,
      splits: 'Apply half N, full P and K at bed preparation; top dress remaining N in 3 split doses.',
    },
    Potato: {
      ureaKg: 130,
      dapKg: 80,
      mopKg: 50,
      zincKg: 10,
      splits: 'Apply 1/2 N + full P & K at planting; remaining 1/2 N during earthing-up (30-35 DAP).',
    },
    Maize: {
      ureaKg: 100,
      dapKg: 50,
      mopKg: 20,
      zincKg: 10,
      splits: '1/3 N + full P & K at sowing; 1/3 N at knee-high stage (V6); 1/3 N at tasseling stage.',
    },
    Mustard: {
      ureaKg: 65,
      dapKg: 35,
      mopKg: 15,
      zincKg: 8,
      splits: '1/2 N + full P, K & Sulphur (20kg/ac) at sowing; remaining 1/2 N at first irrigation (30 DAS).',
    },
  };

  const currentNpk = npkGuidelines[npkCrop] || npkGuidelines.Wheat;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 text-[#a3b18a] text-xs uppercase tracking-widest font-semibold">
          <Droplets className="w-3.5 h-3.5" />
          <span>Smart Agronomy & Water Optimization</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-[#f2f2e8] font-serif">
          {t('irrigationTitle')}
        </h2>
        <p className="text-sm sm:text-base text-[#f2f2e8]/70 max-w-3xl mx-auto font-light">
          {t('irrigationSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Irrigation Parameter Inputs */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-2xl space-y-4">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-[#a3b18a] flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#a3b18a]" />
            <span>Farm & Crop Parameters</span>
          </h3>

          {/* Crop Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a3b18a] uppercase tracking-wider text-[11px]">Select Crop:</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] focus:outline-none focus:border-[#a3b18a]"
            >
              <option value="Wheat">Wheat (गेहूँ)</option>
              <option value="Rice / Paddy">Rice / Paddy (धान)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Sugarcane">Sugarcane (गन्ना)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Maize">Maize (मक्का)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Groundnut">Groundnut (मूंगफली)</option>
              <option value="Chilli">Chilli (मिर्च)</option>
            </select>
          </div>

          {/* Growth Stage */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a3b18a] uppercase tracking-wider text-[11px]">Current Growth Stage:</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] focus:outline-none focus:border-[#a3b18a]"
            >
              <option value="Germination">Germination / Seedling (अंकुरण)</option>
              <option value="Vegetative">Vegetative Growth / Tillering (वानस्पतिक वृद्धि)</option>
              <option value="Flowering">Flowering / Booting (फूल व बाली अवस्था)</option>
              <option value="Fruiting / Grain filling">Fruiting / Grain Filling (दाना भराव)</option>
              <option value="Maturity">Maturity / Ripening (पकाव अवस्था)</option>
            </select>
          </div>

          {/* Soil Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#a3b18a] uppercase tracking-wider text-[11px]">Soil Texture & Type:</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] focus:outline-none focus:border-[#a3b18a]"
            >
              <option value="Alluvial">Alluvial Loam Soil (दोमट मिट्टी)</option>
              <option value="Black">Black Cotton Soil / Regur (काली मिट्टी)</option>
              <option value="Clayey">Clayey Heavy Soil (चिकनी मिट्टी)</option>
              <option value="Sandy Loam">Sandy Loam Light Soil (बलुई दोमट)</option>
              <option value="Red">Red Soil (लाल मिट्टी)</option>
              <option value="Laterite">Laterite Soil (लेटराइट)</option>
            </select>
          </div>

          {/* Land Acreage Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#f2f2e8]/70 uppercase tracking-wider text-[11px]">Total Farm Area:</span>
              <span className="font-bold text-[#a3b18a] font-mono text-sm">{acres} Acre(s)</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={25}
              step={0.5}
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value))}
              className="w-full accent-[#a3b18a] bg-[#0a110a]"
            />
            <div className="flex justify-between text-[10px] text-[#f2f2e8]/40">
              <span>0.5 Acre</span>
              <span>10 Acres</span>
              <span>25 Acres</span>
            </div>
          </div>

          {/* Live weather sync chip */}
          {weatherData && (
            <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-[11px] text-[#f2f2e8]/80 space-y-1">
              <div className="flex items-center justify-between font-semibold text-[#a3b18a]">
                <span className="uppercase tracking-wider text-[10px]">Live Weather Sync:</span>
                <span>{weatherData.city} ({weatherData.temp}°C)</span>
              </div>
              <p className="text-[10px] text-[#f2f2e8]/50">
                Forecasted Rain: {weatherData.rainfallMm}mm • Soil Moisture: {weatherData.soilMoistureEstimate}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Calculated Water Schedule & Savings */}
        <div className="lg:col-span-7 space-y-6">
          {irrigationPlan && (
            <div className="p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/30 shadow-2xl space-y-6 text-[#f2f2e8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#a3b18a]/20 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#a3b18a] uppercase tracking-widest">
                    Recommended Water Dosage
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light font-serif text-[#f2f2e8] font-mono">
                    {irrigationPlan.waterRequiredLitersPerDay.toLocaleString()} Liters / Day
                  </h3>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#a3b18a]/20 border border-[#a3b18a]/30 text-[#a3b18a] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider text-[11px]">
                  <TrendingDown className="w-4 h-4" />
                  <span>Saves ~{irrigationPlan.savingsVsTraditionalPct}% Groundwater</span>
                </div>
              </div>

              {/* Drip vs Flood Runtime breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Drip Card */}
                <div className="p-4 rounded-lg bg-[#141d14] border border-[#a3b18a]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#a3b18a] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Drip Irrigation Runtime</span>
                    </span>
                    <span className="text-[9px] bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/30 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                      Recommended
                    </span>
                  </div>
                  <p className="text-2xl font-light font-serif text-[#f2f2e8] font-mono">
                    {irrigationPlan.dripRunTimeHours} Hours
                  </p>
                  <p className="text-[11px] text-[#f2f2e8]/60 font-light">
                    Run during early morning (6:00 AM - 9:00 AM) to minimize evaporation.
                  </p>
                </div>

                {/* Flood Card */}
                <div className="p-4 rounded-lg bg-[#141d14] border border-[#a3b18a]/15 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#f2f2e8]/70 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-[#f2f2e8]/50" />
                      <span>Surface / Furrow Flood</span>
                    </span>
                    <span className="text-[9px] text-[#f2f2e8]/40 uppercase tracking-wider">Conventional</span>
                  </div>
                  <p className="text-2xl font-light font-serif text-[#f2f2e8]/60 font-mono">
                    {irrigationPlan.floodIrrigationHours} Hours
                  </p>
                  <p className="text-[11px] text-[#f2f2e8]/50 font-light">
                    Cycle every {irrigationPlan.irrigationFrequencyHours} hours depending on root depth.
                  </p>
                </div>
              </div>

              {/* Agronomic Advice Statement */}
              <div className="p-4 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-xs text-[#f2f2e8]/90 space-y-1 font-light">
                <p className="font-semibold text-[#a3b18a] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Sprout className="w-4 h-4 text-[#a3b18a]" />
                  <span>Stage-Specific Water Advisory:</span>
                </p>
                <p className="leading-relaxed">{irrigationPlan.recommendation}</p>
              </div>
            </div>
          )}

          {/* Integrated NPK & Fertilizer Dosage Calculator */}
          <div className="p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-light font-serif text-[#f2f2e8] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#a3b18a]" />
                  <span>Fertilizer (NPK) Calculator per Field Area</span>
                </h3>
                <p className="text-xs text-[#f2f2e8]/60 font-light">
                  Calculated based on ICAR recommended state fertilizer ratios.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3b18a]">Urea (46% N)</span>
                <p className="text-lg font-bold text-[#f2f2e8] font-mono">
                  {Math.round(currentNpk.ureaKg * acres)} kg
                </p>
                <p className="text-[10px] text-[#f2f2e8]/40">{Math.round((currentNpk.ureaKg * acres) / 45)} Bags (45kg)</p>
              </div>

              <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3b18a]">DAP (18:46:0)</span>
                <p className="text-lg font-bold text-[#f2f2e8] font-mono">
                  {Math.round(currentNpk.dapKg * acres)} kg
                </p>
                <p className="text-[10px] text-[#f2f2e8]/40">{Math.round((currentNpk.dapKg * acres) / 50)} Bags (50kg)</p>
              </div>

              <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3b18a]">MOP (60% K)</span>
                <p className="text-lg font-bold text-[#f2f2e8] font-mono">
                  {Math.round(currentNpk.mopKg * acres)} kg
                </p>
                <p className="text-[10px] text-[#f2f2e8]/40">{Math.round((currentNpk.mopKg * acres) / 50)} Bags (50kg)</p>
              </div>

              <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3b18a]">Zinc Sulphate</span>
                <p className="text-lg font-bold text-[#f2f2e8] font-mono">
                  {Math.round(currentNpk.zincKg * acres)} kg
                </p>
                <p className="text-[10px] text-[#f2f2e8]/40">Micro-nutrient</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0a110a] border border-[#a3b18a]/20 text-xs text-[#f2f2e8]/80 font-light">
              <span className="font-semibold text-[#a3b18a]">Application Schedule: </span>
              {currentNpk.splits}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
