import React, { useState } from 'react';
import { FileText, FolderTree, Terminal, Server, Shield, Cloud, Copy, Check, Sparkles, Layers, Cpu, ExternalLink, Download } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const projectTree = `krishiai/
├── .env.example                     # Environment variables template (GEMINI_API_KEY)
├── metadata.json                    # AI Studio applet manifest & permissions
├── package.json                     # Dependencies (Express, @google/genai, React 19, Tailwind)
├── server.ts                        # Full-stack Express backend & Gemini API proxy
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite build tool setup with Tailwind CSS plugin
├── index.html                       # HTML5 entry point with Indian language typography
└── src/
    ├── main.tsx                     # React 19 DOM entry point
    ├── App.tsx                      # Main Application State & View Routing
    ├── index.css                    # Tailwind CSS utility imports
    ├── types.ts                     # TypeScript shared interfaces & types
    ├── locales/
    │   └── translations.ts          # 11 Indian languages dictionary (Hindi, Punjabi, etc.)
    ├── data/
    │   ├── diseasesData.ts          # ICAR Crop Disease database & sample leaves
    │   └── presentationData.ts      # 10 Eureka pitch deck slides
    ├── services/
    │   └── weatherService.ts        # Open-Meteo real-time weather & spray logic
    └── components/
        ├── Navbar.tsx               # Top header, language switcher & auth button
        ├── HeroBanner.tsx           # Agri banner, slogan, Mandi ticker & action cards
        ├── DiseaseScanner.tsx       # AI computer vision leaf scanner & camera
        ├── DiseaseEncyclopedia.tsx  # Searchable directory of 30+ crop diseases
        ├── WeatherDashboard.tsx     # Real-time agro-meteorology & spray advisory
        ├── IrrigationAdvisor.tsx    # Smart water budget & NPK fertilizer calculator
        ├── AIChatbot.tsx            # "Krishi Saathi" multilingual voice/text advisor
        ├── AuthModal.tsx            # Farmer login & 1-click demo profiles
        ├── PresentationViewer.tsx   # Interactive Eureka 10-slide deck viewer
        ├── DocumentationView.tsx    # Architecture & deployment docs (this view)
        └── Footer.tsx               # Brand footer & Kisan Call Center 1800-180-1551`;

  const dockerfileCode = `# Multi-stage Dockerfile for KrishiAI
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#f2f2e8]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 text-[#a3b18a] text-xs uppercase tracking-widest font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Full Architecture & Deployment Guide</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-[#f2f2e8] font-serif">
          KrishiAI Codebase & Deployment Documentation
        </h2>
        <p className="text-sm text-[#f2f2e8]/70 max-w-2xl mx-auto font-light">
          Complete project structure, installation instructions, API documentation, and Cloud Run / Docker deployment steps.
        </p>
      </div>

      {/* 4 Feature Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 text-center space-y-1">
          <Cpu className="w-5 h-5 text-[#a3b18a] mx-auto" />
          <p className="font-semibold text-xs text-[#f2f2e8]">Gemini 3.7 Flash</p>
          <p className="text-[11px] text-[#f2f2e8]/50 font-light">Multimodal Vision</p>
        </div>
        <div className="p-4 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 text-center space-y-1">
          <Cloud className="w-5 h-5 text-amber-400 mx-auto" />
          <p className="font-semibold text-xs text-[#f2f2e8]">Open-Meteo API</p>
          <p className="text-[11px] text-[#f2f2e8]/50 font-light">Live Weather & Spray</p>
        </div>
        <div className="p-4 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 text-center space-y-1">
          <Layers className="w-5 h-5 text-[#a3b18a] mx-auto" />
          <p className="font-semibold text-xs text-[#f2f2e8]">11 Indian Languages</p>
          <p className="text-[11px] text-[#f2f2e8]/50 font-light">Voice + Text UI</p>
        </div>
        <div className="p-4 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 text-center space-y-1">
          <Server className="w-5 h-5 text-cyan-400 mx-auto" />
          <p className="font-semibold text-xs text-[#f2f2e8]">Express + Vite</p>
          <p className="text-[11px] text-[#f2f2e8]/50 font-light">Port 3000 Ingress</p>
        </div>
      </div>

      {/* Folder Structure */}
      <div className="p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-light font-serif text-[#f2f2e8] flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#a3b18a]" />
            <span>Complete Project File Tree & Organization</span>
          </h3>
          <div className="flex items-center gap-2">
            <a
              href="/api/download-zip"
              download="krishiai-codebase.zip"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] text-xs font-semibold transition-colors uppercase tracking-wider text-[11px] shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>
            <button
              onClick={() => copyToClipboard(projectTree, 'tree')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] transition-colors uppercase tracking-wider text-[11px]"
            >
              {copiedKey === 'tree' ? <Check className="w-3.5 h-3.5 text-[#a3b18a]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'tree' ? 'Copied' : 'Copy Tree'}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-lg bg-[#0a110a] border border-[#a3b18a]/20 text-[#a3b18a] font-mono text-xs overflow-x-auto leading-relaxed">
          {projectTree}
        </pre>
      </div>

      {/* Quickstart & Commands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Setup */}
        <div className="p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-xl space-y-4">
          <h3 className="text-base font-light font-serif text-[#f2f2e8] flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#a3b18a]" />
            <span>Local Development Quickstart</span>
          </h3>

          <div className="space-y-3 text-xs text-[#f2f2e8]/80 font-light">
            <div className="space-y-1">
              <span className="font-semibold text-[#a3b18a] text-[11px] uppercase tracking-wider">1. Clone repository & install dependencies:</span>
              <div className="p-3 rounded-lg bg-[#0a110a] border border-[#a3b18a]/20 font-mono text-[#a3b18a]">
                npm install
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-[#a3b18a] text-[11px] uppercase tracking-wider">2. Configure environment variable (.env):</span>
              <div className="p-3 rounded-lg bg-[#0a110a] border border-[#a3b18a]/20 font-mono text-[#a3b18a]">
                GEMINI_API_KEY=your_gemini_api_key_here
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-[#a3b18a] text-[11px] uppercase tracking-wider">3. Run development server (boots on port 3000):</span>
              <div className="p-3 rounded-lg bg-[#0a110a] border border-[#a3b18a]/20 font-mono text-[#a3b18a]">
                npm run dev
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-[#a3b18a] text-[11px] uppercase tracking-wider">4. Build & Run for Production:</span>
              <div className="p-3 rounded-lg bg-[#0a110a] border border-[#a3b18a]/20 font-mono text-[#a3b18a]">
                npm run build && npm start
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Run / Docker Deployment */}
        <div className="p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-light font-serif text-[#f2f2e8] flex items-center gap-2">
              <Cloud className="w-5 h-5 text-amber-400" />
              <span>Dockerfile for Production / Cloud Run</span>
            </h3>
            <button
              onClick={() => copyToClipboard(dockerfileCode, 'docker')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] transition-colors uppercase tracking-wider text-[11px]"
            >
              {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5 text-[#a3b18a]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'docker' ? 'Copied' : 'Copy Dockerfile'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-lg bg-[#0a110a] border border-[#a3b18a]/20 text-[#a3b18a] font-mono text-xs overflow-x-auto leading-relaxed">
            {dockerfileCode}
          </pre>
        </div>
      </div>

      {/* Backend API Endpoints Reference */}
      <div className="p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-xl space-y-4">
        <h3 className="text-base font-light font-serif text-[#f2f2e8] flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <span>Server-Side API Reference</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-[#a3b18a]">
              <span className="px-2 py-0.5 rounded bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/30 text-[10px]">POST</span>
              <span>/api/analyze-crop</span>
            </div>
            <p className="text-[#f2f2e8]/70 text-[11px] font-light">
              Computer vision endpoint using Gemini 3.7 Flash. Accepts base64 leaf image and language preference; returns structured diagnosis, chemical dosages, and organic recipes.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-300">
              <span className="px-2 py-0.5 rounded bg-amber-600/20 text-amber-300 border border-amber-500/30 text-[10px]">POST</span>
              <span>/api/chat</span>
            </div>
            <p className="text-[#f2f2e8]/70 text-[11px] font-light">
              Multilingual agricultural chatbot ("Krishi Saathi"). Processes conversational agronomy queries with ICAR knowledge grounding in 11 Indian languages.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-cyan-300">
              <span className="px-2 py-0.5 rounded bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 text-[10px]">POST</span>
              <span>/api/irrigation-advisory</span>
            </div>
            <p className="text-[#f2f2e8]/70 text-[11px] font-light">
              Decision support engine calculating daily water budget (liters), drip run time, flood run time, and NPK fertilizer dosages per field area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
