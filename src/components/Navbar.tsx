import React, { useState } from 'react';
import { Sprout, Globe, User, BookOpen, Scan, Droplets, MessageSquareText, FileText, ChevronDown, Check, CloudSun } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../locales/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  weatherData: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onSelectTab,
  userProfile,
  onOpenAuth,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = (key: string) => getTranslation(currentLang, key);

  // Eureka / Presentation is intentionally removed.
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Sprout },
    { id: 'scan', label: 'Scan', icon: Scan },
    { id: 'diseases', label: 'Diseases', icon: BookOpen },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'chatbot', label: 'Saathi', icon: MessageSquareText, highlight: true },
    
  ];

  const currentLanguageObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a110a]/95 backdrop-blur-md border-b border-[#a3b18a]/20 text-[#f2f2e8] shadow-2xl overflow-x-hidden">
      <div className="w-full px-4 xl:px-6">
        {/* Desktop: three fixed areas. This prevents the nav from ever sitting on top of the logo/actions. */}
        <div className="hidden xl:grid h-[68px] grid-cols-[170px_minmax(0,1fr)_170px] items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 min-w-0 select-none text-left"
          >
            <div className="w-9 h-9 shrink-0 rounded-full bg-[#a3b18a] flex items-center justify-center text-[#0a110a] font-bold font-serif text-base">
              K
            </div>
            <div className="min-w-0 leading-none">
              <div className="text-[16px] font-bold tracking-[0.04em] uppercase font-serif whitespace-nowrap">KrishiAI</div>
              <p className="mt-1 text-[8px] text-[#a3b18a] font-medium whitespace-nowrap">Detect • Decide • Act</p>
            </div>
          </button>

          <nav className="min-w-0 flex items-center justify-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-2 rounded-md text-[10px] 2xl:text-[11px] font-semibold whitespace-nowrap border transition-colors ${
                    isActive
                      ? 'bg-[#a3b18a]/15 text-[#a3b18a] border-[#a3b18a]/40'
                      : 'text-[#f2f2e8]/70 border-transparent hover:text-[#f2f2e8] hover:bg-[#a3b18a]/10'
                  } ${item.highlight ? 'text-amber-200' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#a3b18a]' : item.highlight ? 'text-amber-300' : 'text-[#f2f2e8]/60'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-1.5 min-w-0">
            <div className="relative shrink-0">
              <button
                id="language-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2 py-2 rounded-md bg-[#141d14] border border-[#a3b18a]/30 text-[10px] font-semibold whitespace-nowrap"
              >
                <Globe className="w-3 h-3 text-[#a3b18a]" />
                <span>{currentLanguageObj.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-[#f2f2e8]/50 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div id="language-dropdown-menu" className="absolute right-0 mt-2 w-56 bg-[#121a12] border border-[#a3b18a]/30 rounded-xl shadow-2xl py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#a3b18a] border-b border-[#a3b18a]/20">Select Language / भाषा चुनें</div>
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.code === currentLang;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left ${isSelected ? 'bg-[#a3b18a]/20 font-bold' : 'text-[#f2f2e8]/70 hover:bg-[#a3b18a]/10'}`}
                      >
                        <div className="flex items-center gap-2"><span>{lang.flag}</span><span>{lang.nativeName}</span><span className="text-[#f2f2e8]/40">({lang.name})</span></div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#a3b18a]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              id="user-auth-btn"
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-[10px] font-semibold border whitespace-nowrap ${userProfile ? 'bg-[#1a241a] border-[#a3b18a]/40' : 'border-[#a3b18a]/40 hover:bg-[#a3b18a] hover:text-[#0a110a]'}`}
            >
              <User className="w-3 h-3 text-[#a3b18a]" />
              <span>{userProfile ? userProfile.name.split(' ')[0] : 'Login'}</span>
            </button>
          </div>
        </div>

        {/* Tablet/mobile: simple header + menu. No squeezed navigation. */}
        <div className="xl:hidden flex items-center justify-between h-[64px] gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 min-w-0 select-none text-left"
          >
            <div className="w-9 h-9 shrink-0 rounded-full bg-[#a3b18a] flex items-center justify-center text-[#0a110a] font-bold font-serif text-base">K</div>
            <div className="leading-none">
              <div className="text-[16px] font-bold tracking-[0.04em] uppercase font-serif">KrishiAI</div>
              <p className="mt-1 text-[8px] text-[#a3b18a] font-medium">Detect • Decide • Act</p>
            </div>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative">
              <button id="language-selector-btn" onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-1 px-2 py-2 rounded-md bg-[#141d14] border border-[#a3b18a]/30 text-[10px] font-semibold">
                <Globe className="w-3 h-3 text-[#a3b18a]" />
                <span>{currentLanguageObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-[#f2f2e8]/50" />
              </button>
              {langDropdownOpen && (
                <div id="language-dropdown-menu" className="absolute right-0 mt-2 w-56 bg-[#121a12] border border-[#a3b18a]/30 rounded-xl shadow-2xl py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#a3b18a] border-b border-[#a3b18a]/20">Select Language / भाषा चुनें</div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => { onLanguageChange(lang.code); setLangDropdownOpen(false); }} className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-[#a3b18a]/10">
                      <span>{lang.flag} {lang.nativeName}</span>
                      {lang.code === currentLang && <Check className="w-3.5 h-3.5 text-[#a3b18a]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button id="user-auth-btn" onClick={onOpenAuth} className="flex items-center gap-1.5 px-2.5 py-2 rounded-md text-[10px] font-semibold border border-[#a3b18a]/40 whitespace-nowrap">
              <User className="w-3 h-3 text-[#a3b18a]" />
              <span>{userProfile ? userProfile.name.split(' ')[0] : 'Login'}</span>
            </button>
            <button id="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md bg-[#141d14] border border-[#a3b18a]/20">
              <span className="sr-only">Open menu</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-[#a3b18a]/20 grid grid-cols-2 sm:grid-cols-3 gap-2 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => { onSelectTab(item.id); setMobileMenuOpen(false); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${isActive ? 'bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/40' : 'text-[#f2f2e8]/70 bg-[#141d14]'}`}>
                  <Icon className="w-3.5 h-3.5 text-[#a3b18a]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
