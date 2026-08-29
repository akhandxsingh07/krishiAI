import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../locales/translations';

interface FooterProps {
  currentLang: Language;
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onSelectTab }) => {
  const t = (key: string) => getTranslation(currentLang, key);

  return (
    <footer className="bg-[#070c07] border-t border-[#a3b18a]/20 text-[#f2f2e8]/70 text-xs">
      {/* Kisan Helpline Banner */}
      <div className="bg-[#121b12] border-b border-[#a3b18a]/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#141d14] border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a]">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#f2f2e8]">
                Kisan Call Center (KCC) National Toll-Free: <span className="text-[#a3b18a] font-mono">1800-180-1551</span>
              </p>
              <p className="text-[11px] text-[#f2f2e8]/60 font-light">
                Free 24/7 expert agronomy guidance in 22 official Indian languages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#141d14] border border-[#a3b18a]/30 text-[#a3b18a] text-[11px] uppercase tracking-wider font-semibold">
              ICAR Aligned Standards
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#a3b18a] flex items-center justify-center text-[#0a110a] shadow-md font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-light text-[#f2f2e8] font-serif">KrishiAI</span>
            </div>
            <p className="text-xs text-[#f2f2e8]/60 leading-relaxed font-light">
              An AI-powered agricultural assistant engineered for smarter, faster, and more sustainable farming across India.
            </p>
            <p className="text-xs text-[#a3b18a] font-medium uppercase tracking-wider text-[11px]">
              Detect • Decide • Act
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#a3b18a]">Platform Features</h4>
            <ul className="space-y-1.5 text-xs text-[#f2f2e8]/70 font-light">
              <li>
                <button onClick={() => onSelectTab('scan')} className="hover:text-[#a3b18a] transition-colors">
                  Crop Disease Identification (CV)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('weather')} className="hover:text-[#a3b18a] transition-colors">
                  Weather Intelligence & Spray Window
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('diseases')} className="hover:text-[#a3b18a] transition-colors">
                  Major Crop Diseases Atlas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('irrigation')} className="hover:text-[#a3b18a] transition-colors">
                  Smart Irrigation & NPK Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('chatbot')} className="hover:text-[#a3b18a] transition-colors">
                  Krishi Saathi AI Chatbot
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Languages */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#a3b18a] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Supported Indian Languages</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <span
                  key={lang.code}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium ${
                    lang.code === currentLang
                      ? 'bg-[#a3b18a] text-[#0a110a] font-bold'
                      : 'bg-[#141d14] text-[#f2f2e8]/60 border border-[#a3b18a]/20'
                  }`}
                >
                  {lang.nativeName}
                </span>
              ))}
            </div>
          </div>

          {/* Documentation & Project */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#a3b18a]">Resources</h4>
            <ul className="space-y-1.5 text-xs text-[#f2f2e8]/70 font-light">
              <li>
                <button onClick={() => onSelectTab('presentation')} className="hover:text-[#a3b18a] transition-colors">
                  Eureka Idea Pitch Deck (10 Slides)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('docs')} className="hover:text-[#a3b18a] transition-colors">
                  Codebase & Deployment Guide
                </button>
              </li>
              <li>
                <span className="text-[#f2f2e8]/40">ICAR Package of Practices 2026</span>
              </li>
              <li>
                <span className="text-[#f2f2e8]/40">Open-Meteo Free Agro Weather API</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-[#a3b18a]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#f2f2e8]/50 font-light">
          <p>
            © {new Date().getFullYear()} KrishiAI Project. Built with Google Gemini 3.7 Flash & Open-Meteo.
          </p>
          <p className="text-center sm:text-right max-w-lg text-[10px] text-[#f2f2e8]/40">
            Disclaimer: KrishiAI provides AI decision support. Farmers are advised to consult their local Krishi Vigyan Kendra (KVK) or Block Agriculture Officer before applying schedule chemicals.
          </p>
        </div>
      </div>
    </footer>
  );
};
