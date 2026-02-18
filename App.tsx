
import React, { useState, useCallback, useMemo } from 'react';
import { POPULAR_GAMES, BUDGET_RANGES, ALGERIA_WILLAYAS, TRANSLATIONS } from './constants';
import { AppStatus, PCRecommendation, Game, Language, UserContact, LeadPayload } from './types';
import { getPCRecommendation } from './services/geminiService';
import { sendLeadToWebhook, formatWhatsAppLink } from './services/leadService';
import { GameCard } from './components/GameCard';
import { PerformanceChart } from './components/PerformanceChart';

const SYSTEM_WEBHOOK = "https://discord.com/api/webhooks/1473039361422659615/kcLbgEL1YJr-sFKmmsMkw07Zy9Nf2wraYAAfnyvrjKoBS5U9GkNamgbuuBkL8jIT9Ct-";
const SYSTEM_WHATSAPP = "213550000000"; 

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [budget, setBudget] = useState<number>(125000);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [recommendation, setRecommendation] = useState<PCRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isLeadSent, setIsLeadSent] = useState(false);
  const [userContact, setUserContact] = useState<UserContact>({ name: '', phone: '', willaya: '' });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserContact, string>>>({});

  const t = useMemo(() => TRANSLATIONS[language], [language]);
  const isRTL = language === 'ar';

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
    if (status === AppStatus.IDLE || status === AppStatus.ERROR) {
      setStatus(AppStatus.ONBOARDING);
      return;
    }
    if (status === AppStatus.ONBOARDING) {
      if (!validateForm()) return;
      setStatus(AppStatus.LOADING);
      setError(null);
      setIsLeadSent(false);
      try {
        const result = await getPCRecommendation(selectedGame.title, budget, language, []);
        
        const newLead: LeadPayload = {
          customer: { ...userContact },
          game: selectedGame.title,
          budget: budget,
          recommendation: result,
          timestamp: new Date().toLocaleString()
        };
        
        const success = await sendLeadToWebhook(SYSTEM_WEBHOOK, newLead);
        if (success) setIsLeadSent(true);
        
        setRecommendation(result);
        setStatus(AppStatus.SUCCESS);
        
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } catch (err) {
        setError(isRTL ? "فشل في إنشاء التوصية. يرجى المحاولة مرة أخرى." : "Failed to generate recommendation. Please try again.");
        setStatus(AppStatus.ERROR);
      }
    }
  }, [selectedGame, budget, language, userContact, status, t, isRTL]);

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
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button onClick={() => setStatus(AppStatus.IDLE)} className="flex-1 py-4 text-slate-500 font-bold hover:text-white transition-colors">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={handleBuild} className="flex-[2] py-4 bg-cyan-500 text-white font-black rounded-2xl shadow-xl shadow-cyan-500/20 hover:bg-cyan-400 transition-all">
                  {t.generate}
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
                  {status === AppStatus.LOADING ? (
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t.generate}</span>
                      <svg className={`w-8 h-8 transition-transform group-hover:translate-x-2 ${isRTL ? 'rotate-180 group-hover:-translate-x-2' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {status === AppStatus.SUCCESS && recommendation && (
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
                    {isRTL ? 'توصية الخبراء' : 'Club Recommendation'}
                  </h3>
                  <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.4em]">
                    {isLeadSent ? (isRTL ? 'تم تأكيد التجميعة' : 'Configuration Locked') : (isRTL ? 'تجميعة مثالية' : 'Optimization Complete')}
                  </p>
                </div>
              </div>
              <button 
                onClick={openWhatsApp}
                className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-emerald-500 text-white font-black rounded-3xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                 <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                 <span>{isRTL ? 'اطلب عبر واتساب' : 'Inquire via WhatsApp'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
                  <div className="bg-white/5 px-10 py-8 border-b border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.componentList}</span>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-cyan-500 block mb-1 uppercase tracking-widest">{isRTL ? 'السعر النهائي' : 'Final Build Price'}</span>
                      <span className="text-4xl font-mono font-black text-white tabular-nums">{recommendation.totalEstimatedCost.toLocaleString()} <span className="text-sm font-bold opacity-30">{t.currency}</span></span>
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {recommendation.parts.map((part, idx) => (
                      <div key={idx} className="p-10 hover:bg-white/[0.02] transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div className="flex gap-8">
                            <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 group-hover:scale-105 transition-all flex-shrink-0">
                              {part.category.toLowerCase().includes('cpu') && <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M7.757 16.243l-1.414 1.414m0-11.314l1.414 1.414m8.486 8.486l1.414 1.414" strokeWidth={1.5}/></svg>}
                              {part.category.toLowerCase().includes('gpu') && <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" strokeWidth={1.5}/></svg>}
                              {!part.category.toLowerCase().includes('cpu') && !part.category.toLowerCase().includes('gpu') && <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth={1.5}/></svg>}
                            </div>
                            <div className="space-y-2">
                              <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{part.category}</div>
                              <div className="text-2xl font-black text-white">{part.name}</div>
                              <p className="text-slate-500 text-sm leading-relaxed max-w-lg">{part.reasoning}</p>
                            </div>
                          </div>
                          {/* Individual prices removed as per user request */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <PerformanceChart data={recommendation.performance} />
                <div className="bg-slate-900/60 border border-white/5 rounded-[4rem] p-10 shadow-2xl">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">{t.buildAnalysis}</h4>
                  <div className="space-y-10">
                    <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-[2.5rem]">
                      <div className="flex items-center gap-3 text-orange-400 mb-5">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.bottleneck}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{recommendation.bottleneckAnalysis}</p>
                    </div>
                    <div className="p-8 bg-cyan-500/5 border border-cyan-500/10 rounded-[2.5rem]">
                      <div className="flex items-center gap-3 text-cyan-400 mb-5">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.proTip}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{recommendation.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {error && (
          <div className="mt-10 p-12 bg-red-500/10 border border-red-500/20 rounded-[3rem] text-red-500 text-center font-black animate-pulse uppercase tracking-widest">
            {error}
          </div>
        )}
      </main>

      <footer className="mt-40 border-t border-slate-900/50 py-20 bg-slate-950/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div>
            <h4 className="text-white font-black text-2xl mb-2">Pc-Club <span className="text-cyan-500">Parts</span></h4>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">High-End Performance Systems for the Algerian Gaming Scene</p>
          </div>
          <div className="flex gap-12">
            <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Store Locations</a>
            <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Contact Club</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
