import React, { useState, useEffect } from 'react';
import { Language, UserProfile, WeatherData } from './types';
import { fetchLiveAgriWeather, AgriLocation, POPULAR_AGRI_LOCATIONS } from './services/weatherService';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DiseaseScanner } from './components/DiseaseScanner';
import { DiseaseEncyclopedia } from './components/DiseaseEncyclopedia';
import { WeatherDashboard } from './components/WeatherDashboard';
import { IrrigationAdvisor } from './components/IrrigationAdvisor';
import { AIChatbot } from './components/AIChatbot';
import { AuthModal } from './components/AuthModal';
import { DocumentationView } from './components/DocumentationView';
import { X402PaymentCard } from './components/X402PaymentCard';
import { Footer } from './components/Footer';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('hi');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [chatbotInitialPrompt, setChatbotInitialPrompt] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedLang = localStorage.getItem('krishiai_lang') as Language;
    if (savedLang) setCurrentLang(savedLang);

    const savedProfile = localStorage.getItem('krishiai_user');
    if (savedProfile) {
      try { setUserProfile(JSON.parse(savedProfile)); }
      catch (e) { console.warn('Failed to parse cached user profile', e); }
    }

    handleRefreshWeather(POPULAR_AGRI_LOCATIONS[0]);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    try { localStorage.setItem('krishiai_lang', lang); } catch {}
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    if (profile.preferredLanguage) handleLanguageChange(profile.preferredLanguage);
    try { localStorage.setItem('krishiai_user', JSON.stringify(profile)); } catch {}
  };

  const handleLogout = () => {
    setUserProfile(null);
    try { localStorage.removeItem('krishiai_user'); } catch {}
  };

  const handleRefreshWeather = async (loc: AgriLocation) => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchLiveAgriWeather(loc.lat, loc.lon, loc.city, loc.state);
      setWeatherData(data);
    } catch (err) {
      console.warn('Error fetching weather:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleAskChatbotFromScan = (query: string) => {
    setChatbotInitialPrompt(query);
    setActiveTab('chatbot');
  };

  return (
    <div className="krishiai-app min-h-screen overflow-x-hidden text-[#f2f2e8] flex flex-col selection:bg-[#a3b18a] selection:text-[#0a110a] font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        weatherData={weatherData}
      />

      <main className="flex-1 min-w-0">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <HeroBanner currentLang={currentLang} onSelectTab={setActiveTab} />
            <DiseaseScanner currentLang={currentLang} onAskChatbot={handleAskChatbotFromScan} />
            <WeatherDashboard currentLang={currentLang} weatherData={weatherData} onRefreshWeather={handleRefreshWeather} isLoading={isWeatherLoading} />
            <X402PaymentCard />
          </div>
        )}
        {activeTab === 'scan' && <DiseaseScanner currentLang={currentLang} onAskChatbot={handleAskChatbotFromScan} />}
        {activeTab === 'diseases' && <DiseaseEncyclopedia currentLang={currentLang} onSelectDiseaseForScan={() => setActiveTab('scan')} />}
        {activeTab === 'weather' && <WeatherDashboard currentLang={currentLang} weatherData={weatherData} onRefreshWeather={handleRefreshWeather} isLoading={isWeatherLoading} />}
        {activeTab === 'irrigation' && <IrrigationAdvisor currentLang={currentLang} weatherData={weatherData} />}
        {activeTab === 'chatbot' && <AIChatbot currentLang={currentLang} userProfile={userProfile} initialPrompt={chatbotInitialPrompt} onClearInitialPrompt={() => setChatbotInitialPrompt(undefined)} />}
        {activeTab === 'docs' && <DocumentationView />}
      </main>

      <Footer currentLang={currentLang} onSelectTab={setActiveTab} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentLang={currentLang}
        userProfile={userProfile}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </div>
  );
}
