import React, { useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight, Play, Pause, Maximize2, Sparkles, Layers, ShieldCheck, Sprout, ArrowRight } from 'lucide-react';
import { PRESENTATION_SLIDES, SlideContent } from '../data/presentationData';

export const PresentationViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const slide = PRESENTATION_SLIDES[currentSlideIndex];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % PRESENTATION_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + PRESENTATION_SLIDES.length) % PRESENTATION_SLIDES.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-[#f2f2e8]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 text-[#a3b18a] text-xs uppercase tracking-widest font-semibold mb-1">
            <Presentation className="w-3.5 h-3.5" />
            <span>Eureka Idea Presentation Deck</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-[#f2f2e8] font-serif">
            KrishiAI Project Pitch Deck
          </h2>
        </div>

        {/* Slide navigation controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="p-2 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-[#f2f2e8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-[#121b12] border border-[#a3b18a]/30 text-xs font-semibold font-mono text-[#a3b18a]">
            {currentSlideIndex + 1} / {PRESENTATION_SLIDES.length}
          </span>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
            className="p-2 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-[#f2f2e8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Card Container (16:9 Presentation Format) */}
      <div className="relative rounded-2xl bg-[#121b12] border border-[#a3b18a]/30 shadow-2xl p-6 sm:p-10 min-h-[500px] flex flex-col justify-between text-[#f2f2e8] overflow-hidden">
        {/* Slide Top Metadata */}
        <div className="flex items-center justify-between border-b border-[#a3b18a]/20 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#a3b18a] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#a3b18a]" />
            <span>{slide.category}</span>
          </div>
          <span className="text-xs font-mono text-[#f2f2e8]/40">Slide {slide.slideNumber}</span>
        </div>

        {/* Slide Body Content */}
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            {slide.tagline && (
              <p className="text-xs font-semibold uppercase tracking-widest text-[#a3b18a]">
                {slide.tagline}
              </p>
            )}
            <h3 className="text-2xl sm:text-4xl font-light text-[#f2f2e8] font-serif leading-tight">
              {slide.title}
            </h3>
            {slide.subtitle && (
              <p className="text-sm sm:text-base text-[#f2f2e8]/70 max-w-3xl leading-relaxed font-light">
                {slide.subtitle}
              </p>
            )}
          </div>

          {/* Grid Sections if present */}
          {slide.sections && (
            <div className={`grid gap-4 ${
              slide.sections.length >= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {slide.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#141d14] border border-[#a3b18a]/20 space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-[#f2f2e8]">{sec.heading}</h4>
                    {sec.badge && (
                      <span className="w-5 h-5 rounded-full bg-[#a3b18a]/20 text-[#a3b18a] font-mono text-xs flex items-center justify-center font-bold">
                        {sec.badge}
                      </span>
                    )}
                  </div>
                  {sec.subheading && (
                    <p className="text-xs text-[#f2f2e8]/60 leading-relaxed font-light">{sec.subheading}</p>
                  )}
                  {sec.items && (
                    <ul className="space-y-1 text-xs text-[#f2f2e8]/70 font-light">
                      {sec.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#a3b18a] font-bold">•</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step Pipeline if present */}
          {slide.steps && (
            <div className={`grid gap-3 ${
              slide.steps.length === 6 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : slide.steps.length === 5 ? 'grid-cols-1 sm:grid-cols-5' : 'grid-cols-1 sm:grid-cols-4'
            }`}>
              {slide.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#141d14] border border-[#a3b18a]/20 text-center space-y-1.5 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/30 font-bold font-mono text-xs flex items-center justify-center mx-auto">
                    {st.step}
                  </div>
                  <h4 className="font-semibold text-xs text-[#f2f2e8]">{st.title}</h4>
                  <p className="text-[11px] text-[#f2f2e8]/60 leading-snug font-light">{st.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slide Footer Note */}
        {slide.footerNote && (
          <div className="pt-4 border-t border-[#a3b18a]/20 flex items-center justify-between text-xs text-[#a3b18a] font-light">
            <span>{slide.footerNote}</span>
            <span className="text-[10px] text-[#f2f2e8]/40">KrishiAI Eureka Presentation</span>
          </div>
        )}
      </div>

      {/* Slide Thumbnails Selector */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {PRESENTATION_SLIDES.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-2 rounded-lg border text-center transition-all text-xs font-mono font-semibold ${
              currentSlideIndex === idx
                ? 'bg-[#a3b18a] text-[#0a110a] border-[#a3b18a] shadow-md'
                : 'bg-[#141d14] text-[#f2f2e8]/50 border-[#a3b18a]/20 hover:bg-[#1a241a] hover:text-[#f2f2e8]'
            }`}
          >
            {s.slideNumber}
          </button>
        ))}
      </div>
    </div>
  );
};
