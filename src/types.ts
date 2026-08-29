export type Language = 
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'bn' // Bengali (বাংলা)
  | 'te' // Telugu (తెలుగు)
  | 'ta' // Tamil (தமிழ்)
  | 'mr' // Marathi (मराठी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'or'; // Odia (ଓଡ଼ିଆ)

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: 'farmer' | 'expert' | 'cooperative';
  state: string;
  district: string;
  primaryCrops: string[];
  landSizeAcres: number;
  soilType: string;
  avatar?: string;
  preferredLanguage?: Language;
}

export interface DiseaseDetail {
  id: string;
  name: string;
  localName: Record<string, string>;
  crop: string;
  pathogen: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest / Insect' | 'Nutrient Deficiency';
  severity: 'High' | 'Medium' | 'Low';
  symptoms: string[];
  causes: string[];
  imageUrl: string;
  chemicalTreatment: {
    name: string;
    dosage: string;
    safetyPeriodDays: number;
    instruction: string;
  }[];
  organicTreatment: {
    name: string;
    recipe: string;
    frequency: string;
  }[];
  preventionTips: string[];
  riskSeason: string;
}

export interface DiseaseScanResult {
  cropName: string;
  diseaseName: string;
  scientificName?: string;
  confidence: number;
  severity: 'High' | 'Medium' | 'Low' | 'Healthy';
  isHealthy: boolean;
  affectedPart: string;
  summary: string;
  symptomsObserved: string[];
  immediateActions: string[];
  chemicalRemedies: {
    chemical: string;
    dosage: string;
    applicationMethod: string;
  }[];
  organicRemedies: {
    remedy: string;
    preparation: string;
    application: string;
  }[];
  irrigationPrecaution: string;
  weatherAdvice: string;
  imageUrl?: string;
  timestamp: string;
}

export interface WeatherData {
  city: string;
  state: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeedKmH: number;
  rainfallMm: number;
  rainProbability: number;
  uvIndex: number;
  condition: string;
  icon: string;
  soilMoistureEstimate: 'Dry' | 'Adequate' | 'Moist' | 'Saturated';
  sprayAdvisory: {
    status: 'Optimal' | 'Caution' | 'Unfavorable';
    reason: string;
  };
  irrigationAdvisory: string;
  forecast: {
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    condition: string;
    sprayStatus: 'Optimal' | 'Caution' | 'Unfavorable';
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'bot' | 'system';
  text: string;
  timestamp: string;
  language?: Language;
  suggestions?: string[];
  actionLink?: {
    type: 'disease' | 'weather' | 'irrigation';
    id?: string;
    label: string;
  };
}

export interface IrrigationPlan {
  crop: string;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting / Grain filling' | 'Maturity';
  soilType: string;
  acres: number;
  waterRequiredLitersPerDay: number;
  irrigationFrequencyHours: number;
  dripRunTimeHours: number;
  floodIrrigationHours: number;
  recommendation: string;
  savingsVsTraditionalPct: number;
}
