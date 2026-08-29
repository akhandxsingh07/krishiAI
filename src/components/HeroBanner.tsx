import React from 'react';
import { Scan, CloudSun, BookOpen, Droplets, ArrowRight, ShieldCheck, Cpu, Mic, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../locales/translations';

interface HeroBannerProps {
  currentLang: Language;
  onSelectTab: (tab: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ currentLang, onSelectTab }) => {
  const t = (key: string) => getTranslation(currentLang, key);

  const mandiPrices = [
    { crop: 'Wheat (गेहूँ)', price: '₹2,275 / qtl', change: '+₹150 (MSP)', trend: 'up' },
    { crop: 'Paddy / Rice (धान)', price: '₹2,320 / qtl', change: '+₹117 (MSP)', trend: 'up' },
    { crop: 'Cotton (कपास)', price: '₹7,121 / qtl', change: '+₹501 (MSP)', trend: 'up' },
    { crop: 'Mustard (सरसों)', price: '₹5,650 / qtl', change: '+₹200 (MSP)', trend: 'up' },
    { crop: 'Soybean (सोयाबीन)', price: '₹4,892 / qtl', change: '+₹292 (MSP)', trend: 'up' },
    { crop: 'Sugarcane (गन्ना FRP)', price: '₹340 / qtl', change: '+₹25', trend: 'up' },
    { crop: 'Tomato (टमाटर)', price: '₹1,850 / qtl', change: 'Market Avg', trend: 'up' },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0a110a] border-b border-[#a3b18a]/20 text-[#f2f2e8]">
      {/* Background Subtle Ambient Highlights */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#a3b18a]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-[#a3b18a]/5 blur-3xl pointer-events-none" />

      {/* Top Mandi & Advisory Ticker */}
      <div className="bg-[#141d14] border-b border-[#a3b18a]/20 py-2.5 overflow-hidden text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-[#a3b18a] uppercase tracking-wider text-[11px] whitespace-nowrap">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Kisan Mandi Rates:</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 text-[#f2f2e8]/80">
            {mandiPrices.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 whitespace-nowrap text-xs">
                <span className="font-medium text-[#f2f2e8]/70">{item.crop}:</span>
                <span className="text-[#a3b18a] font-semibold">{item.price}</span>
                <span className="text-[10px] text-[#f2f2e8]/60 font-mono bg-[#0a110a] px-1.5 py-0.5 rounded border border-[#a3b18a]/20">
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 text-[#a3b18a] text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#a3b18a]" />
              <span>AI Vision + Real-Time Agro Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-light text-[#f2f2e8] font-serif leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-[#f2f2e8]/70 max-w-2xl leading-relaxed font-light">
              {t('heroSubtitle')}
            </p>

            {/* Badges / Differentiators matching Slide 1 & Slide 3 */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-xs text-[#f2f2e8]/90">
                <ShieldCheck className="w-4 h-4 text-[#a3b18a]" />
                <span>ICAR Guided Diagnoses</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-xs text-[#f2f2e8]/90">
                <Mic className="w-4 h-4 text-[#a3b18a]" />
                <span>Voice in 10+ Indian Languages</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-xs text-[#f2f2e8]/90">
                <Cpu className="w-4 h-4 text-[#a3b18a]" />
                <span>Instant Image Vision Engine</span>
              </div>
            </div>

            {/* Main CTA buttons */}
            <div className="flex flex-wrap gap-3 pt-3">
              <button
                id="hero-scan-cta-btn"
                onClick={() => onSelectTab('scan')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] font-bold text-xs uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <Scan className="w-4 h-4" />
                <span>{t('btnScanNow')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="hero-weather-cta-btn"
                onClick={() => onSelectTab('weather')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#141d14] hover:bg-[#1a241a] text-[#f2f2e8] font-semibold text-xs uppercase tracking-widest border border-[#a3b18a]/30 transition-all"
              >
                <CloudSun className="w-4 h-4 text-[#a3b18a]" />
                <span>{t('btnCheckWeather')}</span>
              </button>
            </div>
          </div>

          {/* Right Visual: Mobile Mockup representation in Sophisticated Dark style */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Phone Mockup Frame */}
              <div className="rounded-[2rem] bg-[#121b12] p-4 shadow-2xl border-2 border-[#a3b18a]/30 relative">
                <div className="w-20 h-3 bg-[#1a241a] rounded-full mx-auto mb-3" />

                <div className="rounded-xl bg-[#0a110a] p-4 border border-[#a3b18a]/20 space-y-3 text-xs">
                  {/* Top Phone Header */}
                  <div className="flex items-center justify-between border-b border-[#a3b18a]/20 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#a3b18a]" />
                      <span className="font-bold text-[#f2f2e8] uppercase tracking-wider text-[11px]">KrishiAI Assistant</span>
                    </div>
                    <span className="text-[10px] uppercase text-[#a3b18a]/80 font-mono">Live Active</span>
                  </div>

                  {/* Crop Scan Preview Card */}
                  <div
                    onClick={() => onSelectTab('scan')}
                    className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/30 cursor-pointer hover:bg-[#1a241a] transition-colors"
                  >
                    <div className="flex items-center justify-between text-[#a3b18a] font-semibold mb-1">
                      <div className="flex items-center gap-1.5">
                        <Scan className="w-3.5 h-3.5 text-[#a3b18a]" />
                        <span className="text-xs">A. Crop Scan (AI Vision)</span>
                      </div>
                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#a3b18a] px-1.5 py-0.5 rounded font-mono">94% match</span>
                    </div>
                    <p className="text-[11px] text-[#f2f2e8]/70">
                      Rice Leaf Blast detected • Tricyclazole 75% WP @ 0.6g/L recommended
                    </p>
                  </div>

                  {/* Weather Alert Card */}
                  <div
                    onClick={() => onSelectTab('weather')}
                    className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/30 cursor-pointer hover:bg-[#1a241a] transition-colors"
                  >
                    <div className="flex items-center justify-between text-[#a3b18a] font-semibold mb-1">
                      <div className="flex items-center gap-1.5">
                        <CloudSun className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-xs">D. Weather & Spray Alert</span>
                      </div>
                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#a3b18a] px-1.5 py-0.5 rounded font-mono">Optimal</span>
                    </div>
                    <p className="text-[11px] text-[#f2f2e8]/70">
                      Calm winds (8 km/h), rain risk 15%. Safe for fungicide foliar spray until 4 PM.
                    </p>
                  </div>

                  {/* Irrigation Card */}
                  <div
                    onClick={() => onSelectTab('irrigation')}
                    className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/30 cursor-pointer hover:bg-[#1a241a] transition-colors"
                  >
                    <div className="flex items-center justify-between text-[#a3b18a] font-semibold mb-1">
                      <div className="flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-[#a3b18a]" />
                        <span className="text-xs">E. Smart Irrigation Advice</span>
                      </div>
                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#a3b18a] px-1.5 py-0.5 rounded font-mono">Save 38%</span>
                    </div>
                    <p className="text-[11px] text-[#f2f2e8]/70">
                      Wheat vegetative stage: Apply 2.2 hrs drip irrigation tomorrow morning.
                    </p>
                  </div>

                  {/* Chat Action */}
                  <button
                    onClick={() => onSelectTab('chatbot')}
                    className="w-full py-2 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Ask Krishi Saathi in Voice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Core Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <div
            id="card-crop-scan"
            onClick={() => onSelectTab('scan')}
            className="disease-card p-5 rounded-xl custom-glass border border-soft cursor-pointer transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-[#a3b18a]/15 border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a] mb-3">
              <Scan className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#f2f2e8] mb-1">1. Crop Disease Scan</h3>
            <p className="text-xs text-[#f2f2e8]/60 leading-relaxed font-light">
              Upload leaf photo for instant AI vision diagnosis, pathogen identification, and chemical/organic remedies.
            </p>
          </div>

          <div
            id="card-agri-weather"
            onClick={() => onSelectTab('weather')}
            className="disease-card p-5 rounded-xl custom-glass border border-soft cursor-pointer transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-[#a3b18a]/15 border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a] mb-3">
              <CloudSun className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#f2f2e8] mb-1">2. Weather & Spray Alert</h3>
            <p className="text-xs text-[#f2f2e8]/60 leading-relaxed font-light">
              Real-time agro-meteorology, rainfall probability, and smart pesticide spray safety windows for your district.
            </p>
          </div>

          <div
            id="card-disease-atlas"
            onClick={() => onSelectTab('diseases')}
            className="disease-card p-5 rounded-xl custom-glass border border-soft cursor-pointer transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-[#a3b18a]/15 border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a] mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#f2f2e8] mb-1">3. Major Disease Atlas</h3>
            <p className="text-xs text-[#f2f2e8]/60 leading-relaxed font-light">
              Comprehensive scientific directory of 30+ Indian crop diseases across Rice, Wheat, Cotton, Tomato, Potato & more.
            </p>
          </div>

          <div
            id="card-smart-irrigation"
            onClick={() => onSelectTab('irrigation')}
            className="disease-card p-5 rounded-xl custom-glass border border-soft cursor-pointer transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-[#a3b18a]/15 border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a] mb-3">
              <Droplets className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#f2f2e8] mb-1">4. Smart Irrigation & NPK</h3>
            <p className="text-xs text-[#f2f2e8]/60 leading-relaxed font-light">
              Calculate precise water needs in liters & hours of drip irrigation, plus balanced fertilizer dosages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
