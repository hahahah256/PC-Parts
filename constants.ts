
import { Game, Language } from './types';

export const POPULAR_GAMES: Game[] = [
  { id: 'cp2077', title: 'Cyberpunk 2077', image: 'https://images.unsplash.com/photo-1605898399783-1820b7f53633?auto=format&fit=crop&q=80&w=400', genre: 'RPG' },
  { id: 'valorant', title: 'Valorant', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f2?auto=format&fit=crop&q=80&w=400', genre: 'FPS' },
  { id: 'minecraft', title: 'Minecraft (RTX)', image: 'https://images.unsplash.com/photo-1627373670206-7236500232db?auto=format&fit=crop&q=80&w=400', genre: 'Sandbox' },
  { id: 'warzone', title: 'CoD: Warzone', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400', genre: 'Battle Royale' },
  { id: 'eldenring', title: 'Elden Ring', image: 'https://images.unsplash.com/photo-1644310931165-f481a5338006?auto=format&fit=crop&q=80&w=400', genre: 'Action RPG' },
  { id: 'fortnite', title: 'Fortnite', image: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80&w=400', genre: 'Battle Royale' },
];

export const BUDGET_RANGES = [
  { label: 'Entry', value: 80000 },
  { label: 'Mid', value: 160000 },
  { label: 'High', value: 300000 },
  { label: 'Ultra', value: 550000 },
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
    subtitle: "Choose your game, set your budget, and let our AI craft the perfect hardware list based on available stock.",
    step1: "Select your main game",
    step2: "Set your budget",
    step3: "Complete your profile",
    generate: "Generate Build",
    loading: "Assembling your rig...",
    formName: "Full Name",
    formPhone: "Phone Number",
    formWillaya: "Willaya (Province)",
    currency: "DA",
    totalEst: "Total Est.",
    componentList: "Component List",
    buildAnalysis: "Build Analysis",
    bottleneck: "Potential Bottleneck",
    proTip: "Pro Tip",
    export: "Export Build (PDF)",
    stockTitle: "Inventory Control",
    stockDesc: "Add parts you have in stock to prioritize them in AI recommendations.",
    saveStock: "Save Inventory",
    willayaPlaceholder: "Select your Willaya",
    invalidPhone: "Mobile number must start with 5, 6, or 7",
    required: "This field is required",
    targetBudget: "Target Budget"
  },
  fr: {
    title: "RigCraft AI",
    hero: "Construisez votre Station de Combat",
    subtitle: "Choisissez votre jeu, fixez votre budget, et laissez notre IA créer la liste de matériel parfaite selon le stock.",
    step1: "Sélectionnez votre jeu",
    step2: "Fixez votre budget",
    step3: "Complétez votre profil",
    generate: "Générer la configuration",
    loading: "Assemblage en cours...",
    formName: "Nom Complet",
    formPhone: "Numéro de Téléphone",
    formWillaya: "Wilaya (Province)",
    currency: "DA",
    totalEst: "Estimation Totale",
    componentList: "Liste des Composants",
    buildAnalysis: "Analyse du Build",
    bottleneck: "Goulot d'étranglement potentiel",
    proTip: "Conseil Pro",
    export: "Exporter le Build (PDF)",
    stockTitle: "Gestion du Stock",
    stockDesc: "Ajoutez les pièces en stock pour qu'elles soient prioritaires.",
    saveStock: "Enregistrer l'inventaire",
    willayaPlaceholder: "Sélectionnez votre Wilaya",
    invalidPhone: "Le numéro doit commencer par 5, 6 ou 7",
    required: "Ce champ est obligatoire",
    targetBudget: "Budget Ciblé"
  },
  ar: {
    title: "ريج كرافت AI",
    hero: "ابنِ محطة ألعابك المثالية",
    subtitle: "اختر لعبتك، حدد ميزانيتك، ودع ذكاءنا الاصطناعي يصمم لك قائمة العتاد المثالية بناءً على المتوفر.",
    step1: "اختر لعبتك المفضلة",
    step2: "حدد ميزانيتك",
    step3: "أكمل بياناتك",
    generate: "توليد التجميعة",
    loading: "جاري تجميع جهازك...",
    formName: "الاسم الكامل",
    formPhone: "رقم الهاتف",
    formWillaya: "الولاية",
    currency: "د.ج",
    totalEst: "الإجمالي التقديري",
    componentList: "قائمة المكونات",
    buildAnalysis: "تحليل التجميعة",
    bottleneck: "عنق زجاجة محتمل",
    proTip: "نصيحة للمحترفين",
    export: "تصدير التجميعة (PDF)",
    stockTitle: "إدارة المخزون",
    stockDesc: "أضف القطع المتوفرة لديك لتوجيه توصيات الذكاء الاصطناعي.",
    saveStock: "حفظ المخزون",
    willayaPlaceholder: "اختر ولايتك",
    invalidPhone: "يجب أن يبدأ الرقم بـ 5 أو 6 أو 7",
    required: "هذا الحقل مطلوب",
    targetBudget: "الميزانية المستهدفة"
  }
};
