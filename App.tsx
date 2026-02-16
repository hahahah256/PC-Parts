
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { POPULAR_GAMES, BUDGET_RANGES, ALGERIA_WILLAYAS, TRANSLATIONS } from './constants';
import { AppStatus, PCRecommendation, Game, Language, UserContact, StockItem, AdminSettings, LeadPayload } from './types';
import { getPCRecommendation } from './services/geminiService';
import { sendLeadToWebhook, formatWhatsAppLink } from './services/leadService';
import { GameCard } from './components/GameCard';
import { PerformanceChart } from './components/PerformanceChart';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [budget, setBudget] = useState<number>(140000);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [recommendation, setRecommendation] = useState<PCRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Admin Auth Logic
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('rigcraft_admin_authenticated') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState(false);

  // Lead transmission status
  const [isLeadSent, setIsLeadSent] = useState(false);

  // Stock / Inventory Control
  const [showStockManager, setShowStockManager] = useState(false);
  const [stock, setStock] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('rigcraft_stock');
    return saved ? JSON.parse(saved) : [];
  });
  const [newStockItem, setNewStockItem] = useState({ category: '', name: '' });
  const [bulkImportText, setBulkImportText] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'list' | 'bulk' | 'settings'>('list');

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('rigcraft_admin');
    return saved ? JSON.parse(saved) : { webhookUrl: '', whatsappNumber: '213' };
  });

  // Onboarding Form
  const [userContact, setUserContact] = useState<UserContact>({ name: '', phone: '', willaya: '' });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserContact, string>>>({});

  const t = useMemo(() => TRANSLATIONS[language], [language]);
  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('rigcraft_admin', JSON.stringify(adminSettings));
    localStorage.setItem('rigcraft_stock', JSON.stringify(stock));
  }, [adminSettings, stock]);

  const handleAdminAccess = () => {
    if (isAdminAuthenticated) {
      setShowStockManager(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLogin = () => {
    if (adminPinInput === process.env.ADMIN_KEY) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('rigcraft_admin_authenticated', 'true');
      setShowAdminLogin(false);
      setShowStockManager(true);
      setAdminPinInput('');
      setAdminLoginError(false);
    } else {
      setAdminLoginError(true);
      setAdminPinInput('');
    }
  };

  const handleBulkImport = () => {
    const lines = bulkImportText.split('\n');
    const newItems: StockItem[] = [];
    lines.forEach(line => {
      const [category, ...nameParts] = line.split(':');
      const name = nameParts.join(':').trim();
      if (category && name) {
        newItems.push({
          id: (Date.now() + Math.random()).toString(),
          category: category.trim(),
          name: name
        });
      }
    });
    setStock([...stock, ...newItems]);
    setBulkImportText('');
    setActiveAdminTab('list');
  };

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
        const result = await getPCRecommendation(selectedGame.title, budget, language, stock);
        setRecommendation(result);
        setStatus(AppStatus.SUCCESS);
        const lead: LeadPayload = {
          customer: userContact,
          game: selectedGame.title,
          budget: budget,
          recommendation: result,
          timestamp: new Date().toLocaleString()
        };
        if (adminSettings.webhookUrl) {
          sendLeadToWebhook(adminSettings.webhookUrl, lead).then(success => {
            if (success) setIsLeadSent(true);
          });
        }
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } catch (err) {
        setError(isRTL ? "فشل في إنشاء التوصية. يرجى المحاولة مرة أخرى." : "Failed to generate recommendation. Please try again.");
        setStatus(AppStatus.ERROR);
      }
    }
  }, [selectedGame, budget, language, userContact, stock, status, t, isRTL, adminSettings]);

  const addStockItem = () => {
    if (newStockItem.category && newStockItem.name) {
      setStock([...stock, { ...newStockItem, id: Date.now().toString() }]);
      setNewStockItem({ category: '', name: '' });
    }
  };

  const openWhatsApp = () => {
    if (!recommendation || !selectedGame) return;
    const lead: LeadPayload = {
      customer: userContact,
      game: selectedGame.title,
      budget: budget,
      recommendation: recommendation,
      timestamp: new Date().toLocaleString()
    };
    const link = formatWhatsAppLink(adminSettings.whatsappNumber, lead, language);
    window.open(link, '_blank');
  };

  return (
    <div className={`min-h-screen pb-20 selection:bg-cyan-500/30 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              onClick={handleAdminAccess} 
              className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                isAdminAuthenticated ? 'bg-cyan-500 shadow-cyan-500/20' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {isAdminAuthenticated ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter text-white">RigCraft <span className="text-cyan-400">AI</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-slate-900 border border-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white text-center mb-2">Creator Login</h2>
            <p className="text-slate-500 text-center text-sm mb-8">Enter your secret key to access inventory management.</p>
            <div className="space-y-4">
              <input 
                type="password"
                placeholder="Secret Admin Key"
                value={adminPinInput}
                onChange={e => setAdminPinInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                className={`w-full bg-slate-950 border ${adminLoginError ? 'border-red-500' : 'border-slate-800'} rounded-2xl px-6 py-4 text-white text-center font-mono tracking-[0.5em] text-xl outline-none focus:border-cyan-500 transition-all`}
                autoFocus
              />
              {adminLoginError && <p className="text-red-500 text-xs text-center font-bold">Invalid Admin Key</p>}
              <button 
                onClick={handleAdminLogin}
                className="w-full py-4 bg-cyan-500 text-white font-black rounded-2xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                Access Dashboard
              </button>
              <button 
                onClick={() => setShowAdminLogin(false)}
                className="w-full py-2 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Manager Modal */}
      {showStockManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-white">Inventory Master</h2>
                <div className="flex gap-4 mt-4">
                  <button onClick={() => setActiveAdminTab('list')} className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeAdminTab === 'list' ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500'}`}>Current Stock</button>
                  <button onClick={() => setActiveAdminTab('bulk')} className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeAdminTab === 'bulk' ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500'}`}>Bulk Import</button>
                  <button onClick={() => setActiveAdminTab('settings')} className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeAdminTab === 'settings' ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500'}`}>Store Settings</button>
                </div>
              </div>
              <button onClick={() => setShowStockManager(false)} className="bg-slate-800 p-2 rounded-xl text-slate-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {activeAdminTab === 'list' && (
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <input 
                      placeholder="Category (e.g. GPU)" 
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-white text-sm outline-none focus:border-cyan-500" 
                      value={newStockItem.category}
                      onChange={e => setNewStockItem({...newStockItem, category: e.target.value})}
                    />
                    <input 
                      placeholder="Full Product Name" 
                      className="flex-[2] bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-white text-sm outline-none focus:border-cyan-500" 
                      value={newStockItem.name}
                      onChange={e => setNewStockItem({...newStockItem, name: e.target.value})}
                    />
                    <button onClick={addStockItem} className="bg-cyan-500 text-white px-6 rounded-2xl hover:bg-cyan-400 font-bold">Add</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stock.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800 group hover:border-cyan-500/30 transition-all">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{item.category}</span>
                          <span className="text-sm font-bold text-white">{item.name}</span>
                        </div>
                        <button onClick={() => setStock(stock.filter(s => s.id !== item.id))} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                    {stock.length === 0 && <p className="col-span-2 text-center py-12 text-slate-600 italic">No parts in inventory yet.</p>}
                  </div>
                </div>
              )}

              {activeAdminTab === 'bulk' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed font-bold">Paste multiple parts here. Format: <span className="text-cyan-400">Category: Part Name</span> (one per line)</p>
                  <textarea 
                    className="w-full h-64 bg-slate-950 border border-slate-800 rounded-[2rem] p-6 text-white text-sm font-mono outline-none focus:border-cyan-500 scrollbar-thin scrollbar-thumb-slate-800"
                    placeholder={"GPU: RTX 4070 Super\nCPU: Core i5-13400F\nRAM: Corsair Vengeance 32GB"}
                    value={bulkImportText}
                    onChange={e => setBulkImportText(e.target.value)}
                  />
                  <button 
                    onClick={handleBulkImport}
                    className="w-full py-4 bg-cyan-500 text-white font-black rounded-2xl hover:bg-cyan-400 transition-all"
                  >
                    Process Bulk List
                  </button>
                </div>
              )}

              {activeAdminTab === 'settings' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Store WhatsApp (Intl Format)</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-cyan-500"
                      value={adminSettings.whatsappNumber}
                      onChange={e => setAdminSettings({...adminSettings, whatsappNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Discord/Slack Webhook (Lead Notifications)</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-cyan-500"
                      value={adminSettings.webhookUrl}
                      onChange={e => setAdminSettings({...adminSettings, webhookUrl: e.target.value})}
                    />
                  </div>
                  <div className="p-6 bg-cyan-500/5 rounded-[2rem] border border-cyan-500/20">
                    <p className="text-xs text-cyan-400 font-bold mb-1">PRO TIP</p>
                    <p className="text-slate-400 text-xs leading-relaxed">Configuring a webhook allows you to receive instant notifications in your team chat whenever a customer generates a build.</p>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setShowStockManager(false)} className="w-full mt-8 py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-100 transition-colors">
              Save & Exit
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 mt-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            {isRTL ? (
              <>ابنِ <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">محطة ألعابك</span></>
            ) : (
              <>{t.hero.split(' ').slice(0, -2).join(' ')} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{t.hero.split(' ').slice(-2).join(' ')}</span></>
            )}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Onboarding Modal */}
        {status === AppStatus.ONBOARDING && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
              <h3 className="text-3xl font-black text-white mb-2">{t.step3}</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {isRTL ? "يرجى ملء بياناتك للبدء في توليد التجميعة الخاصة بك." : "Fill in your details so we can tailor the market availability to your location."}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">{t.formName}</label>
                  <input 
                    type="text"
                    placeholder={isRTL ? "أحمد بن..." : "Full Name"}
                    value={userContact.name}
                    onChange={e => setUserContact({...userContact, name: e.target.value})}
                    className={`w-full bg-slate-950 border ${formErrors.name ? 'border-red-500' : 'border-slate-800'} rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                  />
                  {formErrors.name && <span className="text-red-500 text-[10px] mt-1 block font-bold">{formErrors.name}</span>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">{t.formPhone}</label>
                  <input 
                    type="tel"
                    placeholder="05 / 06 / 07 ..."
                    value={userContact.phone}
                    onChange={e => setUserContact({...userContact, phone: e.target.value})}
                    className={`w-full bg-slate-950 border ${formErrors.phone ? 'border-red-500' : 'border-slate-800'} rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                  />
                  {formErrors.phone && <span className="text-red-500 text-[10px] mt-1 block font-bold">{formErrors.phone}</span>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">{t.formWillaya}</label>
                  <select 
                    value={userContact.willaya}
                    onChange={e => setUserContact({...userContact, willaya: e.target.value})}
                    className={`w-full bg-slate-950 border ${formErrors.willaya ? 'border-red-500' : 'border-slate-800'} rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer`}
                  >
                    <option value="">{t.willayaPlaceholder}</option>
                    {ALGERIA_WILLAYAS.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  {formErrors.willaya && <span className="text-red-500 text-[10px] mt-1 block font-bold">{formErrors.willaya}</span>}
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setStatus(AppStatus.IDLE)} className="flex-1 py-4 text-slate-500 font-bold hover:text-white transition-colors">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={handleBuild} className="flex-[2] py-4 bg-cyan-500 text-white font-black rounded-2xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all active:scale-95">
                  {t.generate}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Select Game */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400 ring-2 ring-slate-800/50">1</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{t.step1}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        {/* Step 2: Set Budget */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400 ring-2 ring-slate-800/50">2</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{t.step2}</h3>
          </div>
          <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -z-10 rounded-full" />
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 w-full space-y-8">
                <div className="flex justify-between items-end">
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{t.targetBudget}</label>
                  <span className="text-3xl md:text-5xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    {budget.toLocaleString()} <span className="text-xl md:text-2xl opacity-60 ml-1">{t.currency}</span>
                  </span>
                </div>
                <div className="relative pt-4">
                  <input 
                    type="range" 
                    min="40000" 
                    max="1000000" 
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                  />
                  <div className="flex justify-between mt-4">
                    <span className="text-[10px] font-bold text-slate-700 uppercase">40K {t.currency}</span>
                    <span className="text-[10px] font-bold text-slate-700 uppercase">1M {t.currency}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {BUDGET_RANGES.map((range) => (
                    <button 
                      key={range.label}
                      onClick={() => setBudget(range.value)}
                      className={`text-[10px] md:text-xs py-3 px-1 rounded-2xl border-2 transition-all font-black tracking-wide ${
                        budget === range.value 
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                        : 'border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                      }`}
                    >
                      {isRTL ? {
                        'Entry': 'اقتصادي',
                        'Mid': 'متوسط',
                        'High': 'قوي',
                        'Ultra': 'خارق'
                      }[range.label] : range.label} ({range.value / 1000}K)
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-72">
                <button 
                  disabled={!selectedGame || status === AppStatus.LOADING}
                  onClick={handleBuild}
                  className={`w-full py-8 rounded-[2rem] font-black text-2xl transition-all shadow-2xl flex flex-col items-center justify-center gap-1 group relative overflow-hidden ${
                    !selectedGame 
                    ? 'bg-slate-800 text-slate-700 cursor-not-allowed opacity-50' 
                    : 'bg-cyan-500 text-white hover:bg-cyan-400 active:scale-[0.98] shadow-cyan-500/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {status === AppStatus.LOADING ? (
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">{t.generate}</span>
                      <svg className={`w-6 h-6 relative z-10 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {status === AppStatus.SUCCESS && recommendation && (
          <section id="result-section" className="animate-in fade-in slide-in-from-bottom-12 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-xl shadow-cyan-500/20">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-1">
                    {isRTL ? 'توصية الخبير' : 'Expert Recommendation'}
                  </h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    {isLeadSent ? (isRTL ? 'تم إرسال الطلب للمخزن' : 'Build Sent to Store') : (isRTL ? 'تم التوليد بنجاح' : 'Optimized Successfully')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                 <button 
                  onClick={openWhatsApp}
                  className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                 >
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                   <span>{isRTL ? 'اطلب عبر واتساب' : 'Place Order via WhatsApp'}</span>
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Parts List */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
                  <div className="bg-slate-800/40 px-10 py-6 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.componentList}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-cyan-400 mb-1">{t.totalEst}</span>
                      <span className="text-2xl font-mono font-black text-white leading-none">{recommendation.totalEstimatedCost.toLocaleString()} <span className="text-sm opacity-50">{t.currency}</span></span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-800/30">
                    {recommendation.parts.map((part, idx) => (
                      <div key={idx} className="p-10 hover:bg-slate-800/20 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex gap-8">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 group-hover:scale-110 transition-all shadow-inner flex-shrink-0">
                              {part.category.toLowerCase().includes('cpu') && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M7.757 16.243l-1.414 1.414m0-11.314l1.414 1.414m8.486 8.486l1.414 1.414" strokeWidth={1.5}/></svg>}
                              {part.category.toLowerCase().includes('gpu') && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" strokeWidth={1.5}/></svg>}
                              {!part.category.toLowerCase().includes('cpu') && !part.category.toLowerCase().includes('gpu') && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth={1.5}/></svg>}
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-black text-cyan-400/80 uppercase tracking-[0.2em]">{part.category}</div>
                              <div className="text-2xl font-black text-white leading-tight">{part.name}</div>
                              <p className="text-slate-500 text-sm leading-relaxed max-w-lg mt-3">{part.reasoning}</p>
                            </div>
                          </div>
                          <div className={`${isRTL ? 'text-left' : 'text-right'} flex-shrink-0`}>
                            <div className="text-3xl font-mono font-black text-white">{part.estimatedPrice.toLocaleString()}</div>
                            <div className="text-[10px] font-bold text-slate-600 uppercase mt-1">{t.currency}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: Performance & Details */}
              <div className="lg:col-span-4 space-y-6">
                <PerformanceChart data={recommendation.performance} />
                <div className="bg-slate-900/80 border border-slate-800 rounded-[3rem] p-10 shadow-2xl">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">{t.buildAnalysis}</h4>
                  <div className="space-y-8">
                    <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-[2rem]">
                      <div className="flex items-center gap-2 text-orange-400 mb-4">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.bottleneck}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{recommendation.bottleneckAnalysis}</p>
                    </div>
                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-[2rem]">
                      <div className="flex items-center gap-2 text-cyan-400 mb-4">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
          <div className="mt-8 p-10 bg-red-500/5 border border-red-500/20 rounded-[2rem] text-red-500 text-center font-black animate-pulse uppercase tracking-widest">
            {error}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-900 py-16 bg-slate-950/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h4 className="text-white font-black text-xl mb-1">RigCraft <span className="text-cyan-500">AI</span></h4>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Hardware estimation engine for Algeria</p>
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Terms</a>
            <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-widest">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
