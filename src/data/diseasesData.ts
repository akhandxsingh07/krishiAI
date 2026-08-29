import { DiseaseDetail } from '../types';

export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  disease: string;
  imageUrl: string;
  thumbnail: string;
  description: string;
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-rice-blast',
    name: 'Rice Leaf Blast (धान का झुलसा रोग)',
    crop: 'Rice / Paddy (धान)',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80',
    description: 'Spindle-shaped elliptical lesions with grey/white center and brown/reddish borders on paddy leaves.',
  },
  {
    id: 'sample-wheat-rust',
    name: 'Wheat Brown / Leaf Rust (गेहूँ का भूरा रतुआ)',
    crop: 'Wheat (गेहूँ)',
    disease: 'Brown Leaf Rust (Puccinia triticina)',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=200&q=80',
    description: 'Bright orange-brown pustules scattered across the upper surface of wheat foliage.',
  },
  {
    id: 'sample-tomato-blight',
    name: 'Tomato Early Blight (टमाटर का अगेती झुलसा)',
    crop: 'Tomato (टमाटर)',
    disease: 'Early Blight (Alternaria solani)',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=200&q=80',
    description: 'Concentric dark brown rings ("target board" pattern) with yellow chlorotic halos on lower tomato leaves.',
  },
  {
    id: 'sample-cotton-curl',
    name: 'Cotton Leaf Curl Virus (कपास का पत्ता मरोड़ रोग)',
    crop: 'Cotton (कपास)',
    disease: 'Cotton Leaf Curl Virus (CLCuV)',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=200&q=80',
    description: 'Upward curling and thickening of cotton leaves, enations on underside, transmitted by whitefly (Bemisia tabaci).',
  },
  {
    id: 'sample-potato-late-blight',
    name: 'Potato Late Blight (आलू का पछेती झुलसा)',
    crop: 'Potato (आलू)',
    disease: 'Late Blight (Phytophthora infestans)',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=200&q=80',
    description: 'Water-soaked irregular pale-to-dark brown necrotic spots spreading rapidly during foggy/humid cold weather.',
  },
  {
    id: 'sample-healthy-crop',
    name: 'Healthy Vibrant Crop (स्वस्थ फसल)',
    crop: 'Healthy Green Field',
    disease: 'No Disease Detected (Healthy Condition)',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=200&q=80',
    description: 'Lush green foliage with optimal chlorophyll, free from necrotic spots, chlorosis, or insect feeding scars.',
  },
];

export const DISEASES_DATABASE: DiseaseDetail[] = [
  {
    id: 'rice-blast',
    name: 'Rice Blast Disease',
    localName: {
      hi: 'धान का झुलसा / ब्लास्ट रोग',
      pa: 'ਝੋਨੇ ਦਾ ਝੁਲਸਾ ਰੋਗ',
      bn: 'ধানের ব্লাস্ট রোগ',
      te: 'వరి అగ్గితెగులు',
      ta: 'நெல் குலை நோய்',
      mr: 'भाताचा करपा रोग',
      gu: 'ડાંગરનો કરપો',
    },
    crop: 'Rice / Paddy',
    pathogen: 'Fungal',
    severity: 'High',
    symptoms: [
      'Spindle-shaped diamond lesions on leaves with grey centers and dark reddish-brown margins.',
      'Neck rot causing panicles to turn white and drop down (hanging panicle symptom).',
      'Node infection resulting in lodging of paddy culms.',
      'Drastic reduction in grain filling and grain weight up to 40-70%.',
    ],
    causes: [
      'Fungus Magnaporthe oryzae (Pyricularia oryzae).',
      'High relative humidity (>90%) with intermittent drizzling rain.',
      'Night temperature between 19°C - 24°C with heavy dew.',
      'Excessive application of chemical Nitrogenous fertilizers (Urea).',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    chemicalTreatment: [
      {
        name: 'Tricyclazole 75% WP (Baan / Beam)',
        dosage: '0.6 g per liter of water (120 g per acre)',
        safetyPeriodDays: 21,
        instruction: 'Spray at initial initiation of leaf spots and repeat at booting stage before panicle emergence.',
      },
      {
        name: 'Isoprothiolane 40% EC (Fuji-One)',
        dosage: '1.5 ml per liter of water (300 ml per acre)',
        safetyPeriodDays: 14,
        instruction: 'Provides systemic protection against neck blast and nodal blast.',
      },
      {
        name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
        dosage: '1 ml per liter of water (200 ml per acre)',
        safetyPeriodDays: 15,
        instruction: 'Broad spectrum systemic curative and preventative treatment.',
      },
    ],
    organicTreatment: [
      {
        name: 'Pseudomonas fluorescens 1.0% WP (Bio-fungicide)',
        recipe: 'Mix 10 g per liter of water (1 kg per acre in 100 L water) with 100g jaggery.',
        frequency: 'Spray every 10-12 days during humid weather.',
      },
      {
        name: 'Neem Oil (10,000 ppm) + Cow Urine (Gomutra) Spray',
        recipe: 'Dilute 5 ml neem oil + 50 ml fermented cow urine in 1 liter water with 1 ml khadi soap.',
        frequency: 'Spray in early morning at 7-day intervals.',
      },
      {
        name: 'Trichoderma viride Soil Application',
        recipe: 'Mix 2.5 kg Trichoderma with 100 kg well-rotted FYM/compost, incubate under shade for 7 days before field broadcast.',
        frequency: 'Apply during final land preparation.',
      },
    ],
    preventionTips: [
      'Treat paddy seed with Carbendazim 2g/kg or Trichoderma viride 10g/kg before nursery sowing.',
      'Avoid heavy split doses of Nitrogen; balance with Potash (MOP) to toughen plant cuticle.',
      'Maintain proper plant spacing (20cm x 15cm) to facilitate air circulation and lower humidity.',
      'Drain stagnant water from fields for 24-48 hours if blast symptoms start appearing.',
    ],
    riskSeason: 'Kharif (August - October) during overcast rainy spells and dew-heavy nights',
  },
  {
    id: 'rice-bacterial-blight',
    name: 'Bacterial Leaf Blight of Rice',
    localName: {
      hi: 'धान का जीवाणु झुलसा (BLB)',
      pa: 'ਝੋਨੇ ਦਾ ਬੈਕਟੀਰੀਅਲ ਝੁਲਸਾ',
      bn: 'ধানের পাতা পোড়া রোগ',
      te: 'వరి బాక్టీరియా ఆకు ఎండు తెగులు',
      ta: 'நெல் பாக்டீரியா இலைக்கருகல்',
      mr: 'भाताचा जीवाणू करपा',
      gu: 'ડાંગરનો બેક્ટેરિયલ બ્લાઈટ',
    },
    crop: 'Rice / Paddy',
    pathogen: 'Bacterial',
    severity: 'High',
    symptoms: [
      'Water-soaked lesions starting at leaf margins and expanding into wavy, yellowish-white stripes.',
      'Milky bacterial ooze drops visible on young lesions in morning hours that dry into yellow crusts.',
      'Leaves dry up rapidly resembling drought scorching ("Kresek" wilt in seedlings).',
    ],
    causes: [
      'Bacterium Xanthomonas oryzae pv. oryzae.',
      'Strong cyclonic winds and heavy monsoon rains creating micro-wounds in foliage.',
      'High ambient temperatures (25-34°C) with 70%+ relative humidity.',
      'Flooding of nursery beds with contaminated irrigation water.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    chemicalTreatment: [
      {
        name: 'Streptocycline (Streptomycin Sulphate + Tetracycline)',
        dosage: '0.1 g per liter of water (15 g in 150 L water per acre)',
        safetyPeriodDays: 20,
        instruction: 'Combine with Copper Oxychloride 50% WP (2 g/L) for synergistic bactericidal action.',
      },
      {
        name: 'Copper Oxychloride 50% WP (Blitox 50)',
        dosage: '2.5 g per liter of water (500 g per acre)',
        safetyPeriodDays: 14,
        instruction: 'Spray thoroughly on upper and lower canopy surfaces.',
      },
    ],
    organicTreatment: [
      {
        name: 'Cow Dung Slurry Filtrate + Asafoetida (Hing)',
        recipe: 'Mix 5 kg fresh cow dung in 20 L water, filter through muslin cloth, add 20g hing, dilute to 100 L.',
        frequency: 'Spray twice at 10-day intervals.',
      },
      {
        name: 'Bio-bactericide Bacillus subtilis',
        recipe: '5 ml or 5 g per liter of water as foliar spray.',
        frequency: 'Apply upon first notice of marginal leaf drying.',
      },
    ],
    preventionTips: [
      'Avoid clipping paddy seedling leaf tips during transplantation to prevent entry points.',
      'Delay nitrogen top-dressing when disease is active; apply extra Muriate of Potash (MOP 15-20 kg/acre).',
      'Cultivate tolerant varieties such as Improved Samba Mahsuri, PR-126, or CR Dhan 310.',
    ],
    riskSeason: 'July to September after storms and heavy monsoon downpours',
  },
  {
    id: 'wheat-yellow-rust',
    name: 'Wheat Yellow / Stripe Rust',
    localName: {
      hi: 'गेहूँ का पीला रतुआ (हल्दी रोग)',
      pa: 'ਕਣਕ ਦਾ ਪੀਲਾ ਰਤੂਆ (ਹਲਦੀ ਰੋਗ)',
      bn: 'গমের হলুদ মরিচা রোগ',
      te: 'గోధుమ పసుపు కుంకుమ తెగులు',
      ta: 'கோதுமை மஞ்சள் துரு நோய்',
      mr: 'गव्हावरील पिवळा तांबेरा',
      gu: 'ઘઉંનો પીળો ગેરુ',
    },
    crop: 'Wheat',
    pathogen: 'Fungal',
    severity: 'High',
    symptoms: [
      'Bright yellow to orange-yellow powdery pustules arranged in distinct parallel stripes along leaf veins.',
      'Yellow powder easily rubs off onto fingers or white cloth.',
      'Severe chlorosis causing premature drying of flag leaves and shrivelled grain.',
    ],
    causes: [
      'Puccinia striiformis f. sp. tritici.',
      'Cool temperatures (10°C - 18°C) accompanied by persistent fog, light rain, and high morning humidity.',
      'Wind-borne urediniospores blowing from Himalayan foothills into North-Western plains.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    chemicalTreatment: [
      {
        name: 'Propiconazole 25% EC (Tilt / Result)',
        dosage: '1.0 ml per liter of water (200 ml in 200 L water per acre)',
        safetyPeriodDays: 30,
        instruction: 'Spray immediately when first yellow pustules appear on flag leaves; repeat after 15 days if cool weather persists.',
      },
      {
        name: 'Tebuconazole 25.9% EC (Folicur)',
        dosage: '1.0 ml per liter of water',
        safetyPeriodDays: 25,
        instruction: 'Highly effective curative triazole fungicide.',
      },
    ],
    organicTreatment: [
      {
        name: 'Fermented Butter Milk (Khatta Chhachh) + Copper Pot Mixture',
        recipe: 'Store 5 L sour buttermilk in a copper vessel for 10-14 days until green verdigris forms, dilute in 150 L water.',
        frequency: 'Spray every 10 days.',
      },
      {
        name: 'Trichoderma harzianum foliar spray',
        recipe: '10 g per liter of water with 0.5 ml sticker.',
        frequency: 'Preventative bio-spray in late December / January.',
      },
    ],
    preventionTips: [
      'Plant rust-resistant certified varieties like HD-3086, PBW-725, DBW-187 (Karan Vandana), DBW-222, or HD-3226.',
      'Inspect wheat fields weekly from late December onwards, especially in sub-mountainous zones.',
      'Avoid late sowing of wheat to bypass the high-humidity spore migration window.',
    ],
    riskSeason: 'Rabi (December - February) in Punjab, Haryana, Western UP, Himachal Pradesh, Jammu',
  },
  {
    id: 'cotton-leaf-curl',
    name: 'Cotton Leaf Curl Virus (CLCuV)',
    localName: {
      hi: 'कपास का पत्ता मरोड़ (मुरड़िया) रोग',
      pa: 'ਨਰਮੇ ਦਾ ਪੱਤਾ ਮਰੋੜ ਰੋਗ',
      te: 'పత్తి ఆకు ముడుత తెగులు',
      ta: 'பருத்தி இலை சுருள் நோய்',
      mr: 'कापसावरील चुरडा-मुरडा',
      gu: 'કપાસનો પાન કોકડાઈ જવાનો રોગ',
    },
    crop: 'Cotton',
    pathogen: 'Viral',
    severity: 'High',
    symptoms: [
      'Upward and downward curling of cotton leaves with thickening of veins on the under-surface.',
      'Formation of cup-shaped leafy enations (outgrowths) on the lower side of veins.',
      'Stunted plant growth with shortened internodes and significant reduction in boll formation.',
    ],
    causes: [
      'Begomovirus transmitted exclusively by the Whitefly vector (Bemisia tabaci).',
      'Dry spells followed by high humidity and temperatures between 28°C - 38°C favor whitefly reproduction.',
      'Presence of alternate weed hosts like Peeli Buti (Abutilon indicum) and Congress grass (Parthenium).',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    chemicalTreatment: [
      {
        name: 'Pyriproxyfen 10% + Fenpropathrin 15% EC',
        dosage: '2 ml per liter of water (400-500 ml per acre)',
        safetyPeriodDays: 20,
        instruction: 'Targets both nymph and adult whitefly populations.',
      },
      {
        name: 'Diafenthiuron 50% WP (Pegasus)',
        dosage: '1.2 g per liter of water (250 g per acre)',
        safetyPeriodDays: 14,
        instruction: 'Vapor action penetrates dense cotton foliage.',
      },
      {
        name: 'Afidopyropen 50 g/L DC (Sefina)',
        dosage: '2 ml per liter of water',
        safetyPeriodDays: 14,
        instruction: 'Fast feeding cessation of piercing-sucking whitefly vectors.',
      },
    ],
    organicTreatment: [
      {
        name: 'Yellow Sticky Traps',
        recipe: 'Install 20-25 bright yellow sticky boards per acre at crop canopy height to monitor and trap whiteflies.',
        frequency: 'Replace or clean sticky coating every 15 days.',
      },
      {
        name: 'Neem Seed Kernel Extract (NSKE 5%)',
        recipe: 'Crush 5 kg neem seeds, soak in 10 L water overnight, filter and add to 90 L water with 100 g soap.',
        frequency: 'Spray every 7-10 days to inhibit whitefly oviposition.',
      },
      {
        name: 'Verticillium lecanii (Bio-insecticide)',
        recipe: '5 g per liter of water under humid conditions.',
        frequency: 'Fungal entomopathogen targeting whitefly nymphs.',
      },
    ],
    preventionTips: [
      'Eradicate host weeds (Parthenium, Xanthium, Solanum nigrum) from field bunds.',
      'Sow recommended Bt cotton hybrids resistant/tolerant to CLCuD early in the season (April-May).',
      'Grow border crops of pearl millet (Bajra), sorghum (Jowar), or maize (4-5 rows) as natural whitefly physical barriers.',
    ],
    riskSeason: 'June to August during cotton vegetative and squaring stages',
  },
  {
    id: 'tomato-early-blight',
    name: 'Tomato Early Blight',
    localName: {
      hi: 'टमाटर का अगेती झुलसा रोग',
      pa: 'ਟਮਾਟਰ ਦਾ ਅਗੇਤਾ ਝੁਲਸਾ',
      bn: 'টমেটোর আগাম ধসা রোগ',
      te: 'టమాట ముందస్తు ఆకు ఎండు తెగులు',
      ta: 'தக்காளி ஆரம்ப கால கருகல் நோய்',
      mr: 'टोमॅटोवरील लवकर येणारा करपा',
      gu: 'ટામેટાનો આગોતરો સુકારો',
    },
    crop: 'Tomato',
    pathogen: 'Fungal',
    severity: 'Medium',
    symptoms: [
      'Dark brown to black necrotic spots with concentric ring patterns ("bullseye" target appearance).',
      'Surrounding tissue turns yellow (chlorosis), leading to defoliation from bottom leaves upwards.',
      'Sunken dark lesions on stem collars and fruit calyx end.',
    ],
    causes: [
      'Alternaria solani fungus.',
      'Warm temperatures (24°C - 30°C) with frequent wet foliage from overhead irrigation or rain.',
      'Poor crop rotation with solanaceous crops (potato, brinjal, chilli).',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    chemicalTreatment: [
      {
        name: 'Mancozeb 75% WP (Indofil M-45)',
        dosage: '2.5 g per liter of water (500 g in 200 L water per acre)',
        safetyPeriodDays: 7,
        instruction: 'Contact protectant fungicide; spray before disease spreads to upper canopy.',
      },
      {
        name: 'Chlorothalonil 75% WP (Kavach)',
        dosage: '2.0 g per liter of water',
        safetyPeriodDays: 5,
        instruction: 'Broad spectrum multi-site surface protectant.',
      },
      {
        name: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate)',
        dosage: '2 g per liter of water',
        safetyPeriodDays: 10,
        instruction: 'Curative and systemic action on established lesions.',
      },
    ],
    organicTreatment: [
      {
        name: 'Bordeaux Mixture 1% (Copper Sulphate + Slaked Lime)',
        recipe: 'Dissolve 1 kg CuSO4 in 50 L water and 1 kg Lime in 50 L water; combine and mix thoroughly.',
        frequency: 'Spray every 10-12 days.',
      },
      {
        name: 'Trichoderma harzianum + Pseudomonas fluorescens',
        recipe: '5 g each per liter of water.',
        frequency: 'Foliar spray at 7-day intervals.',
      },
      {
        name: 'Garlic + Chilli Bio-extract',
        recipe: 'Extract 500g garlic + 500g hot chillies in 5L water, ferment for 24h, dilute to 100L.',
        frequency: 'Repels secondary pest infections.',
      },
    ],
    preventionTips: [
      'Use drip irrigation instead of overhead sprinklers to keep tomato leaves dry.',
      'Prune bottom 30 cm sucker leaves to improve airflow and prevent soil splash during rain.',
      'Mulch soil with organic straw or silver-black plastic mulch.',
      'Practice 3-year crop rotation with non-solanaceous crops (maize, pulses, mustard).',
    ],
    riskSeason: 'Throughout Kharif & Rabi, especially after rainfall or heavy overhead sprinkler use',
  },
  {
    id: 'potato-late-blight',
    name: 'Potato Late Blight',
    localName: {
      hi: 'आलू का पछेती झुलसा रोग',
      pa: 'ਆਲੂ ਦਾ ਪਛੇਤਾ ਝੁਲਸਾ',
      bn: 'আলুর নাভি ধসা রোগ',
      te: 'బంగాళాదుంప లేట్ బ్లైట్ తెగులు',
      ta: 'உருளைக்கிழங்கு பின்கால கருகல் நோய்',
      mr: 'बटाट्यावरील उशिरा येणारा करपा',
      gu: 'બટાટાનો પાછોતરો સુકારો',
    },
    crop: 'Potato',
    pathogen: 'Fungal',
    severity: 'High',
    symptoms: [
      'Water-soaked dark lesions appearing on leaf tips and margins, rapidly expanding into black rotting patches.',
      'White cottony fungal downy growth visible on the underside of affected leaves in morning humidity.',
      'Foul decaying smell across entire potato field; tubers develop firm dry brown rot below skin.',
    ],
    causes: [
      'Phytophthora infestans (Oomycete).',
      'Consecutive cloudy, foggy days with relative humidity >85% and temperatures between 10°C - 20°C.',
      'Rainfall or heavy dew providing free moisture on potato leaves for >6-8 continuous hours.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    chemicalTreatment: [
      {
        name: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold)',
        dosage: '2.5 g per liter of water (500 g per acre)',
        safetyPeriodDays: 14,
        instruction: 'Systemic curative spray within 24-48 hours of weather alert.',
      },
      {
        name: 'Mandipropamid 23.4% SC (Revus)',
        dosage: '0.8 ml per liter of water (160 ml in 200 L water per acre)',
        safetyPeriodDays: 7,
        instruction: 'Rainfast protection adhering firmly to leaf wax layer.',
      },
      {
        name: 'Dimethomorph 50% WP (Acrobat)',
        dosage: '1 g per liter of water + Mancozeb (2 g/L)',
        safetyPeriodDays: 10,
        instruction: 'Translaminar anti-sporulant.',
      },
    ],
    organicTreatment: [
      {
        name: 'Copper Hydroxide 77% WP (Kocide)',
        recipe: '2 g per liter of water as preventative surface barrier.',
        frequency: 'Spray before onset of cloudy foggy periods.',
      },
      {
        name: 'Liquid Jeevamrit Foliar Application',
        recipe: '10% solution of fermented Jeevamrit strained through fine filter.',
        frequency: 'Spray every 8 days.',
      },
    ],
    preventionTips: [
      'Always plant certified disease-free potato seed tubers (e.g. Kufri Pukhraj, Kufri Jyoti, Kufri Chipsona).',
      'Follow ICAR-CPRI Indo-Blightcast disease forecasting models for timing preventative sprays.',
      'Proper earthing-up (covering tuber ridges with 15cm soil) prevents spores washing down to tubers.',
      'Cut and burn haulms (above-ground vines) 10-15 days before harvest if late blight hits late in season.',
    ],
    riskSeason: 'December to February in Northern and Eastern India during dense fog spells',
  },
  {
    id: 'sugarcane-red-rot',
    name: 'Sugarcane Red Rot',
    localName: {
      hi: 'गन्ने का लाल सड़न (कैंसर) रोग',
      pa: 'ਗੰਨੇ ਦਾ ਲਾਲ ਸੜਨ ਰੋਗ',
      bn: 'আখের লাল পচা রোগ',
      te: 'చెరకు ఎరుపు కుళ్ళు తెగులు',
      ta: 'கரும்பு செவ்வழுகல் நோய்',
      mr: 'उसाचा तांबेरा / लाल सड',
      gu: 'શેરડીનો લાલ સડો',
    },
    crop: 'Sugarcane',
    pathogen: 'Fungal',
    severity: 'High',
    symptoms: [
      'Third and fourth leaves from top show yellowing, wilting, and drying along the margins and midrib.',
      'Longitudinal splitting of the cane reveals blood-red internal tissues with characteristic white transverse bands.',
      'Distinct alcohol / sour fermenting odor emanating from infected split stalks.',
    ],
    causes: [
      'Colletotrichum falcatum fungus.',
      'Use of infected seed cane sets for planting.',
      'Waterlogging in low-lying fields and ill-drained soils during monsoon.',
      'Monoculture of susceptible varieties (e.g. Co 0238).',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1599818493132-ff45b9a9eeaa?auto=format&fit=crop&w=800&q=80',
    chemicalTreatment: [
      {
        name: 'Carbendazim 50% WP (Bavistin) - Sett Treatment',
        dosage: '1 g per liter of water (100 g in 100 L water)',
        safetyPeriodDays: 60,
        instruction: 'Dip cane setts for 15-20 minutes before planting in furrows.',
      },
      {
        name: 'Thiophanate Methyl 70% WP (Roko)',
        dosage: '1.5 g per liter of water',
        safetyPeriodDays: 45,
        instruction: 'Soil drenching around stools in early disease stages.',
      },
    ],
    organicTreatment: [
      {
        name: 'Trichoderma harzianum Sett Dipping',
        recipe: '10 g per liter of water mixed with 5% jaggery solution.',
        frequency: 'Mandatory bio-treatment prior to planting.',
      },
      {
        name: 'Green Manuring with Sunnhemp / Dhaincha',
        recipe: 'Incorporate 45-day-old Dhaincha into soil 2 weeks before sugarcane planting to enrich antagonistic soil microbes.',
        frequency: 'Seasonal soil restoration.',
      },
    ],
    preventionTips: [
      'Never take ratoon crops from diseased fields; burn affected crop residue completely.',
      'Adopt Moist Hot Air Treatment (MHAT) of seed canes at 54°C for 2.5 hours at sugar mill nurseries.',
      'Switch to newly released resistant varieties like Co 0118, Co 15023, CoPb 95, or CoLk 14201.',
      'Ensure proper furrow drainage to prevent monsoon water stagnating around root systems.',
    ],
    riskSeason: 'July to October (Monsoon and post-monsoon cane development)',
  },
  {
    id: 'maize-fall-armyworm',
    name: 'Fall Armyworm in Maize (Spodoptera frugiperda)',
    localName: {
      hi: 'मक्का का फॉल आर्मीवर्म (सैनिक कीट)',
      pa: 'ਮੱਕੀ ਦਾ ਫਾਲ ਆਰਮੀਵਰਮ',
      bn: 'ভুট্টার ফল আর্মিওয়ার্ম',
      te: 'మొక్కజొన్న కత్తెర పురుగు',
      ta: 'மக்காச்சோள படைப்புழு',
      mr: 'मक्यावरील लष्करी अळी',
      gu: 'મકાઈની લશ્કરી ઈયળ',
    },
    crop: 'Maize / Corn',
    pathogen: 'Pest / Insect',
    severity: 'High',
    symptoms: [
      'Skeletonized window pane feeding on young maize whorl leaves with ragged shot holes.',
      'Prominent sawdust-like brownish fecal frass accumulated deep inside the plant whorl.',
      'Caterpillar has inverted "Y" mark on dark head and four raised black dots arranged in a square on the 8th abdominal segment.',
    ],
    causes: [
      'Invasive noctuid moth Spodoptera frugiperda larvae.',
      'Intermittent dry spells during early vegetative whorl stage (V3-V6 stage).',
      'Delayed pest detection due to larvae hiding deep inside tight whorl funnel.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    chemicalTreatment: [
      {
        name: 'Chlorantraniliprole 18.5% SC (Coragen)',
        dosage: '0.4 ml per liter of water (80 ml in 200 L water per acre)',
        safetyPeriodDays: 14,
        instruction: 'Direct spray nozzle straight into central whorl for maximum larval contact.',
      },
      {
        name: 'Emamectin Benzoate 5% SG (Proclaim)',
        dosage: '0.5 g per liter of water (100 g per acre)',
        safetyPeriodDays: 7,
        instruction: 'Target 1st and 2nd instar larvae during evening hours.',
      },
      {
        name: 'Spinetoram 11.7% SC (Delegate)',
        dosage: '0.5 ml per liter of water',
        safetyPeriodDays: 10,
        instruction: 'Fast knock-down translaminar action.',
      },
    ],
    organicTreatment: [
      {
        name: 'Pheromone Traps & Light Traps',
        recipe: 'Install 5-8 FAW lure pheromone traps per acre for moth monitoring and mass trapping.',
        frequency: 'Check weekly; change lure septa every 30 days.',
      },
      {
        name: 'Bacillus thuringiensis (Bt kurstaki) 55000 IU/mg',
        recipe: '2 g per liter of water directed into whorls in late afternoon.',
        frequency: 'Apply upon first notice of pin-hole damage.',
      },
      {
        name: 'Beauveria bassiana 1.15% WP (Bio-fungal insecticide)',
        recipe: '5 g per liter of water in humid weather.',
        frequency: 'Infects and colonizes caterpillars.',
      },
      {
        name: 'Poison Baiting (Jaggery + Rice Bran + Thiodicarb)',
        recipe: 'Mix 10 kg rice bran + 2 kg jaggery in 3 L water, ferment for 24h, add 100g insecticide, drop small pellets into whorls.',
        frequency: 'Highly effective against grown 4th-5th instar larvae.',
      },
    ],
    preventionTips: [
      'Apply sand + wood ash mixture (9:1) into central whorls of maize plants 15-20 days after germination.',
      'Intercrop maize with pulses like cowpea, black gram, or pigeon pea to attract predatory wasps & ladybird beetles.',
      'Deep summer ploughing to expose pupae in soil to scorching sun and birds.',
    ],
    riskSeason: 'Both Kharif & Rabi seasons from 15 to 45 days after maize emergence',
  },
];
