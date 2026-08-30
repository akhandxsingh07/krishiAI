import React from 'react';
import {
  Scan,
  CloudSun,
  BookOpen,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Mic,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../locales/translations';

interface HeroBannerProps {
  currentLang: Language;
  onSelectTab: (tab: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentLang,
  onSelectTab,
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  const mandiPrices = [
    {
      crop: 'Wheat (गेहूँ)',
      price: '₹2,275 / qtl',
      change: '+₹150 (MSP)',
    },
    {
      crop: 'Paddy / Rice (धान)',
      price: '₹2,320 / qtl',
      change: '+₹117 (MSP)',
    },
    {
      crop: 'Cotton (कपास)',
      price: '₹7,121 / qtl',
      change: '+₹501 (MSP)',
    },
    {
      crop: 'Mustard (सरसों)',
      price: '₹5,650 / qtl',
      change: '+₹200 (MSP)',
    },
    {
      crop: 'Soybean (सोयाबीन)',
      price: '₹4,892 / qtl',
      change: '+₹292 (MSP)',
    },
    {
      crop: 'Sugarcane (गन्ना FRP)',
      price: '₹340 / qtl',
      change: '+₹25',
    },
    {
      crop: 'Tomato (टमाटर)',
      price: '₹1,850 / qtl',
      change: 'Market Avg',
    },
  ];

  return (
    <div className="relative overflow-hidden text-[#203020]">

      {/* =====================================================
          REAL AERIAL AGRICULTURAL FIELD BACKGROUND
          ===================================================== */}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(247,248,232,0.94) 0%,
              rgba(247,248,232,0.84) 35%,
              rgba(247,248,232,0.55) 62%,
              rgba(247,248,232,0.28) 100%
            ),
            linear-gradient(
              180deg,
              rgba(250,250,235,0.40) 0%,
              rgba(229,239,211,0.20) 55%,
              rgba(110,145,73,0.32) 100%
            ),
            url("https://upload.wikimedia.org/wikipedia/commons/5/52/Aerial_view_of_agricultural_fields_in_Punjab%2C_India.jpg")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* =====================================================
          SOFT WHITE READABILITY LAYER
          ===================================================== */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(250,250,238,0.88) 0%, rgba(250,250,238,0.62) 48%, rgba(250,250,238,0.18) 100%)',
        }}
      />

      {/* =====================================================
          SOFT GREEN FIELD ATMOSPHERE
          ===================================================== */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 80% 75%, rgba(61,111,52,0.22), transparent 42%)',
        }}
      />

      {/* =====================================================
          SUBTLE AI GRID
          ===================================================== */}

      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(45,90,50,0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(45,90,50,0.08) 1px,
              transparent 1px
            )
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* =====================================================
          TOP MANDI TICKER
          ===================================================== */}

      <div className="relative z-20 bg-[#f4f5e7]/90 backdrop-blur-md border-b border-[#647753]/25 py-2.5 overflow-hidden text-xs">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">

          <div className="flex items-center gap-1.5 font-bold text-[#4f6d42] uppercase tracking-wider text-[11px] whitespace-nowrap">

            <TrendingUp className="w-3.5 h-3.5" />

            <span>Kisan Mandi Rates:</span>

          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">

            {mandiPrices.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 whitespace-nowrap text-xs"
              >

                <span className="font-medium text-[#344331]/80">
                  {item.crop}:
                </span>

                <span className="text-[#4e713f] font-bold">
                  {item.price}
                </span>

                <span className="text-[10px] text-[#52614c] font-mono bg-white/70 px-1.5 py-0.5 rounded border border-[#71815b]/20">
                  {item.change}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN HERO CONTENT
          ===================================================== */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">


          {/* =================================================
              LEFT CONTENT
              ================================================= */}

          <div className="lg:col-span-7 space-y-5">

            {/* AI badge */}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/75 backdrop-blur-md border border-[#627853]/35 text-[#49673c] text-xs uppercase tracking-widest font-semibold shadow-sm">

              <Sparkles className="w-3.5 h-3.5" />

              <span>
                AI Vision + Real-Time Agro Intelligence
              </span>

            </div>


            {/* Main heading */}

            <h1 className="text-3xl sm:text-5xl font-light text-[#1d2d1c] font-serif leading-tight drop-shadow-sm">

              {t('heroTitle')}

            </h1>


            {/* Subtitle */}

            <p className="text-base sm:text-lg text-[#344532] max-w-2xl leading-relaxed font-light">

              {t('heroSubtitle')}

            </p>


            {/* =================================================
                FEATURE BADGES
                ================================================= */}

            <div className="flex flex-wrap gap-2 pt-2">

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/75 backdrop-blur-md border border-[#71845c]/25 text-xs text-[#344532] shadow-sm">

                <ShieldCheck className="w-4 h-4 text-[#557846]" />

                <span>
                  ICAR Guided Diagnoses
                </span>

              </div>


              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/75 backdrop-blur-md border border-[#71845c]/25 text-xs text-[#344532] shadow-sm">

                <Mic className="w-4 h-4 text-[#557846]" />

                <span>
                  Voice in 10+ Indian Languages
                </span>

              </div>


              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/75 backdrop-blur-md border border-[#71845c]/25 text-xs text-[#344532] shadow-sm">

                <Cpu className="w-4 h-4 text-[#557846]" />

                <span>
                  Instant Image Vision Engine
                </span>

              </div>

            </div>


            {/* =================================================
                BUTTONS
                ================================================= */}

            <div className="flex flex-wrap gap-3 pt-3">

              <button
                id="hero-scan-cta-btn"
                onClick={() => onSelectTab('scan')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#557844] hover:bg-[#456636] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-0.5"
              >

                <Scan className="w-4 h-4" />

                <span>
                  {t('btnScanNow')}
                </span>

                <ArrowRight className="w-3.5 h-3.5" />

              </button>


              <button
                id="hero-weather-cta-btn"
                onClick={() => onSelectTab('weather')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white/80 hover:bg-white backdrop-blur-md text-[#344532] font-semibold text-xs uppercase tracking-widest border border-[#70855b]/35 transition-all shadow-sm"
              >

                <CloudSun className="w-4 h-4 text-[#587c45]" />

                <span>
                  {t('btnCheckWeather')}
                </span>

              </button>

            </div>

          </div>


          {/* =================================================
              RIGHT PHONE
              ================================================= */}

          <div className="lg:col-span-5 flex justify-center">

            <div className="relative w-full max-w-sm">

              {/* Phone glow */}

              <div
                className="absolute inset-[-50px] rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.75), rgba(111,148,82,0.16), transparent 70%)',
                  filter: 'blur(35px)',
                }}
              />


              {/* Phone frame */}

              <div className="relative rounded-[2rem] bg-[#edf0df]/95 backdrop-blur-xl p-4 shadow-2xl border-2 border-[#5f754d]/35">

                <div className="w-20 h-3 bg-[#607350] rounded-full mx-auto mb-3" />


                <div className="rounded-xl bg-[#172419]/95 backdrop-blur-md p-4 border border-[#7f956c]/35 space-y-3 text-xs">


                  {/* Phone header */}

                  <div className="flex items-center justify-between border-b border-[#a3b18a]/20 pb-2">

                    <div className="flex items-center gap-2">

                      <div
                        className="w-2.5 h-2.5 rounded-full bg-[#b8c99d]"
                        style={{
                          boxShadow:
                            '0 0 10px rgba(184,201,157,0.65)',
                        }}
                      />

                      <span className="font-bold text-[#f2f2e8] uppercase tracking-wider text-[11px]">
                        KrishiAI Assistant
                      </span>

                    </div>

                    <span className="text-[10px] uppercase text-[#b8c99d]/80 font-mono">
                      Live Active
                    </span>

                  </div>


                  {/* Crop scan */}

                  <div
                    onClick={() => onSelectTab('scan')}
                    className="p-3 rounded-lg bg-[#263729]/95 border border-[#a3b18a]/30 cursor-pointer hover:bg-[#314632] transition-colors"
                  >

                    <div className="flex items-center justify-between text-[#b9ca9e] font-semibold mb-1">

                      <div className="flex items-center gap-1.5">

                        <Scan className="w-3.5 h-3.5" />

                        <span className="text-xs">
                          A. Crop Scan (AI Vision)
                        </span>

                      </div>

                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#b9ca9e] px-1.5 py-0.5 rounded font-mono">
                        94% match
                      </span>

                    </div>

                    <p className="text-[11px] text-[#f2f2e8]/70">
                      Rice Leaf Blast detected • Tricyclazole 75% WP @ 0.6g/L recommended
                    </p>

                  </div>


                  {/* Weather */}

                  <div
                    onClick={() => onSelectTab('weather')}
                    className="p-3 rounded-lg bg-[#263729]/95 border border-[#a3b18a]/30 cursor-pointer hover:bg-[#314632] transition-colors"
                  >

                    <div className="flex items-center justify-between text-[#b9ca9e] font-semibold mb-1">

                      <div className="flex items-center gap-1.5">

                        <CloudSun className="w-3.5 h-3.5 text-amber-300" />

                        <span className="text-xs">
                          D. Weather & Spray Alert
                        </span>

                      </div>

                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#b9ca9e] px-1.5 py-0.5 rounded font-mono">
                        Optimal
                      </span>

                    </div>

                    <p className="text-[11px] text-[#f2f2e8]/70">
                      Calm winds (8 km/h), rain risk 15%. Safe for fungicide foliar spray until 4 PM.
                    </p>

                  </div>


                  {/* Irrigation */}

                  <div
                    onClick={() => onSelectTab('irrigation')}
                    className="p-3 rounded-lg bg-[#263729]/95 border border-[#a3b18a]/30 cursor-pointer hover:bg-[#314632] transition-colors"
                  >

                    <div className="flex items-center justify-between text-[#b9ca9e] font-semibold mb-1">

                      <div className="flex items-center gap-1.5">

                        <Droplets className="w-3.5 h-3.5" />

                        <span className="text-xs">
                          E. Smart Irrigation Advice
                        </span>

                      </div>

                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#b9ca9e] px-1.5 py-0.5 rounded font-mono">
                        Save 38%
                      </span>

                    </div>

                    <p className="text-[11px] text-[#f2f2e8]/70">
                      Wheat vegetative stage: Apply 2.2 hrs drip irrigation tomorrow morning.
                    </p>

                  </div>


                  {/* Voice button */}

                  <button
                    onClick={() => onSelectTab('chatbot')}
                    className="w-full py-2 rounded-lg bg-[#a3b18a] hover:bg-[#b7c99b] text-[#182118] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
                  >

                    <Mic className="w-3.5 h-3.5" />

                    <span>
                      Ask Krishi Saathi in Voice
                    </span>

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            FEATURE CARDS
            ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">


          {/* Crop Disease */}

          <div
            id="card-crop-scan"
            onClick={() => onSelectTab('scan')}
            className="p-5 rounded-xl border cursor-pointer transition-all duration-200 bg-white/75 backdrop-blur-md border-[#71845c]/25 shadow-lg hover:bg-white/90"
          >

            <div className="w-9 h-9 rounded-lg bg-[#5f824b]/15 border border-[#5f824b]/30 flex items-center justify-center text-[#527440] mb-3">

              <Scan className="w-4 h-4" />

            </div>

            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#263625] mb-1">
              1. Crop Disease Scan
            </h3>

            <p className="text-xs text-[#3e4d3a]/70 leading-relaxed font-light">
              Upload leaf photo for instant AI vision diagnosis, pathogen identification, and chemical/organic remedies.
            </p>

          </div>


          {/* Weather */}

          <div
            id="card-agri-weather"
            onClick={() => onSelectTab('weather')}
            className="p-5 rounded-xl border cursor-pointer transition-all duration-200 bg-white/75 backdrop-blur-md border-[#71845c]/25 shadow-lg hover:bg-white/90"
          >

            <div className="w-9 h-9 rounded-lg bg-[#5f824b]/15 border border-[#5f824b]/30 flex items-center justify-center text-[#527440] mb-3">

              <CloudSun className="w-4 h-4" />

            </div>

            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#263625] mb-1">
              2. Weather & Spray Alert
            </h3>

            <p className="text-xs text-[#3e4d3a]/70 leading-relaxed font-light">
              Real-time agro-meteorology, rainfall probability, and smart pesticide spray safety windows for your district.
            </p>

          </div>


          {/* Disease Atlas */}

          <div
            id="card-disease-atlas"
            onClick={() => onSelectTab('diseases')}
            className="p-5 rounded-xl border cursor-pointer transition-all duration-200 bg-white/75 backdrop-blur-md border-[#71845c]/25 shadow-lg hover:bg-white/90"
          >

            <div className="w-9 h-9 rounded-lg bg-[#5f824b]/15 border border-[#5f824b]/30 flex items-center justify-center text-[#527440] mb-3">

              <BookOpen className="w-4 h-4" />

            </div>

            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#263625] mb-1">
              3. Major Disease Atlas
            </h3>

            <p className="text-xs text-[#3e4d3a]/70 leading-relaxed font-light">
              Comprehensive scientific directory of 30+ Indian crop diseases across Rice, Wheat, Cotton, Tomato, Potato & more.
            </p>

          </div>


          {/* Irrigation */}

          <div
            id="card-smart-irrigation"
            onClick={() => onSelectTab('irrigation')}
            className="p-5 rounded-xl border cursor-pointer transition-all duration-200 bg-white/75 backdrop-blur-md border-[#71845c]/25 shadow-lg hover:bg-white/90"
          >

            <div className="w-9 h-9 rounded-lg bg-[#5f824b]/15 border border-[#5f824b]/30 flex items-center justify-center text-[#527440] mb-3">

              <Droplets className="w-4 h-4" />

            </div>

            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#263625] mb-1">
              4. Smart Irrigation & NPK
            </h3>

            <p className="text-xs text-[#3e4d3a]/70 leading-relaxed font-light">
              Calculate precise water needs in liters & hours of drip irrigation, plus balanced fertilizer dosages.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};