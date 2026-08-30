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
    ['Wheat (गेहूँ)', '₹2,275 / qtl', '+₹150 (MSP)'],
    ['Paddy / Rice (धान)', '₹2,320 / qtl', '+₹117 (MSP)'],
    ['Cotton (कपास)', '₹7,121 / qtl', '+₹501 (MSP)'],
    ['Mustard (सरसों)', '₹5,650 / qtl', '+₹200 (MSP)'],
    ['Soybean (सोयाबीन)', '₹4,892 / qtl', '+₹292 (MSP)'],
    ['Sugarcane (गन्ना FRP)', '₹340 / qtl', '+₹25'],
    ['Tomato (टमाटर)', '₹1,850 / qtl', 'Market Avg'],
  ];

  return (
    <section className="relative overflow-hidden text-[#203020]">

      {/* =====================================================
          MOVING AGRICULTURAL FIELD VIDEO
          ===================================================== */}

      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/agriculture-field2.mp4" type="video/mp4" />
      </video>

      {/* =====================================================
          LIGHT OVERLAY
          Keeps the agricultural video visible while making
          the text easy to read.
          ===================================================== */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(249,248,232,0.94) 0%,
              rgba(249,248,232,0.82) 30%,
              rgba(249,248,232,0.55) 55%,
              rgba(249,248,232,0.22) 100%
            )
          `,
        }}
      />

      {/* Bottom green atmospheric layer */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(48,92,42,0.28), transparent 55%)',
        }}
      />

      {/* =====================================================
          SUBTLE AI GRID
          ===================================================== */}

      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(45,90,50,0.10) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(45,90,50,0.10) 1px,
              transparent 1px
            )
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* =====================================================
          AI FIELD CONTOURS
          ===================================================== */}

      <div
        className="absolute pointer-events-none"
        style={{
          width: '1100px',
          height: '500px',
          right: '-380px',
          bottom: '-280px',
          border: '1px solid rgba(50,100,45,0.18)',
          borderRadius: '50%',
          transform: 'rotate(-12deg)',
          boxShadow: `
            0 0 0 45px rgba(50,100,45,0.04),
            0 0 0 90px rgba(50,100,45,0.035),
            0 0 0 135px rgba(50,100,45,0.03),
            0 0 0 180px rgba(50,100,45,0.025)
          `,
        }}
      />

      {/* =====================================================
          FLOATING AI DATA POINTS
          ===================================================== */}

      <div
        className="absolute w-2 h-2 rounded-full bg-[#6d914e]"
        style={{
          top: '24%',
          right: '30%',
          boxShadow: '0 0 0 7px rgba(109,145,78,0.14)',
        }}
      />

      <div
        className="absolute w-1.5 h-1.5 rounded-full bg-[#78995d]"
        style={{
          top: '46%',
          right: '13%',
          boxShadow: '0 0 0 6px rgba(120,153,93,0.12)',
        }}
      />

      {/* =====================================================
          MANDI TICKER
          ===================================================== */}

      <div className="relative z-20 bg-[#f4f5e7]/90 backdrop-blur-md border-b border-[#647953]/25">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4 py-2.5 overflow-hidden">

            <div className="flex items-center gap-2 shrink-0">

              <TrendingUp className="w-4 h-4 text-[#527440]" />

              <span className="text-[11px] font-bold uppercase tracking-wider text-[#536844]">
                Kisan Mandi Rates:
              </span>

            </div>

            <div className="flex items-center gap-7 overflow-x-auto no-scrollbar">

              {mandiPrices.map(([crop, price, change], index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 whitespace-nowrap text-xs"
                >

                  <span className="text-[#3d4b39]/80">
                    {crop}:
                  </span>

                  <span className="font-bold text-[#4d713d]">
                    {price}
                  </span>

                  <span className="text-[10px] bg-white/70 border border-[#70825d]/20 rounded px-1.5 py-0.5 text-[#596651]">
                    {change}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN HERO CONTENT
          ===================================================== */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* =================================================
              LEFT CONTENT
              ================================================= */}

          <div className="lg:col-span-7">

            <div className="max-w-3xl space-y-6">

              {/* AI Badge */}

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#667d54]/30 shadow-sm">

                <Sparkles className="w-4 h-4 text-[#63844e]" />

                <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#526d45]">
                  AI Vision + Real-Time Agro Intelligence
                </span>

              </div>

              {/* Heading */}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-[1.05] text-[#1d301d] drop-shadow-sm">

                {t('heroTitle')}

              </h1>

              {/* Subtitle */}

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#344532]">

                {t('heroSubtitle')}

              </p>

              {/* =================================================
                  FEATURE BADGES
                  ================================================= */}

              <div className="flex flex-wrap gap-2">

                <div className="flex items-center gap-2 rounded-lg bg-white/80 backdrop-blur-md border border-[#71845c]/25 px-3 py-2 shadow-sm">

                  <ShieldCheck className="w-4 h-4 text-[#557846]" />

                  <span className="text-xs font-medium text-[#334431]">
                    ICAR Guided Diagnoses
                  </span>

                </div>

                <div className="flex items-center gap-2 rounded-lg bg-white/80 backdrop-blur-md border border-[#71845c]/25 px-3 py-2 shadow-sm">

                  <Mic className="w-4 h-4 text-[#557846]" />

                  <span className="text-xs font-medium text-[#334431]">
                    Voice in 10+ Indian Languages
                  </span>

                </div>

                <div className="flex items-center gap-2 rounded-lg bg-white/80 backdrop-blur-md border border-[#71845c]/25 px-3 py-2 shadow-sm">

                  <Cpu className="w-4 h-4 text-[#557846]" />

                  <span className="text-xs font-medium text-[#334431]">
                    Instant Image Vision Engine
                  </span>

                </div>

              </div>

              {/* =================================================
                  BUTTONS
                  ================================================= */}

              <div className="flex flex-wrap gap-3 pt-2">

                <button
                  id="hero-scan-cta-btn"
                  onClick={() => onSelectTab('scan')}
                  className="group flex items-center gap-2 rounded-xl bg-[#547744] hover:bg-[#436533] text-white px-6 py-4 font-bold text-xs uppercase tracking-widest shadow-xl transition-all duration-200 hover:-translate-y-1"
                >

                  <Scan className="w-4 h-4" />

                  <span>
                    {t('btnScanNow')}
                  </span>

                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

                </button>

                <button
                  id="hero-weather-cta-btn"
                  onClick={() => onSelectTab('weather')}
                  className="flex items-center gap-2 rounded-xl bg-white/85 hover:bg-white backdrop-blur-md text-[#344632] px-6 py-4 font-bold text-xs uppercase tracking-widest border border-[#647a54]/30 shadow-sm transition-all duration-200 hover:-translate-y-1"
                >

                  <CloudSun className="w-4 h-4 text-[#5c7e48]" />

                  <span>
                    {t('btnCheckWeather')}
                  </span>

                </button>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT — AI PHONE
              ================================================= */}

          <div className="lg:col-span-5 flex justify-center">

            <div className="relative w-full max-w-[390px]">

              {/* Phone glow */}

              <div
                className="absolute -inset-16 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.75), rgba(116,153,87,0.18), transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />

              {/* Phone */}

              <div className="relative rounded-[2.5rem] bg-[#edf1df]/95 backdrop-blur-xl p-4 border-2 border-[#60794e]/35 shadow-[0_30px_70px_rgba(44,70,36,0.28)]">

                <div className="w-20 h-3 rounded-full bg-[#657655] mx-auto mb-3" />

                <div className="rounded-[1.4rem] bg-[#152117] p-4 border border-[#81966d]/35 shadow-inner">

                  {/* Phone header */}

                  <div className="flex items-center justify-between pb-3 border-b border-[#a3b18a]/20">

                    <div className="flex items-center gap-2">

                      <span
                        className="w-2.5 h-2.5 rounded-full bg-[#b9ca9f]"
                        style={{
                          boxShadow:
                            '0 0 12px rgba(185,202,159,0.7)',
                        }}
                      />

                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#f1f3e7]">
                        KrishiAI Assistant
                      </span>

                    </div>

                    <span className="text-[9px] uppercase font-mono text-[#a9bd91]">
                      Live Active
                    </span>

                  </div>

                  {/* Crop Scan */}

                  <button
                    onClick={() => onSelectTab('scan')}
                    className="w-full text-left mt-3 p-3 rounded-xl bg-[#263729] border border-[#91a47b]/30 hover:bg-[#304532] transition-colors"
                  >

                    <div className="flex items-center justify-between mb-1">

                      <div className="flex items-center gap-1.5 text-[#b8ca9c]">

                        <Scan className="w-3.5 h-3.5" />

                        <span className="text-xs font-semibold">
                          A. Crop Scan (AI Vision)
                        </span>

                      </div>

                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#b9ca9e] px-1.5 py-0.5 rounded font-mono">
                        94% match
                      </span>

                    </div>

                    <p className="text-[11px] leading-relaxed text-[#f2f2e8]/70">
                      Rice Leaf Blast detected • Tricyclazole 75% WP @ 0.6g/L recommended
                    </p>

                  </button>

                  {/* Weather */}

                  <button
                    onClick={() => onSelectTab('weather')}
                    className="w-full text-left mt-3 p-3 rounded-xl bg-[#263729] border border-[#91a47b]/30 hover:bg-[#304532] transition-colors"
                  >

                    <div className="flex items-center justify-between mb-1">

                      <div className="flex items-center gap-1.5 text-[#b8ca9c]">

                        <CloudSun className="w-3.5 h-3.5 text-amber-300" />

                        <span className="text-xs font-semibold">
                          D. Weather & Spray Alert
                        </span>

                      </div>

                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#b9ca9e] px-1.5 py-0.5 rounded font-mono">
                        Optimal
                      </span>

                    </div>

                    <p className="text-[11px] leading-relaxed text-[#f2f2e8]/70">
                      Calm winds (8 km/h), rain risk 15%. Safe for fungicide foliar spray until 4 PM.
                    </p>

                  </button>

                  {/* Irrigation */}

                  <button
                    onClick={() => onSelectTab('irrigation')}
                    className="w-full text-left mt-3 p-3 rounded-xl bg-[#263729] border border-[#91a47b]/30 hover:bg-[#304532] transition-colors"
                  >

                    <div className="flex items-center justify-between mb-1">

                      <div className="flex items-center gap-1.5 text-[#b8ca9c]">

                        <Droplets className="w-3.5 h-3.5" />

                        <span className="text-xs font-semibold">
                          E. Smart Irrigation Advice
                        </span>

                      </div>

                      <span className="text-[9px] bg-[#a3b18a]/20 text-[#b9ca9e] px-1.5 py-0.5 rounded font-mono">
                        Save 38%
                      </span>

                    </div>

                    <p className="text-[11px] leading-relaxed text-[#f2f2e8]/70">
                      Wheat vegetative stage: Apply 2.2 hrs drip irrigation tomorrow morning.
                    </p>

                  </button>

                  {/* Voice */}

                  <button
                    onClick={() => onSelectTab('chatbot')}
                    className="w-full mt-3 py-3 rounded-xl bg-[#a8b98e] hover:bg-[#b9c99f] text-[#182118] font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >

                    <Mic className="w-4 h-4" />

                    Ask Krishi Saathi in Voice

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            FEATURE CARDS
            ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">

          {/* Crop Disease */}

          <div
            id="card-crop-scan"
            onClick={() => onSelectTab('scan')}
            className="group cursor-pointer rounded-2xl bg-white/80 backdrop-blur-md border border-[#70825d]/25 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-white/95"
          >

            <div className="w-10 h-10 rounded-xl bg-[#5d824b]/15 border border-[#5d824b]/25 flex items-center justify-center text-[#527440] mb-4">

              <Scan className="w-5 h-5" />

            </div>

            <h3 className="font-bold text-sm uppercase tracking-wider text-[#263625] mb-2">
              1. Crop Disease Scan
            </h3>

            <p className="text-xs text-[#40503d]/75 leading-relaxed">
              Upload leaf photo for instant AI vision diagnosis, pathogen identification, and chemical/organic remedies.
            </p>

          </div>

          {/* Weather */}

          <div
            id="card-agri-weather"
            onClick={() => onSelectTab('weather')}
            className="group cursor-pointer rounded-2xl bg-white/80 backdrop-blur-md border border-[#70825d]/25 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-white/95"
          >

            <div className="w-10 h-10 rounded-xl bg-[#5d824b]/15 border border-[#5d824b]/25 flex items-center justify-center text-[#527440] mb-4">

              <CloudSun className="w-5 h-5" />

            </div>

            <h3 className="font-bold text-sm uppercase tracking-wider text-[#263625] mb-2">
              2. Weather & Spray Alert
            </h3>

            <p className="text-xs text-[#40503d]/75 leading-relaxed">
              Real-time agro-meteorology, rainfall probability, and smart pesticide spray safety windows for your district.
            </p>

          </div>

          {/* Disease Atlas */}

          <div
            id="card-disease-atlas"
            onClick={() => onSelectTab('diseases')}
            className="group cursor-pointer rounded-2xl bg-white/80 backdrop-blur-md border border-[#70825d]/25 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-white/95"
          >

            <div className="w-10 h-10 rounded-xl bg-[#5d824b]/15 border border-[#5d824b]/25 flex items-center justify-center text-[#527440] mb-4">

              <BookOpen className="w-5 h-5" />

            </div>

            <h3 className="font-bold text-sm uppercase tracking-wider text-[#263625] mb-2">
              3. Major Disease Atlas
            </h3>

            <p className="text-xs text-[#40503d]/75 leading-relaxed">
              Comprehensive scientific directory of 30+ Indian crop diseases across Rice, Wheat, Cotton, Tomato, Potato & more.
            </p>

          </div>

          {/* Irrigation */}

          <div
            id="card-smart-irrigation"
            onClick={() => onSelectTab('irrigation')}
            className="group cursor-pointer rounded-2xl bg-white/80 backdrop-blur-md border border-[#70825d]/25 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-white/95"
          >

            <div className="w-10 h-10 rounded-xl bg-[#5d824b]/15 border border-[#5d824b]/25 flex items-center justify-center text-[#527440] mb-4">

              <Droplets className="w-5 h-5" />

            </div>

            <h3 className="font-bold text-sm uppercase tracking-wider text-[#263625] mb-2">
              4. Smart Irrigation & NPK
            </h3>

            <p className="text-xs text-[#40503d]/75 leading-relaxed">
              Calculate precise water needs in liters & hours of drip irrigation, plus balanced fertilizer dosages.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};