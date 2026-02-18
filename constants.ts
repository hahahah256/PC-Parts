
import { Game, Language } from './types';

export const POPULAR_GAMES: Game[] = [
  { 
    id: 'fortnite', 
    title: 'Fortnite', 
    image: 'https://i.ytimg.com/vi/adGdyCdvKz4/maxresdefault.jpg', 
    genre: 'Battle Royale' 
  },
  { 
    id: 'valorant', 
    title: 'Valorant', 
    image: 'https://static.wikia.nocookie.net/valorant/images/6/67/VALORANT.jpg/revision/latest?cb=20230521024215&path-prefix=th', 
    genre: 'Tactical Shooter' 
  },
  { 
    id: 'cs2', 
    title: 'Counter-Strike 2', 
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_616x353.jpg?t=1698860631', 
    genre: 'Tactical Shooter' 
  },
  { 
    id: 'lol', 
    title: 'League of Legends', 
    image: 'https://www.exitlag.com/blog/wp-content/uploads/2024/10/league-of-legends-download-1.webp', 
    genre: 'MOBA' 
  },
  { 
    id: 'fc25', 
    title: 'EA Sports FC 25', 
    image: 'https://i.ytimg.com/vi/QrID0EA3hhI/maxresdefault.jpg', 
    genre: 'Sports' 
  },
  { 
    id: 'gtav', 
    title: 'Grand Theft Auto V', 
    image: 'https://wallpapers.com/images/featured/grand-theft-auto-v-naej4yiap4gnxh2o.jpg',  
    genre: 'Action/Open World' 
  },
  { 
    id: 'wukong', 
    title: 'Black Myth: Wukong', 
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg?t=1724119159', 
    genre: 'Action RPG' 
  },
  { 
    id: 'rdr2', 
    title: 'Red Dead Redemption 2', 
    image: 'https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5MtwQgOVF9vJqlfui6SDB5Jl4oBSq.png?w=440', 
    genre: 'Open World Western' 
  },
  { 
    id: 'eldenring', 
    title: 'Elden Ring', 
    image: 'https://www.fakaheda.eu/images/product_medias/elden-ring.jpg', 
    genre: 'Action RPG' 
  },
  { 
    id: 'helldivers2', 
    title: 'Helldivers 2', 
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/header.jpg?t=1720689945', 
    genre: 'Co-op Shooter' 
  },
  { 
    id: 'cyberpunk', 
    title: 'Cyberpunk 2077', 
    image: 'https://cdn1.epicgames.com/offer/77f2b98e2cef40c8a7437518bf420e47/EGS_Cyberpunk2077_CDPROJEKTRED_S1_03_2560x1440-359e77d3cd0a40aebf3bbc130d14c5c7', 
    genre: 'Open World RPG' 
  },
  { 
    id: 'minecraft', 
    title: 'Minecraft', 
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Minecraft_2024_cover_art.png/250px-Minecraft_2024_cover_art.png', 
    genre: 'Sandbox' 
  },
  { 
    id: 'roblox', 
    title: 'Roblox', 
    image: 'https://images.tynker.com/blog/wp-content/uploads/20250401220809/robloxxjpg-1.jpg', 
    genre: 'Sandbox/Platform' 
  },
  { 
    id: 'apex', 
    title: 'Apex Legends', 
    image: 'https://www.nintendo.com/eu/media/images/assets/nintendo_switch_games/apexlegends/16x9_ApexLegends_image1600w.jpg', 
    genre: 'Battle Royale' 
  },
  { 
    id: 'forza5', 
    title: 'Forza Horizon 5', 
    image: 'https://store-images.s-microsoft.com/image/apps.33953.13806078025361171.9723cf5e-1e29-4d9d-ad0a-cc37a95bb75d.afabb748-2c30-4a7e-8072-2809a222192d?q=90&w=480&h=270', 
    genre: 'Racing' 
  },
  { 
    id: 'genshin', 
    title: 'Genshin Impact', 
    image: 'https://i.ytimg.com/vi/WvUxzNW0X4I/maxresdefault.jpg', 
    genre: 'Action RPG' 
  },
  { 
    id: 'bg3', 
    title: "Baldur's Gate 3", 
    image: 'https://gaming-cdn.com/images/products/4804/orig/baldur-s-gate-3-pc-game-gog-com-cover.jpg?v=1710239606', 
    genre: 'Tactical RPG' 
  },
  { 
    id: 'hogwarts', 
    title: 'Hogwarts Legacy', 
    image: 'https://www.hogwartslegacy.com/images/share.jpg', 
    genre: 'Fantasy RPG' 
  },
  { 
    id: 'gowr', 
    title: 'God of War Ragnarök', 
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg?t=1750909504', 
    genre: 'Action Adventure' 
  },
  { 
    id: 'spiderman2', 
    title: "Marvel's Spider-Man 2", 
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=600', 
    genre: 'Action Adventure' 
  },
  { 
    id: 'witcher3', 
    title: 'The Witcher 3: Wild Hunt', 
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ad9240e088f953a84aee814034c50a6a92bf4516/header.jpg?t=1768303991', 
    genre: 'Open World RPG' 
  },
  { 
    id: 'bo6', 
    title: 'Call of Duty: Black Ops 6', 
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2933620/page_bg_raw.jpg?t=1765489042', 
    genre: 'First-Person Shooter' 
  },
  { 
    id: 'msfs', 
    title: 'Microsoft Flight Simulator', 
    image: 'https://i.ytimg.com/vi/TYqJALPVn0Y/maxresdefault.jpg', 
    genre: 'Simulation' 
  },
  { 
    id: 'ghost', 
    title: 'Ghost of Tsushima', 
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg?t=1716301386', 
    genre: 'Action Adventure' 
  },
  { 
    id: 're4', 
    title: 'Resident Evil 4', 
    image: 'https://i.ytimg.com/vi/j5Xv2lM9wes/maxresdefault.jpg', 
    genre: 'Action Horror' 
  },
];

export const BUDGET_RANGES = [
  { label: 'Starter', value: 75000 },
  { label: 'Medium', value: 125000 },
  { label: 'Gaming', value: 165000 },
  { label: 'Extreme', value: 200000 },
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
    title: "Pc-Club Parts",
    hero: "Engineer Your Perfect Battle Station",
    subtitle: "Select your game and set your budget. Our AI will curate the best-performing hardware setup for your needs.",
    step1: "Select your game",
    step2: "Set your realistic budget",
    step3: "Finalize your profile",
    generate: "Generate Custom Build",
    loading: "Calculating optimal synergy...",
    formName: "Full Name",
    formPhone: "Contact Number",
    formWillaya: "Wilaya / Province",
    currency: "DA",
    totalEst: "Estimated Total",
    componentList: "Selected Components",
    buildAnalysis: "Performance Benchmark",
    bottleneck: "Hardware Insight",
    proTip: "Expert Recommendation",
    export: "Export Build",
    willayaPlaceholder: "Choose your location",
    invalidPhone: "Invalid mobile format (05, 06, 07)",
    required: "Required field",
    targetBudget: "Target Budget"
  },
  fr: {
    title: "Pc-Club Parts",
    hero: "Configurez Votre Station Ultime",
    subtitle: "Choisissez votre jeu et votre budget. Notre IA sélectionnera le meilleur matériel pour vos besoins.",
    step1: "Choisissez votre jeu",
    step2: "Définissez votre budget réaliste",
    step3: "Finalisez votre profil",
    generate: "Générer la Config",
    loading: "Calcul de la synergie...",
    formName: "Nom Complet",
    formPhone: "Numéro de Contact",
    formWillaya: "Wilaya / Province",
    currency: "DA",
    totalEst: "Total Estimé",
    componentList: "Composants Sélectionnés",
    buildAnalysis: "Banc d'Essai",
    bottleneck: "Analyse Matériel",
    proTip: "Conseil d'Expert",
    export: "Exporter",
    willayaPlaceholder: "Choisissez votre lieu",
    invalidPhone: "Format invalide (05, 06, 07)",
    required: "Champ obligatoire",
    targetBudget: "Budget Ciblé"
  },
  ar: {
    title: "Pc-Club Parts",
    hero: "صمم جهاز أحلامك للألعاب",
    subtitle: "اختر لعبتك وحدد ميزانيتك. سيقوم الذكاء الاصطناعي باختيار أفضل العتاد المناسب لك.",
    step1: "اختر لعبتك",
    step2: "حدد ميزانيتك الواقعية",
    step3: "أكمل بياناتك",
    generate: "توليد التجميعة",
    loading: "جاري حساب الأداء الأمثل...",
    formName: "الاسم الكامل",
    formPhone: "رقم التواصل",
    formWillaya: "الولاية",
    currency: "د.ج",
    totalEst: "الإجمالي التقديري",
    componentList: "المكونات المختارة",
    buildAnalysis: "مؤشر الأداء",
    bottleneck: "تحليل العتاد",
    proTip: "نصيحة الخبير",
    export: "تصدير",
    willayaPlaceholder: "اختر ولايتك",
    invalidPhone: "رقم غير صالح (يجب أن يبدأ بـ 05، 06، 07)",
    required: "حقل مطلوب",
    targetBudget: "الميزانية المستهدفة"
  }
};
