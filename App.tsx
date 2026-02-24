
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { POPULAR_GAMES, BUDGET_RANGES, ALGERIA_WILLAYAS, TRANSLATIONS } from './constants';
import { AppStatus, PCRecommendation, Game, Language, UserContact, LeadPayload } from './types';
import { getPCRecommendation } from './services/geminiService';
import { sendLeadToWebhook, formatWhatsAppLink } from './services/leadService';
import { GameCard } from './components/GameCard';
import { PerformanceChart } from './components/PerformanceChart';

const SYSTEM_WEBHOOK = "https://discord.com/api/webhooks/12123456789/dummy-key"; 
const SYSTEM_WHATSAPP = "213550000000"; 

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [budget, setBudget] = useState<number>(135000);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [recommendation, setRecommendation] = useState<PCRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [loadingStep, setLoadingStep] = useState(0);
  const [userContact, setUserContact] = useState<UserContact>({ name: '', phone: '', willaya: '' });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserContact, string>>>({});

  const t = useMemo(() => TRANSLATIONS[language], [language]);
  const isRTL = language === 'ar';

  const loadingMessages = useMemo(() => {
    if (language === 'ar') return [
      "مزامنة مخزون القطع المباشر...",
      `تحليل متطلبات تشغيل ${selectedGame?.title}...`,
      "تحسين التوافق بين المعالج وكرت الشاشة...",
      "حساب مؤشرات الأداء المتوقعة...",
      "جدولة خدمة التركيب والتدريب..."
    ];
    if (language === 'fr') return [
      "Synchronisation du stock matériel...",
      `Analyse des besoins pour ${selectedGame?.title}...`,
      "Optimisation de la synergie CPU/GPU...",
      "Calcul des performances estimées...",
      "Planification du service de montage..."
    ];
    return [
      "Syncing live hardware inventory...",
      `Analyzing ${selectedGame?.title} requirements...`,
      "Optimizing CPU and GPU synergy...",
      "Simulating performance benchmarks...",
      "Finalizing on-site build plan..."
    ];
  }, [language, selectedGame]);

  useEffect(() => {
    let interval: number;
    if (status === AppStatus.LOADING) {
      interval = window.setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [status, loadingMessages]);

  const validateForm = () => {
    const errors: Partial<Record<keyof UserContact, string>> = {};
    if (!userContact.name.trim()) errors.name = t.required;
    const phoneRegex = /^(0?)[567]\d{8}$/;
    if (!userContact.phone.trim()) {
      errors.phone = t.required;
    } else if (!phoneRegex.test(userContact.phone.trim())) {
      errors.phone = t.invalidPhone;
    }
    if (!userContact.willaya) errors.willaya = t.required;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBuild = useCallback(async () => {
    if (!selectedGame) return;
    
    setStatus(AppStatus.LOADING);
    setLoadingStep(0);
    setError(null);
    
    try {
      const result = await getPCRecommendation(selectedGame.title, budget, language, []);
      setRecommendation(result);
      setStatus(AppStatus.SUCCESS);
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      setError(isRTL ? "فشل في إنشاء التوصية. يرجى المحاولة مرة أخرى." : "Failed to generate recommendation. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  }, [selectedGame, budget, language, isRTL]);

  const submitLead = useCallback(async () => {
    if (!validateForm() || !selectedGame || !recommendation) return;
    
    const newLead: LeadPayload = {
      customer: { ...userContact },
      game: selectedGame.title,
      budget: budget,
      recommendation: recommendation,
      timestamp: new Date().toLocaleString()
    };
    
    sendLeadToWebhook(SYSTEM_WEBHOOK, newLead);
    setStatus(AppStatus.SUCCESS);
    
    // Open WhatsApp automatically after booking
    const link = formatWhatsAppLink(SYSTEM_WHATSAPP, newLead, language);
    window.open(link, '_blank');
  }, [userContact, selectedGame, recommendation, budget, language, validateForm]);

  const openWhatsApp = () => {
    if (!recommendation || !selectedGame) return;
    const lead: LeadPayload = {
      customer: userContact,
      game: selectedGame.title,
      budget: budget,
      recommendation: recommendation,
      timestamp: new Date().toLocaleString()
    };
    const link = formatWhatsAppLink(SYSTEM_WHATSAPP, lead, language);
    window.open(link, '_blank');
  };

  const openYoutubeBenchmark = () => {
    if (!recommendation || !selectedGame) return;
    const gpu = recommendation.parts.find(p => p.category.toLowerCase().includes('gpu'))?.name || "";
    const cpu = recommendation.parts.find(p => p.category.toLowerCase().includes('cpu'))?.name || "";
    const query = `${cpu} ${gpu} ${selectedGame.title} benchmark`;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
  };

  const scrollToProofs = () => {
    document.getElementById('proofs-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen pb-20 selection:bg-cyan-500/30 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Pc-Club <span className="text-cyan-400">Parts</span></h1>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl outline-none cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-16 max-w-6xl">
        {status === AppStatus.LOADING && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
            <div className="text-center space-y-8 max-w-md px-10">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg className="w-10 h-10 text-cyan-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white">{t.loading}</h3>
                <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest animate-pulse h-4">
                  {loadingMessages[loadingStep]}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-20 space-y-6">
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
            {isRTL ? (
              <>تجميعة <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">احترافية</span> في ثوانٍ</>
            ) : (
              <>{t.hero.split(' ').slice(0, -2).join(' ')} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{t.hero.split(' ').slice(-2).join(' ')}</span></>
            )}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">{t.subtitle}</p>
        </div>

        {status === AppStatus.ONBOARDING && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom-12 duration-500">
              <h3 className="text-3xl font-black text-white mb-2">{t.step3}</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {isRTL ? "يرجى إكمال ملفك الشخصي لإرسال تجميعتك للمتجر." : "Connect with our club. Complete your profile to finalize your custom build."}
              </p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.formName}</label>
                  <input 
                    type="text"
                    placeholder="Full Name"
                    value={userContact.name}
                    onChange={e => setUserContact({...userContact, name: e.target.value})}
                    className={`w-full bg-slate-950 border ${formErrors.name ? 'border-red-500' : 'border-slate-800'} rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500 transition-all`}
                  />
                  {formErrors.name && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.formPhone}</label>
                  <input 
                    type="tel"
                    placeholder="05 / 06 / 07 ..."
                    value={userContact.phone}
                    onChange={e => setUserContact({...userContact, phone: e.target.value})}
                    className={`w-full bg-slate-950 border ${formErrors.phone ? 'border-red-500' : 'border-slate-800'} rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500 transition-all`}
                  />
                  {formErrors.phone && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.formWillaya}</label>
                  <select 
                    value={userContact.willaya}
                    onChange={e => setUserContact({...userContact, willaya: e.target.value})}
                    className={`w-full bg-slate-950 border ${formErrors.willaya ? 'border-red-500' : 'border-slate-800'} rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500 appearance-none cursor-pointer`}
                  >
                    <option value="">{t.willayaPlaceholder}</option>
                    {ALGERIA_WILLAYAS.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  {formErrors.willaya && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{formErrors.willaya}</p>}
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button onClick={() => setStatus(AppStatus.IDLE)} className="flex-1 py-4 text-slate-500 font-bold hover:text-white transition-colors">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={submitLead} className="flex-[2] py-4 bg-cyan-500 text-white font-black rounded-2xl shadow-xl shadow-cyan-500/20 hover:bg-cyan-400 transition-all">
                  {isRTL ? 'تأكيد الحجز' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-black text-cyan-400">01</div>
            <h3 className="text-3xl font-black text-white">{t.step1}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {POPULAR_GAMES.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                isSelected={selectedGame?.id === game.id} 
                onClick={() => setSelectedGame(game)} 
              />
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-black text-cyan-400">02</div>
            <h3 className="text-3xl font-black text-white">{t.step2}</h3>
          </div>
          <div className="bg-slate-900/40 p-10 rounded-[4rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] -z-10 rounded-full" />
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 w-full space-y-10">
                <div className="flex justify-between items-end">
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t.targetBudget}</label>
                  <div className="text-right">
                    <span className="text-4xl md:text-6xl font-mono font-black text-cyan-400 tabular-nums">
                      {budget.toLocaleString()}
                    </span>
                    <span className="text-xl md:text-2xl font-black text-slate-600 ml-2">{t.currency}</span>
                  </div>
                </div>
                <div className="relative pt-6">
                  <input 
                    type="range" 
                    min="40000" 
                    max="200000" 
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-6">
                    <span className="text-xs font-black text-slate-700">40K {t.currency}</span>
                    <span className="text-xs font-black text-slate-700">200K {t.currency}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {BUDGET_RANGES.map((range) => (
                    <button 
                      key={range.label}
                      onClick={() => setBudget(range.value)}
                      className={`px-6 py-3 rounded-2xl border-2 text-xs font-black transition-all ${
                        budget === range.value 
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                        : 'border-slate-800 text-slate-600 hover:border-slate-600'
                      }`}
                    >
                      {range.label} ({range.value / 1000}K)
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-80">
                <button 
                  disabled={!selectedGame || status === AppStatus.LOADING}
                  onClick={handleBuild}
                  className={`w-full py-10 rounded-[2.5rem] font-black text-3xl transition-all shadow-2xl flex flex-col items-center justify-center gap-3 group relative overflow-hidden ${
                    !selectedGame 
                    ? 'bg-slate-800 text-slate-700 cursor-not-allowed opacity-50' 
                    : 'bg-cyan-500 text-white hover:bg-cyan-400 active:scale-95 shadow-cyan-500/40'
                  }`}
                >
                  <span>{t.generate}</span>
                  <svg className={`w-8 h-8 transition-transform group-hover:translate-x-2 ${isRTL ? 'rotate-180 group-hover:-translate-x-2' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {status === AppStatus.SUCCESS && recommendation && (
          <div className="space-y-20">
            <section id="result-section" className="animate-in fade-in slide-in-from-bottom-20 duration-1000">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-cyan-500 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/40">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white leading-tight">
                      {isRTL ? 'توصية الخبراء' : 'Expert Configuration'}
                    </h3>
                    <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.4em]">
                      {isRTL ? 'تجميعة مثالية' : 'Optimization Complete'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={openWhatsApp}
                  className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-emerald-500 text-white font-black rounded-3xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span>{isRTL ? 'اطلب الآن' : 'Order Now via WhatsApp'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  {/* Component List */}
                  <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
                    <div className="bg-white/5 px-10 py-8 border-b border-white/5 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.componentList}</span>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{t.totalEst}</p>
                        <p className="text-3xl font-mono font-black text-cyan-400">{recommendation.totalEstimatedCost.toLocaleString()} {t.currency}</p>
                      </div>
                    </div>
                    <div className="p-4 md:p-10 space-y-4">
                      {recommendation.parts.map((part, i) => (
                        <React.Fragment key={i}>
                          <div className="group bg-slate-950/40 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-900/60 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">{part.category}</p>
                              <h4 className="text-xl font-black text-white">{part.name}</h4>
                              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{part.reasoning}</p>
                            </div>
                          </div>
                          
                          {/* Service Card inserted mid-way (after 3rd component) */}
                          {i === 2 && (
                            <div className="py-6">
                              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-500/20 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                  <h4 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                                    <span className="w-2 h-8 bg-cyan-500 rounded-full" />
                                    {t.serviceTitle}
                                  </h4>
                                  <button 
                                    onClick={scrollToProofs}
                                    className="self-start md:self-auto bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-cyan-500/20 transition-all duration-300"
                                  >
                                    {t.findMore}
                                  </button>
                                </div>
                                <div className="flex justify-center">
                                  <div className="w-full max-w-sm aspect-[9/16] rounded-[2.5rem] overflow-hidden border-4 border-cyan-500/20 bg-slate-950 shadow-2xl relative group">
                                    <video 
                                      className="w-full h-full object-cover"
                                      controls
                                      playsInline
                                      autoPlay
                                      muted
                                      loop
                                    >
                                      {/* The user's uploaded video should be placed here. Using a placeholder for now. */}
                                      <source src="/mriz.mp4" type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                  </div>
                                </div>
                                <div className="mt-8 flex justify-center">
                                  <button 
                                    onClick={() => setStatus(AppStatus.ONBOARDING)}
                                    className="w-full max-w-sm py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-4"
                                  >
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {t.step3}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic YouTube Benchmark Section */}
                  <div 
                    onClick={openYoutubeBenchmark}
                    className="group bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 cursor-pointer hover:bg-slate-900 transition-all duration-500 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                      <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    </div>
                    <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{t.watchBenchmark}</h4>
                      <p className="text-slate-400 text-lg leading-relaxed">
                        {isRTL 
                          ? `شاهد أداء هذه التجميعة في ${selectedGame?.title} على يوتيوب.` 
                          : `See exactly how this hardware combo handles ${selectedGame?.title} in real-time.`}
                      </p>
                    </div>
                    <div className="bg-white/10 px-8 py-4 rounded-2xl text-white font-black group-hover:bg-red-600 transition-colors">
                      YouTube
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2rem] flex items-start gap-6">
                    <svg className="w-8 h-8 text-amber-500 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-amber-200/80 text-sm font-bold leading-relaxed">{t.usedPartsNote}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">{t.buildAnalysis}</h4>
                      <PerformanceChart data={recommendation.performance} />
                    </div>
                    <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 space-y-8">
                      <div>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{t.bottleneck}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{recommendation.bottleneckAnalysis}</p>
                      </div>
                      <div className="pt-8 border-t border-white/10">
                        <h4 className="text-xs font-black text-cyan-500 uppercase tracking-widest mb-4">{t.proTip}</h4>
                        <p className="text-slate-200 text-lg italic leading-relaxed">"{recommendation.summary}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 h-fit">
                  <div className="bg-slate-900/60 border border-white/10 p-8 rounded-[3rem] space-y-10">
                    <div className="space-y-6">
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">{isRTL ? 'تواصل مع الخبير' : 'Expert Support'}</h4>
                      <button onClick={openWhatsApp} className="w-full py-6 bg-emerald-500 text-white text-xl font-black rounded-3xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-4 shadow-xl shadow-emerald-500/30">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          WhatsApp
                      </button>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-3xl bg-slate-800 flex items-center justify-center border border-white/5">
                        <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-black text-lg">Tested & Ready</p>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Hand-picked components</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-3xl bg-slate-800 flex items-center justify-center border border-white/5">
                        <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-black text-lg">Build & Learn</p>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">On-site build service</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Proofs Section */}
            <section id="proofs-section" className="scroll-mt-24 py-20 border-t border-white/5">
              <div className="text-center mb-16 space-y-4">
                <h3 className="text-4xl md:text-5xl font-black text-white">{t.proofsTitle}</h3>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.proofsSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-6 hover:bg-slate-900/60 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-black text-white">{isRTL ? 'مكونات أصلية مختبرة' : 'Tested Authentic Components'}</h4>
                  <p className="text-slate-400 leading-relaxed">
                    {isRTL 
                      ? 'يخضع كل مكون، سواء كان جديداً أو مستخدماً (مثل كروت الشاشة)، لاختبارات أداء صارمة لضمان الثبات تحت أقصى ضغط.' 
                      : 'Every component, whether brand new or certified used (like GPUs), undergoes rigorous stress testing to ensure stability under peak gaming loads.'}
                  </p>
                  <div className="aspect-video rounded-2xl bg-slate-800 overflow-hidden relative border border-white/5">
                    <img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800" alt="GPU Testing" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-xs uppercase tracking-widest text-white/50">Component Stress Lab</div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-6 hover:bg-slate-900/60 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-black text-white">{isRTL ? 'إتقان هندسي' : 'Expert Engineering Mastery'}</h4>
                  <p className="text-slate-400 leading-relaxed">
                    {isRTL 
                      ? 'نحن لا نركب الأجهزة فقط؛ بل نصممها. تنظيم كابلات احترافي، تدفق هواء مثالي، وتثبيت دقيق لكل قطعة لضمان أفضل عمر افتراضي.' 
                      : 'We don\'t just assemble; we craft. Professional cable management, optimal airflow design, and precision seating for every part to ensure longevity.'}
                  </p>
                  <div className="aspect-video rounded-2xl bg-slate-800 overflow-hidden relative border border-white/5">
                    <img src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800" alt="PC Build" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-xs uppercase tracking-widest text-white/50">Precision Workspace</div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-6 hover:bg-slate-900/60 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-black text-white">{isRTL ? 'الشفافية الكاملة' : 'Complete Client Transparency'}</h4>
                  <p className="text-slate-400 leading-relaxed">
                    {isRTL 
                      ? 'نحن نبني الجهاز معك في منزلك أو موقعك المفضل. تتعلم كيف يعمل جهازك، وكيف تحافظ عليه، وتتأكد من كل قطعة بنفسك.' 
                      : 'We build the rig with you in your home or preferred location. You learn how your machine works, how to maintain it, and verify every part yourself.'}
                  </p>
                  <div className="aspect-video rounded-2xl bg-slate-800 overflow-hidden relative border border-white/5">
                    <img src="https://images.unsplash.com/photo-1587202392491-3211bd911b9a?auto=format&fit=crop&q=80&w=800" alt="Client Collaboration" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-xs uppercase tracking-widest text-white/50">On-Site Workshop</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="mt-40 border-t border-slate-900 pt-20 pb-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8 opacity-50">
            <div className="w-6 h-6 bg-slate-700 rounded-lg" />
            <h2 className="text-lg font-black tracking-tight text-white uppercase">Pc-Club <span className="text-cyan-400">Parts</span></h2>
          </div>
          <p className="text-slate-600 text-xs font-medium max-w-lg mx-auto leading-relaxed">
            &copy; {new Date().getFullYear()} Pc-Club Parts. All Rights Reserved. Hardware strategy and configuration services based in Algeria.
          </p>
        </div>
      </footer>

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default App;
