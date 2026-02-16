
import { Game, Language } from './types';

export const POPULAR_GAMES: Game[] = [
  { id: 'valorant', title: 'Valorant', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f2?auto=format&fit=crop&q=80&w=400', genre: 'FPS' },
  { id: 'fortnite', title: 'Fortnite', image: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80&w=400', genre: 'Battle Royale' },
  { id: 'warzone', title: 'CoD: Warzone', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400', genre: 'Battle Royale' },
  { id: 'minecraft', title: 'Minecraft', image: 'https://images.unsplash.com/photo-1627373670206-7236500232db?auto=format&fit=crop&q=80&w=400', genre: 'Sandbox' },
  { id: 'gtav', title: 'GTA V', image: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80&w=400', genre: 'Action' },
  { id: 'lol', title: 'League of Legends', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400', genre: 'MOBA' },
];

export const BUDGET_RANGES = [
  { label: 'Budget', value: 64000 },
  { label: 'Standard', value: 65000 },
  { label: 'Advanced', value: 85000 },
  { label: 'Pro', value: 120000 },
];

export const ALGERIA_WILLAYAS = Array.from({ length: 58 }, (_, i) => {
  const names = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
    'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
    'Skikda', 'Sidi Bel Abbès', 'Anaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla',
    'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
    'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'El M\'Ghair', 'El Meniaa',
    'Ouled Djellal', 'Bordj Baji Mokhtar', 'Béni Abbès', 'Timimoun', 'Touggourt', 'Djanet', 'In Salah', 'In Guezzam'
  ];
  return {
    id: (i + 1).toString().padStart(2, '0'),
    name: `${(i + 1).toString().padStart(2, '0')} - ${names[i] || 'Province'}`
  };
});

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    title: "RigCraft AI",
    hero: "Build Your Ultimate Battlestation",
    subtitle: "Select your favorite game and we'll match you with one of our curated high-performance builds available in stock.",
    step1: "What do you want to play?",
    step2: "Select your budget range",
    step3: "Complete your profile",
    generate: "Find My Rig",
    loading: "Consulting inventory...",
    formName: "Full Name",
    formPhone: "Phone Number",
    formWillaya: "Willaya (Province)",
    currency: "DA",
    totalEst: "Package Total",
    componentList: "Included Components",
    buildAnalysis: "Performance Analysis",
    bottleneck: "Hardware Note",
    proTip: "Expert Insight",
    export: "Export Build (PDF)",
    stockTitle: "Inventory Control",
    stockDesc: "Add parts you have in stock to prioritize them in AI recommendations.",
    saveStock: "Save Inventory",
    willayaPlaceholder: "Select your Willaya",
    invalidPhone: "Mobile number must start with 5, 6, or 7",
    required: "This field is required",
    targetBudget: "Budget Selection"
  },
  fr: {
    title: "RigCraft AI",
    hero: "Votre Station de Combat",
    subtitle: "Choisissez votre jeu et nous vous proposerons l'une de nos configurations optimisées disponibles en stock.",
    step1: "À quoi voulez-vous jouer ?",
    step2: "Choisissez votre budget",
    step3: "Complétez votre profil",
    generate: "Trouver ma config",
    loading: "Consultation du stock...",
    formName: "Nom Complet",
    formPhone: "Numéro de Téléphone",
    formWillaya: "Wilaya (Province)",
    currency: "DA",
    totalEst: "Total du Pack",
    componentList: "Composants Inclus",
    buildAnalysis: "Analyse de Performance",
    bottleneck: "Note Matériel",
    proTip: "Avis d'Expert",
    export: "Exporter le Build (PDF)",
    stockTitle: "Gestion du Stock",
    stockDesc: "Ajoutez les pièces en stock pour qu'elles soient prioritaires.",
    saveStock: "Enregistrer l'inventaire",
    willayaPlaceholder: "Sélectionnez votre Wilaya",
    invalidPhone: "Le numéro doit commencer par 5, 6 ou 7",
    required: "Ce champ est obligatoire",
    targetBudget: "Sélection du Budget"
  },
  ar: {
    title: "ريج كرافت AI",
    hero: "ابنِ محطة ألعابك",
    subtitle: "اختر لعبتك المفضلة وسنقوم بمطابقتها مع إحدى تجميعاتنا المختارة المتوفرة في المخزن.",
    step1: "ماذا تريد أن تلعب؟",
    step2: "اختر نطاق الميزانية",
    step3: "أكمل بياناتك",
    generate: "ابحث عن جهازي",
    loading: "جاري مراجعة المخزون...",
    formName: "الاسم الكامل",
    formPhone: "رقم الهاتف",
    formWillaya: "الولاية",
    currency: "د.ج",
    totalEst: "إجمالي الباقة",
    componentList: "المكونات المتضمنة",
    buildAnalysis: "تحليل الأداء",
    bottleneck: "ملاحظة العتاد",
    proTip: "رأي الخبير",
    export: "تصدير التجميعة (PDF)",
    stockTitle: "إدارة المخزون",
    stockDesc: "أضف القطع المتوفرة لديك لتوجيه توصيات الذكاء الاصطناعي.",
    saveStock: "حفظ المخزون",
    willayaPlaceholder: "اختر ولايتك",
    invalidPhone: "يجب أن يبدأ الرقم بـ 5 أو 6 أو 7",
    required: "هذا الحقل مطلوب",
    targetBudget: "اختيار الميزانية"
  }
};
