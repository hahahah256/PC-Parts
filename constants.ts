
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
    id: 'warzone', 
    title: 'COD: Warzone', 
    image: 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/warzone/home/wz-hero-desktop.jpg', 
    genre: 'Battle Royale' 
  },
  { 
    id: 'pubg', 
    title: 'PUBG', 
    image: 'https://wstatic-prod.pubg.com/web/live/static/og/img-og-pubg.jpg', 
    genre: 'Battle Royale' 
  },
  { 
    id: 'r6s', 
    title: 'Rainbow Six Siege', 
    image: 'https://staticctf.akamaized.net/J3YHrI567SbaE7b8B9E8Y0/2mUuYv6yYvYvYvYvYvYvYv/c0f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8/R6S_KeyArt_Standard_Edition.jpg', 
    genre: 'Tactical Shooter' 
  },
  { 
    id: 'overwatch2', 
    title: 'Overwatch 2', 
    image: 'https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4bef3055/blt610360a00e572886/62992207399f665518172937/OW2_Vision_KeyArt_16x9.jpg', 
    genre: 'Hero Shooter' 
  },
  { 
    id: 'dota2', 
    title: 'Dota 2', 
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg', 
    genre: 'MOBA' 
  },
  { 
    id: 'bg3', 
    title: "Baldur's Gate 3", 
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg?t=1720689945', 
    genre: 'RPG' 
  },
  { 
    id: 'genshin', 
    title: 'Genshin Impact', 
    image: 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_GenshinImpact_miHoYoLimited_S1_2560x1440-91c6cf73123ea91f84715f7a9a239f3b', 
    genre: 'Action RPG' 
  },
  { 
    id: 'rocketleague', 
    title: 'Rocket League', 
    image: 'https://rocketleague.media.zestyio.com/rl_cross-play_social_1200x630.jpg', 
    genre: 'Sports/Action' 
  },
  { 
    id: 'rust', 
    title: 'Rust', 
    image: 'https://files.facepunch.com/rust/item-store/rust-social.jpg', 
    genre: 'Survival' 
  },
  { 
    id: 'hogwarts', 
    title: 'Hogwarts Legacy', 
    image: 'https://www.hogwartslegacy.com/static/images/share.jpg', 
    genre: 'Action RPG' 
  },
  { 
    id: 'spiderman', 
    title: 'Spider-Man Remastered', 
    image: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/2619/1v8Mv8v8v8v8v8v8v8v8v8v8.jpg', 
    genre: 'Action' 
  },
  { 
    id: 'witcher3', 
    title: 'The Witcher 3', 
    image: 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S1_2560x1440-82eb50f17cc7a696f5b9066657929e6e', 
    genre: 'Open World RPG' 
  },
];

export const BUDGET_RANGES = [
  { label: 'Starter', value: 85000 },
  { label: 'Medium', value: 135000 },
  { label: 'Gaming', value: 175000 },
  { label: 'Extreme', value: 220000 },
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
    subtitle: "Select your game and set your budget. Our hardware specialists will curate the best-performing configuration for your needs.",
    step1: "Select your game",
    step2: "Set your realistic budget",
    step3: "Book a Call",
    generate: "Generate Expert Build",
    loading: "Optimizing hardware synergy...",
    formName: "Full Name",
    formPhone: "Contact Number",
    formWillaya: "Wilaya / Province",
    currency: "DA",
    totalEst: "Estimated Total",
    componentList: "Selected Components",
    buildAnalysis: "Performance Benchmark",
    bottleneck: "Hardware Insight",
    proTip: "Specialist Recommendation",
    export: "Export Build",
    willayaPlaceholder: "Choose your location",
    invalidPhone: "Invalid mobile format (05, 06, 07)",
    required: "Required field",
    targetBudget: "Target Budget",
    serviceTitle: "What We Do",
    findMore: "Find out more",
    proofsTitle: "Our Proofs & Quality",
    proofsSubtitle: "See why hundreds of gamers trust Pc-Club Parts for their high-end hardware builds.",
    servicePoints: [
      "We meet you at your preferred location, any day and any time.",
      "We bring the PC parts you ordered.",
      "We build the computer with you, step by step.",
      "We show you how it works and how to take care of it."
    ],
    usedPartsNote: "Hardware Disclosure: Some components are used (Like the GPUs) to ensure maximum performance within your specified budget.",
    watchBenchmark: "Watch Live Benchmark"
  },
  fr: {
    title: "Pc-Club Parts",
    hero: "Configurez Votre Station Ultime",
    subtitle: "Choisissez votre jeu et votre budget. Nos experts sélectionneront la meilleure configuration pour vos besoins.",
    step1: "Choisissez votre jeu",
    step2: "Définissez votre budget réaliste",
    step3: "Réserver un appel",
    generate: "Générer la Config Expert",
    loading: "Optimisation de la synergie matériel...",
    formName: "Nom Complet",
    formPhone: "Numéro de Contact",
    formWillaya: "Wilaya / Province",
    currency: "DA",
    totalEst: "Total Estimé",
    componentList: "Composants Sélectionnés",
    buildAnalysis: "Banc d'Essai",
    bottleneck: "Analyse Matériel",
    proTip: "Conseil de Spécialiste",
    export: "Exporter",
    willayaPlaceholder: "Choisissez votre lieu",
    invalidPhone: "Format invalide (05, 06, 07)",
    required: "Champ obligatoire",
    targetBudget: "Budget Ciblé",
    serviceTitle: "Ce que nous faisons",
    findMore: "En savoir plus",
    proofsTitle: "Nos Preuves & Qualité",
    proofsSubtitle: "Découvrez pourquoi des centaines de joueurs font confiance à Pc-Club Parts pour leurs configurations haut de gamme.",
    servicePoints: [
      "Nous vous rencontrons à l'endroit de votre choix, n'importe quel jour et à n'importe quelle heure.",
      "Nous apportons les composants PC que vous avez commandés.",
      "Nous assemblons l'ordinateur avec vous, étape par étape.",
      "Nous vous montrons comment il fonctionne et comment en prendre soin."
    ],
    usedPartsNote: "Divulgation Matérielle : Certains composants sont d'occasion (comme les cartes graphiques) pour garantir des performances maximales dans votre budget.",
    watchBenchmark: "Voir le Benchmark Live"
  },
  ar: {
    title: "Pc-Club Parts",
    hero: "صمم جهاز أحلامك للألعاب",
    subtitle: "اختر لعبتك وحدد ميزانيتك. سيقوم خبراؤنا باختيار أفضل العتاد المناسب لك.",
    step1: "اختر لعبتك",
    step2: "حدد ميزانيتك الواقعية",
    step3: "احجز مكالمة",
    generate: "توليد تجميعة الخبراء",
    loading: "جاري تحسين توافق العتاد...",
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
    targetBudget: "الميزانية المستهدفة",
    serviceTitle: "ماذا نفعل",
    findMore: "اكتشف المزيد",
    proofsTitle: "دلائل الجودة والمصداقية",
    proofsSubtitle: "تعرف على سبب ثقة مئات اللاعبين في Pc-Club Parts لبناء أجهزتهم المتطورة.",
    servicePoints: [
      "نلتقي بك في موقعك المفضل، في أي يوم وأي وقت.",
      "نحضر قطع الكمبيوتر التي طلبتها.",
      "نقوم بتركيب الجهاز معك، خطوة بخطوة.",
      "نريك كيف يعمل وكيفية العناية به."
    ],
    usedPartsNote: "توضيح العتاد: بعض القطع مستعملة (مثل كروت الشاشة) لضمان تقديم أقصى أداء ممكن ضمن ميزانيتك المحددة.",
    watchBenchmark: "شاهد اختبار الأداء المباشر"
  }
};
