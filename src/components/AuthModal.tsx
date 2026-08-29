import React, { useState } from 'react';
import { X, Sprout, Phone, ShieldCheck, User, MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { getTranslation } from '../locales/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  userProfile: UserProfile | null;
  onLoginSuccess: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  userProfile,
  onLoginSuccess,
  onLogout,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp'>('login');
  const [phone, setPhone] = useState('9876543210');
  const [name, setName] = useState('Sardar Ramesh Singh');
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');
  const [soilType, setSoilType] = useState('Alluvial');
  const [landAcres, setLandAcres] = useState(4.5);
  const [primaryCrops, setPrimaryCrops] = useState<string[]>(['Wheat', 'Rice / Paddy']);
  const [otp, setOtp] = useState(['5', '4', '2', '8']);

  if (!isOpen) return null;

  const t = (key: string) => getTranslation(currentLang, key);

  const demoProfiles: UserProfile[] = [
    {
      id: 'demo-ramesh',
      name: 'Sardar Ramesh Singh',
      phone: '9876543210',
      state: 'Punjab',
      district: 'Ludhiana',
      primaryCrops: ['Wheat', 'Rice / Paddy', 'Mustard'],
      landSizeAcres: 5.0,
      soilType: 'Alluvial',
      preferredLanguage: 'pa',
    },
    {
      id: 'demo-lakshmi',
      name: 'Lakshmi Devi',
      phone: '9848012345',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      primaryCrops: ['Chilli', 'Cotton', 'Paddy'],
      landSizeAcres: 3.5,
      soilType: 'Black',
      preferredLanguage: 'te',
    },
    {
      id: 'demo-rajesh',
      name: 'Dr. Rajesh Verma (Agronomist)',
      phone: '9811223344',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      primaryCrops: ['Rice', 'Wheat', 'Vegetables'],
      landSizeAcres: 8.0,
      soilType: 'Alluvial',
      preferredLanguage: 'hi',
    },
  ];

  const handleQuickLogin = (demo: UserProfile) => {
    onLoginSuccess(demo);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Kisan Mitra',
      phone,
      state,
      district,
      primaryCrops,
      landSizeAcres: landAcres,
      soilType,
      preferredLanguage: currentLang,
    };
    onLoginSuccess(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121b12] border border-[#a3b18a]/30 shadow-2xl overflow-hidden text-[#f2f2e8]">
        {/* Modal Header */}
        <div className="p-6 bg-[#141d14] border-b border-[#a3b18a]/20 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-[#0a110a] hover:bg-[#1a241a] text-[#f2f2e8]/60 hover:text-[#f2f2e8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1a241a] border border-[#a3b18a]/30 flex items-center justify-center shadow-lg text-[#a3b18a]">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-light text-[#f2f2e8] font-serif">
                {userProfile ? 'Kisan Profile & Farm Settings' : 'Farmer Login / किसान प्रवेश'}
              </h3>
              <p className="text-xs text-[#a3b18a] font-light">
                {userProfile ? 'Manage your crop & land profile' : 'Sign in to customize weather & disease alerts'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {userProfile ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141d14] border border-[#a3b18a]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-base text-[#f2f2e8]">{userProfile.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#a3b18a]/20 text-[#a3b18a] font-semibold uppercase tracking-wider">
                    {userProfile.state}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#f2f2e8]/70 pt-1 font-light">
                  <div>
                    <span className="text-[#f2f2e8]/40">Phone: </span>
                    <span className="font-mono text-[#f2f2e8]">{userProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#f2f2e8]/40">District: </span>
                    <span className="text-[#f2f2e8]">{userProfile.district}</span>
                  </div>
                  <div>
                    <span className="text-[#f2f2e8]/40">Farm Area: </span>
                    <span className="text-[#f2f2e8] font-bold">{userProfile.landSizeAcres} Acres</span>
                  </div>
                  <div>
                    <span className="text-[#f2f2e8]/40">Soil: </span>
                    <span className="text-[#f2f2e8]">{userProfile.soilType}</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-[#f2f2e8]/40 text-[11px]">Primary Crops: </span>
                  <span className="text-[#a3b18a] font-semibold text-xs">
                    {userProfile.primaryCrops.join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={onLogout}
                  className="px-4 py-2.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-red-300 text-xs font-bold transition-colors uppercase tracking-wider text-[11px]"
                >
                  Logout / साइन आउट
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] text-xs font-bold shadow-md transition-colors uppercase tracking-wider text-[11px]"
                >
                  Continue to App
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <div className="space-y-5">
              {/* 1-Click Demo Profiles */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#a3b18a] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>1-Click Instant Demo Login:</span>
                  </span>
                  <span className="text-[10px] text-[#f2f2e8]/40">No password needed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {demoProfiles.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => handleQuickLogin(demo)}
                      className="p-3 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/20 text-left transition-all hover:scale-[1.02]"
                    >
                      <p className="font-semibold text-xs text-[#f2f2e8] line-clamp-1">{demo.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-[#a3b18a] font-light">{demo.state}</p>
                      <p className="text-[9px] text-[#f2f2e8]/40 line-clamp-1">{demo.primaryCrops.join(', ')}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#a3b18a]/20" />
                <span className="flex-shrink mx-3 text-[10px] text-[#f2f2e8]/40 font-semibold uppercase tracking-wider">
                  Or enter your details
                </span>
                <div className="flex-grow border-t border-[#a3b18a]/20" />
              </div>

              {/* Farmer Profile Input Form */}
              <form onSubmit={handleCustomLogin} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">Farmer Name (नाम):</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] placeholder-[#f2f2e8]/40 focus:outline-none focus:border-[#a3b18a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">Mobile Number (मोबाइल):</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] font-mono placeholder-[#f2f2e8]/40 focus:outline-none focus:border-[#a3b18a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">State (राज्य):</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] focus:outline-none focus:border-[#a3b18a]"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Odisha">Odisha</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">District (ज़िला):</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Ludhiana"
                      className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] focus:outline-none focus:border-[#a3b18a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">Land (Acres):</label>
                    <input
                      type="number"
                      step={0.5}
                      min={0.5}
                      value={landAcres}
                      onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] font-mono focus:outline-none focus:border-[#a3b18a]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] font-bold text-xs sm:text-sm shadow-xl border border-[#a3b18a] flex items-center justify-center gap-2 transition-all mt-2 uppercase tracking-wider"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0a110a]" />
                  <span>Login with OTP Verification (ओटीपी द्वारा प्रवेश)</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
