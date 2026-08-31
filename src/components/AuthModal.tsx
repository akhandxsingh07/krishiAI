import React, { useEffect, useRef, useState } from 'react';
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from 'firebase/auth';
import { X, Sprout, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { getTranslation } from '../locales/translations';
import { auth, firebaseEnabled } from '../firebase';

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
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('Sardar Ramesh Singh');
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');
  const [landAcres, setLandAcres] = useState(4.5);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const demoProfiles: UserProfile[] = [
    { id: 'demo-ramesh', name: 'Sardar Ramesh Singh', phone: '9876543210', state: 'Punjab', district: 'Ludhiana', primaryCrops: ['Wheat', 'Rice / Paddy', 'Mustard'], landSizeAcres: 5.0, soilType: 'Alluvial', preferredLanguage: 'pa', role: 'farmer' },
    { id: 'demo-lakshmi', name: 'Lakshmi Devi', phone: '9848012345', state: 'Andhra Pradesh', district: 'Guntur', primaryCrops: ['Chilli', 'Cotton', 'Paddy'], landSizeAcres: 3.5, soilType: 'Black', preferredLanguage: 'te', role: 'farmer' },
    { id: 'demo-rajesh', name: 'Dr. Rajesh Verma (Agronomist)', phone: '9811223344', state: 'Uttar Pradesh', district: 'Varanasi', primaryCrops: ['Rice', 'Wheat', 'Vegetables'], landSizeAcres: 8.0, soilType: 'Alluvial', preferredLanguage: 'hi', role: 'expert' },
  ];

  const resetRecaptcha = () => {
    recaptchaRef.current?.clear();
    recaptchaRef.current = null;
    if (recaptchaContainerRef.current) recaptchaContainerRef.current.innerHTML = '';
  };

  const getRecaptcha = () => {
    if (!auth || !recaptchaContainerRef.current) throw new Error('Firebase Phone Authentication is not configured.');
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, { size: 'invisible' });
    }
    return recaptchaRef.current;
  };

  const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    return '';
  };

  const handleQuickLogin = (demo: UserProfile) => {
    onLoginSuccess(demo);
    onClose();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const e164Phone = normalizePhone(phone);
    if (!e164Phone) return setError('Enter a valid 10-digit Indian mobile number.');
    if (!firebaseEnabled || !auth) return setError('Firebase OTP is not configured. Add the VITE_FIREBASE_* values to .env.local.');

    setSendingOtp(true);
    try {
      const result = await signInWithPhoneNumber(auth, e164Phone, getRecaptcha());
      setConfirmation(result);
      setOtpSent(true);
      setOtp('');
    } catch (err: any) {
      resetRecaptcha();
      const code = err?.code || '';
      if (code === 'auth/invalid-phone-number') setError('Firebase rejected this phone number. Check the number and country code.');
      else if (code === 'auth/too-many-requests') setError('Too many attempts. Wait before requesting another OTP.');
      else if (code === 'auth/quota-exceeded') setError('Firebase SMS quota has been exceeded for this project.');
      else if (code === 'auth/operation-not-allowed') setError('Phone sign-in is not enabled in Firebase Authentication.');
      else setError(err?.message || 'Could not send OTP. Check Firebase configuration and authorized domains.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!confirmation) return setError('Request an OTP first.');
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit OTP.');

    setVerifyingOtp(true);
    try {
      const credential = await confirmation.confirm(otp);
      const firebaseUser = credential.user;
      const profile: UserProfile = {
        id: firebaseUser.uid,
        name: name.trim() || 'Kisan Mitra',
        phone: firebaseUser.phoneNumber || normalizePhone(phone),
        state,
        district,
        primaryCrops: ['Wheat', 'Rice / Paddy'],
        landSizeAcres: landAcres,
        soilType: 'Alluvial',
        preferredLanguage: currentLang,
        role: 'farmer',
      };
      onLoginSuccess(profile);
      resetRecaptcha();
      setConfirmation(null);
      setOtpSent(false);
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-verification-code') setError('Incorrect OTP. Please check the 6-digit code.');
      else if (code === 'auth/code-expired') setError('This OTP has expired. Request a new OTP.');
      else setError(err?.message || 'OTP verification failed.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleBackToPhone = () => {
    setOtpSent(false);
    setOtp('');
    setConfirmation(null);
    setError('');
    resetRecaptcha();
  };

  const handleLogout = async () => {
    try {
      if (auth?.currentUser) await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign-out failed:', err);
    } finally {
      onLogout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121b12] border border-[#a3b18a]/30 shadow-2xl overflow-hidden text-[#f2f2e8]">
        <div className="p-6 bg-[#141d14] border-b border-[#a3b18a]/20 relative">
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full bg-[#0a110a] hover:bg-[#1a241a] text-[#f2f2e8]/60 hover:text-[#f2f2e8] transition-colors" aria-label="Close"><X className="w-4 h-4" /></button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1a241a] border border-[#a3b18a]/30 flex items-center justify-center shadow-lg text-[#a3b18a]"><Sprout className="w-6 h-6" /></div>
            <div>
              <h3 className="text-xl font-light text-[#f2f2e8] font-serif">{userProfile ? 'Kisan Profile & Farm Settings' : 'Farmer Login / किसान प्रवेश'}</h3>
              <p className="text-xs text-[#a3b18a] font-light">{userProfile ? 'Manage your crop & land profile' : 'Sign in to customize weather & disease alerts'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {userProfile ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141d14] border border-[#a3b18a]/20 space-y-2">
                <div className="flex items-center justify-between"><span className="font-semibold text-base">{userProfile.name}</span><span className="text-[10px] px-2 py-0.5 rounded bg-[#a3b18a]/20 text-[#a3b18a] font-semibold uppercase">{userProfile.state}</span></div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#f2f2e8]/70 pt-1">
                  <div>Phone: <span className="font-mono text-[#f2f2e8]">{userProfile.phone}</span></div><div>District: <span className="text-[#f2f2e8]">{userProfile.district}</span></div>
                  <div>Farm Area: <span className="text-[#f2f2e8] font-bold">{userProfile.landSizeAcres} Acres</span></div><div>Soil: <span className="text-[#f2f2e8]">{userProfile.soilType}</span></div>
                </div>
                <div>Primary Crops: <span className="text-[#a3b18a] font-semibold">{userProfile.primaryCrops.join(', ')}</span></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <button onClick={handleLogout} className="px-4 py-2.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-red-300 text-[11px] font-bold uppercase">Logout / साइन आउट</button>
                <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] text-[11px] font-bold uppercase">Continue to App</button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs"><span className="font-semibold text-[#a3b18a] flex items-center gap-1.5 uppercase tracking-wider text-[11px]"><Sparkles className="w-3.5 h-3.5 text-amber-400" />1-CLICK INSTANT DEMO LOGIN:</span><span className="text-[10px] text-[#f2f2e8]/40">No OTP needed</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {demoProfiles.map((demo) => <button key={demo.id} type="button" onClick={() => handleQuickLogin(demo)} className="p-3 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/20 text-left transition-all hover:scale-[1.02]"><p className="font-semibold text-xs">{demo.name.split(' ')[0]}</p><p className="text-[10px] text-[#a3b18a]">{demo.state}</p><p className="text-[9px] text-[#f2f2e8]/40 line-clamp-1">{demo.primaryCrops.join(', ')}</p></button>)}
                </div>
              </div>

              <div className="relative flex py-1 items-center"><div className="flex-grow border-t border-[#a3b18a]/20" /><span className="flex-shrink mx-3 text-[10px] text-[#f2f2e8]/40 font-semibold uppercase tracking-wider">OR VERIFY YOUR MOBILE NUMBER</span><div className="flex-grow border-t border-[#a3b18a]/20" /></div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">Farmer Name (नाम):</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs mt-1" /></div>
                    <div><label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">Mobile Number (मोबाइल):</label><input type="tel" required inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs mt-1 font-mono" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">State (राज्य):</label><select value={state} onChange={(e) => setState(e.target.value)} className="w-full px-2.5 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs mt-1"><option>Punjab</option><option>Haryana</option><option>Uttar Pradesh</option><option>Andhra Pradesh</option><option>Maharashtra</option><option>Karnataka</option><option>Gujarat</option><option>West Bengal</option><option>Madhya Pradesh</option><option>Tamil Nadu</option><option>Bihar</option><option>Odisha</option></select></div>
                    <div><label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">District (ज़िला):</label><input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Ludhiana" className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs mt-1" /></div>
                    <div><label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">Land (Acres):</label><input type="number" step={0.5} min={0.5} value={landAcres} onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)} className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs mt-1 font-mono" /></div>
                  </div>
                  <button type="submit" disabled={sendingOtp} className="w-full py-3 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] disabled:opacity-50 text-[#0a110a] font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider"><ShieldCheck className="w-4 h-4" />{sendingOtp ? 'Sending OTP…' : 'Send OTP / ओटीपी भेजें'}</button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="rounded-xl bg-[#141d14] border border-[#a3b18a]/20 p-4"><p className="text-xs text-[#f2f2e8]/70">OTP sent to</p><strong className="font-mono text-sm text-[#a3b18a]">{normalizePhone(phone)}</strong><p className="text-[10px] text-[#f2f2e8]/40 mt-1">Enter the 6-digit code received by SMS.</p></div>
                  <div><label className="text-[10px] uppercase tracking-wider font-semibold text-[#a3b18a]">OTP (ओटीपी)</label><input type="text" required autoFocus inputMode="numeric" maxLength={6} pattern="[0-9]{6}" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="••••••" className="w-full px-3 py-3 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-center tracking-[0.6em] text-lg mt-1 font-mono" /></div>
                  <button type="submit" disabled={verifyingOtp} className="w-full py-3 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] disabled:opacity-50 text-[#0a110a] font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider"><ShieldCheck className="w-4 h-4" />{verifyingOtp ? 'Verifying…' : 'Verify OTP & Login / प्रवेश करें'}</button>
                  <button type="button" onClick={handleBackToPhone} className="w-full py-2 text-[#a3b18a] text-[11px] font-semibold flex items-center justify-center gap-2"><ArrowLeft className="w-3 h-3" />Change number / नया नंबर</button>
                </form>
              )}

              {error && <div className="rounded-lg border border-red-700/40 bg-red-950/30 p-3 text-[11px] leading-5 text-red-200">{error}</div>}
              <div ref={recaptchaContainerRef} />
              <p className="text-[9px] leading-4 text-[#f2f2e8]/35 text-center">You may receive an SMS for verification. Standard SMS rates may apply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
