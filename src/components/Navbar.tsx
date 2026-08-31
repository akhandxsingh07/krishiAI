import React, { useState } from 'react';
import { Sprout, Globe, User, CloudSun, BookOpen, Scan, Droplets, MessageSquareText, FileText, ChevronDown, Check } from 'lucide-react';
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
  weatherData,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = (key: string) => getTranslation(currentLang, key);

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: Sprout },
    { id: 'scan', label: t('navScan'), icon: Scan, badge: 'AI Vision' },
    { id: 'diseases', label: t('navDiseases'), icon: BookOpen },
    { id: 'weather', label: t('navWeather'), icon: CloudSun },
    { id: 'irrigation', label: t('navIrrigation'), icon: Droplets },
    { id: 'chatbot', label: t('navChatbot'), icon: MessageSquareText, highlight: true },
    { id: 'docs', label: t('navDocs'), icon: FileText },
  ];

  const currentLanguageObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-[#0a110a]/95 backdrop-blur-md border-b border-[#a3b18a]/20 text-[#f2f2e8] shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20 gap-2">
          {/* Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-[#a3b18a] flex items-center justify-center shadow-lg text-[#0a110a] font-bold font-serif text-lg group-hover:scale-105 transition-transform duration-200">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-widest uppercase font-serif text-[#f2f2e8]">KrishiAI</span>
                <span className="hidden 2xl:inline text-[10px] font-semibold px-2 py-0.5 rounded border border-[#a3b18a]/30 text-[#a3b18a] uppercase tracking-wider bg-[#a3b18a]/10">Agri v1.0</span>
              </div>
              <p className="text-[11px] text-[#a3b18a] font-medium tracking-wide">{t('appSlogan')}</p>
            </div>
          </div>

          {/* Desktop Nav: kept in one row; Eureka/Presentation removed */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center min-w-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[10px] xl:text-xs uppercase tracking-wide font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-[#a3b18a]/15 text-[#a3b18a] border border-[#a3b18a]/40 shadow-sm font-semibold'
                      : 'text-[#f2f2e8]/70 hover:text-[#f2f2e8] hover:bg-[#a3b18a]/10'
                  } ${item.highlight ? 'text-amber-200 hover:text-amber-100' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#a3b18a]' : item.highlight ? 'text-amber-300' : 'text-[#f2f2e8]/60'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="hidden xl:inline text-[8px] font-semibold px-1 py-0.2 rounded bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/30">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {weatherData && (
              <button
                id="header-weather-chip"
                onClick={() => onSelectTab('weather')}
                className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-[11px] text-[#f2f2e8] hover:border-[#a3b18a]/50 transition-colors"
                title="Click for full agricultural weather forecast"
              >
                <CloudSun className="w-4 h-4 text-amber-300" />
                <span className="font-semibold text-[#a3b18a]">{weatherData.city}:</span>
                <span>{weatherData.temp}°C</span>
              </button>
            )}

            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-[#f2f2e8] text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#a3b18a]" />
                <span className="accent-text font-bold">{currentLanguageObj.nativeName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#f2f2e8]/50 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div id="language-dropdown-menu" className="absolute right-0 mt-2 w-56 bg-[#121a12] border border-[#a3b18a]/30 rounded-xl shadow-2xl py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#a3b18a] border-b border-[#a3b18a]/20">Select Language / भाषा चुनें</div>
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.code === currentLang;
                    return (
                      <button key={lang.code} onClick={() => { onLanguageChange(lang.code); setLangDropdownOpen(false); }} className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${isSelected ? 'bg-[#a3b18a]/20 text-[#f2f2e8] font-bold' : 'text-[#f2f2e8]/70 hover:bg-[#a3b18a]/10 hover:text-[#f2f2e8]'}`}>
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold border transition-all duration-200 ${userProfile ? 'bg-[#1a241a] hover:bg-[#233023] text-[#f2f2e8] border-[#a3b18a]/40' : 'border-[#a3b18a]/40 text-[#f2f2e8] hover:bg-[#a3b18a] hover:text-[#0a110a] hover:border-[#a3b18a]'}`}
            >
              <User className="w-3.5 h-3.5 text-[#a3b18a]" />
              <span className="hidden sm:inline">{userProfile ? userProfile.name.split(' ')[0] : 'Login'}</span>
              {userProfile && <span className="hidden xl:inline text-[9px] px-1.5 py-0.2 rounded bg-[#a3b18a]/20 text-[#a3b18a] uppercase">{userProfile.state}</span>}
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
                <button key={item.id} onClick={() => { onSelectTab(item.id); setMobileMenuOpen(false); }} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-medium ${isActive ? 'bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/40' : 'text-[#f2f2e8]/70 bg-[#141d14] hover:bg-[#1a241a]'}`}>
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
