import React, { useState } from 'react';
import { Sprout, Globe, User, BookOpen, Scan, Droplets, MessageSquareText, FileText, ChevronDown, Check } from 'lucide-react';
import { Language, UserProfile, WeatherData } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../locales/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  weatherData: WeatherData | null;
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

  // Eureka / Presentation has intentionally been removed.
  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: Sprout },
    { id: 'scan', label: t('navScan'), icon: Scan },
    { id: 'diseases', label: t('navDiseases'), icon: BookOpen },
    { id: 'weather', label: t('navWeather'), icon: null },
    { id: 'irrigation', label: t('navIrrigation'), icon: Droplets },
    { id: 'chatbot', label: t('navChatbot'), icon: MessageSquareText, highlight: true },
    { id: 'docs', label: t('navDocs'), icon: FileText },
  ];

  const currentLanguageObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden bg-[#0a110a]/95 backdrop-blur-md border-b border-[#a3b18a]/20 text-[#f2f2e8] shadow-2xl">
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-4 xl:px-5">
        <div className="flex items-center gap-2 h-[68px] min-w-0">
          {/* Compact logo */}
          <button
            id="brand-logo-btn"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0 text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#a3b18a] flex items-center justify-center shadow-lg text-[#0a110a] font-bold font-serif text-base group-hover:scale-105 transition-transform duration-200">
              K
            </div>
            <div className="hidden sm:block leading-none">
              <div className="text-[17px] xl:text-lg font-bold tracking-[0.12em] uppercase font-serif text-[#f2f2e8]">KrishiAI</div>
              <p className="mt-1 text-[9px] xl:text-[10px] text-[#a3b18a] font-medium tracking-wide">{t('appSlogan')}</p>
            </div>
          </button>

          {/* Desktop navigation: compact, single row, no horizontal scrolling */}
          <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-0.5 xl:gap-1 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`shrink-0 flex items-center gap-1 px-2 xl:px-2.5 py-2 rounded-lg text-[9px] xl:text-[10px] 2xl:text-[11px] uppercase tracking-[0.04em] font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-[#a3b18a]/15 text-[#a3b18a] border border-[#a3b18a]/40 shadow-sm font-semibold'
                      : 'text-[#f2f2e8]/70 hover:text-[#f2f2e8] hover:bg-[#a3b18a]/10'
                  } ${item.highlight ? 'text-amber-200 hover:text-amber-100' : ''}`}
                >
                  {Icon && <Icon className={`w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0 ${isActive ? 'text-[#a3b18a]' : item.highlight ? 'text-amber-300' : 'text-[#f2f2e8]/60'}`} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right actions — deliberately compact so the page never overflows */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2 py-2 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-[#f2f2e8] text-[10px] xl:text-[11px] uppercase tracking-wider font-semibold transition-colors whitespace-nowrap"
              >
                <Globe className="w-3 h-3 text-[#a3b18a]" />
                <span className="accent-text font-bold">{currentLanguageObj.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-[#f2f2e8]/50 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
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
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${isSelected ? 'bg-[#a3b18a]/20 text-[#f2f2e8] font-bold' : 'text-[#f2f2e8]/70 hover:bg-[#a3b18a]/10 hover:text-[#f2f2e8]'}`}
                      >
                        <div className="flex items-center gap-2"><span>{lang.flag}</span><span className="font-medium">{lang.nativeName}</span><span className="text-[#f2f2e8]/40 text-[11px]">({lang.name})</span></div>
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
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-lg text-[10px] xl:text-[11px] uppercase tracking-wider font-semibold border transition-all duration-200 whitespace-nowrap ${userProfile ? 'bg-[#1a241a] hover:bg-[#233023] text-[#f2f2e8] border-[#a3b18a]/40' : 'border-[#a3b18a]/40 text-[#f2f2e8] hover:bg-[#a3b18a] hover:text-[#0a110a] hover:border-[#a3b18a]'}`}
            >
              <User className="w-3 h-3 text-[#a3b18a]" />
              <span>{userProfile ? userProfile.name.split(' ')[0] : 'Login'}</span>
              {userProfile && <span className="hidden 2xl:inline text-[8px] px-1 py-0.5 rounded bg-[#a3b18a]/20 text-[#a3b18a] uppercase">{userProfile.state}</span>}
            </button>

            <button id="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-[#f2f2e8]">
              <span className="sr-only">Open menu</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#a3b18a]/20 grid grid-cols-2 gap-2 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-medium ${isActive ? 'bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/40' : 'text-[#f2f2e8]/70 bg-[#141d14] hover:bg-[#1a241a]'}`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-[#a3b18a]" />}
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
