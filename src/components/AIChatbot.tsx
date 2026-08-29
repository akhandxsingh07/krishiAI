import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareText,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Sprout,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, Language, UserProfile } from '../types';
import { getTranslation } from '../locales/translations';

interface AIChatbotProps {
  currentLang: Language;
  userProfile: UserProfile | null;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({
  currentLang,
  userProfile,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = (key: string) => getTranslation(currentLang, key);

  // Initialize initial greeting in the chosen language
  useEffect(() => {
    const welcomeMessages: Record<string, string> = {
      en: `Namaste! I am **Krishi Saathi (कृषि साथी)**, your AI Agricultural Advisor.\n\nAsk me anything about:\n• Crop diseases & exact pesticide/fungicide dosages\n• Fertilizer schedules (Urea, DAP, Potash, Micronutrients)\n• Organic farming (Jeevamrit, Neem oil, Bio-fungicides)\n• Weather alerts, spray windows & Mandi market prices\n\nHow is your crop doing today?`,
      hi: `नमस्ते किसान भाई! मैं **कृषि साथी (Krishi Saathi)** हूँ, आपका डिजिटल कृषि सलाहकार।\n\nआप मुझसे पूछ सकते हैं:\n• फसलों के रोग, कीट और रासायनिक व जैविक उपचार की सही मात्रा\n• यूरिया, डीएपी, पोटाश और जिंक खाद डालने का सही समय\n• मौसम अनुसार कीटनाशक छिड़काव का सही समय\n• सरकारी योजनाएं (PM-Kisan, फसल बीमा) व मंडी भाव\n\nआज आपकी फसल में क्या सहायता चाहिए?`,
      pa: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ **ਕ੍ਰਿਸ਼ੀ ਸਾਥੀ** ਹਾਂ।\n\nਤੁਸੀਂ ਕਣਕ, ਝੋਨਾ, ਨਰਮਾ ਜਾਂ ਸਬਜ਼ੀਆਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ, ਖਾਦਾਂ ਦੀ ਸਹੀ ਮਾਤਰਾ ਜਾਂ ਸਪਰੇਅ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।`,
      bn: `নমস্কার কৃষক ভাই! আমি **কৃষি সাথী (Krishi Saathi)**, আপনার ডিজিটাল কৃষি উপদেষ্টা। ধান, গম, আলু বা শাকসবজির রোগ ও সারের সঠিক ব্যবহার সম্পর্কে জানতে আমাকে জিজ্ঞাসা করুন।`,
      te: `నమస్కారం రైతు సోదరులారా! నేను మీ **కృషి సాథీ** (Krishi Saathi). పంట తెగుళ్లు, నివారణ మందుల మోతాదు మరియు ఎరువుల వాడకం గురించి నన్ను అడగండి.`,
      ta: `வணக்கம் விவசாய தோழரே! நான் உங்கள் **கிருஷி சாதி (Krishi Saathi)**. பயிர் நோய்கள், பூச்சிக்கொல்லி மருந்துகள் மற்றும் உரங்கள் பற்றி என்னிடம் கேளுங்கள்.`,
      mr: `नमस्कार शेतकरी बंधूंनो! मी आपला **कृषी साथी (Krishi Saathi)** आहे. पिकांवरील रोग, खतांचे योग्य प्रमाण व कीटकनाशक फवारणी संदर्भात कोणताही प्रश्न विचारा.`,
      gu: `નમસ્તે ખેડૂત મિત્રો! હું તમારો **કૃષિ સાથી** છું. પાકના રોગો, ખાતર અને જંતુનાશક દવાનો યોગ્ય છંટકાવ જાણવા પ્રશ્ન પૂછો.`,
      kn: `ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು ನಿಮ್ಮ **ಕೃಷಿ ಸಾಥಿ**. ಬೆಳೆ ರೋಗಗಳು, ಕೀಟನಾಶಕಗಳ ಬಳಕೆ ಮತ್ತು ರಸಗೊಬ್ಬರಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.`,
      ml: `നമസ്കാരം കർഷക സുഹൃത്തുക്കളെ! ഞാൻ നിങ്ങളുടെ **കൃഷി സാഥി** ആണ്. വിള രോഗങ്ങൾ, വളപ്രയോഗം എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കാം.`,
      or: `ନମସ୍କାର କୃଷକ ଭାଇ! ମୁଁ ଆପଣଙ୍କର **କୃଷି ସାଥୀ**। ଫସଲ ରୋଗ ଓ ସାର ପ୍ରୟୋଗ ବିଷୟରେ ପଚାରନ୍ତୁ।`,
    };

    const initialText = welcomeMessages[currentLang] || welcomeMessages.en;
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: currentLang,
      },
    ]);
  }, [currentLang]);

  // Handle incoming initial prompt from diagnostic card
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition (STT) setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        pa: 'pa-IN',
        bn: 'bn-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        or: 'or-IN',
      };

      recognition.lang = langMap[currentLang] || 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Text to Speech (TTS)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      pa: 'pa-IN',
      bn: 'bn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      or: 'or-IN',
    };
    utterance.lang = langMap[currentLang] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages,
          language: currentLang,
          userProfile,
        }),
      });

      if (!res.ok) throw new Error('Chat API response failed');
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: currentLang,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Chat error fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `For your query: **${query}**\n\n• For fungal foliar spots, spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin @ 1 ml/L.\n• For organic protection, use 5% Neem Seed Kernel Extract (NSKE) or Trichoderma viride.\n• Ensure spraying is done when wind speeds are under 15 km/h with no rain forecasted in the next 6 hours.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'How to control Yellow Rust in Wheat? (गेहूँ में पीला रतुआ)',
    'Rice Blast fungicide dosage per acre? (धान का झुलसा)',
    'When to apply 2nd dose of Urea in Paddy?',
    'Organic recipe for Whitefly in Cotton? (कपास सफेद मक्खी)',
    'Tomato Early Blight symptoms & chemical spray',
    'Best drip irrigation schedule for Vegetables',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 text-[#a3b18a] text-xs uppercase tracking-widest font-semibold">
          <Bot className="w-3.5 h-3.5" />
          <span>Krishi Saathi AI • 24/7 Farmer Companion</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light text-[#f2f2e8] font-serif">
          {t('chatbotTitle')}
        </h2>
        <p className="text-sm text-[#f2f2e8]/70 max-w-2xl mx-auto font-light">
          {t('chatbotSubtitle')}
        </p>
      </div>

      {/* Main Chat Box Container */}
      <div className="rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-2xl overflow-hidden flex flex-col h-[620px]">
        {/* Chat Header Bar */}
        <div className="p-4 bg-[#141d14] border-b border-[#a3b18a]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a241a] border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a] shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#f2f2e8]">Krishi Saathi (कृषि साथी)</span>
                <span className="w-2 h-2 rounded-full bg-[#a3b18a] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#a3b18a] font-light">Online • ICAR Agronomy Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const firstMsg = messages[0];
                setMessages([firstMsg]);
              }}
              className="p-2 rounded-lg bg-[#0a110a] hover:bg-[#1a241a] text-[#f2f2e8]/70 text-xs flex items-center gap-1 border border-[#a3b18a]/20 transition-colors uppercase tracking-wider text-[11px]"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-[#141d14] border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-xl space-y-2 shadow-md ${
                    isBot
                      ? 'bg-[#141d14] border border-[#a3b18a]/20 text-[#f2f2e8] font-light'
                      : 'bg-[#a3b18a] text-[#0a110a] font-semibold'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-75 border-t border-[#a3b18a]/20">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-[#a3b18a] transition-colors flex items-center gap-1"
                        title="Listen to voice output"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>Voice</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-[#a3b18a]/20 border border-[#a3b18a]/40 flex items-center justify-center text-[#a3b18a] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#141d14] border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a] shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-xl bg-[#141d14] border border-[#a3b18a]/20 text-[#a3b18a] flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#a3b18a] animate-ping" />
                <span>Krishi Saathi is analyzing agronomic recommendations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2.5 bg-[#0a110a] border-t border-[#a3b18a]/20 overflow-x-auto no-scrollbar flex items-center gap-2 text-[11px]">
          <span className="text-[#f2f2e8]/50 font-semibold shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wider">
            <HelpCircle className="w-3 h-3 text-[#a3b18a]" />
            <span>Frequent:</span>
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/20 text-[#f2f2e8]/80 whitespace-nowrap transition-colors text-[11px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#141d14] border-t border-[#a3b18a]/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-3 rounded-lg border transition-all ${
                isListening
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-[#0a110a] hover:bg-[#1a241a] text-[#a3b18a] border-[#a3b18a]/30'
              }`}
              title="Click to speak (Hindi, Punjabi, English, Telugu, etc.)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : t('chatPlaceholder')}
              className="flex-1 px-4 py-3 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs sm:text-sm text-[#f2f2e8] placeholder-[#f2f2e8]/40 focus:outline-none focus:border-[#a3b18a]"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-3 rounded-lg font-bold text-[#0a110a] shadow-md transition-all ${
                !inputText.trim() || isLoading
                  ? 'bg-[#1a241a] text-[#f2f2e8]/30 border border-[#a3b18a]/10 cursor-not-allowed'
                  : 'bg-[#a3b18a] hover:bg-[#b5c49c] border border-[#a3b18a]'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
