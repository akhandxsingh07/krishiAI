export interface SlideContent {
  slideNumber: number;
  title: string;
  subtitle?: string;
  category: string;
  tagline?: string;
  keyPoints?: string[];
  sections?: {
    heading: string;
    subheading?: string;
    items?: string[];
    color?: string;
    badge?: string;
  }[];
  steps?: {
    step: string;
    title: string;
    description: string;
    color?: string;
  }[];
  footerNote?: string;
}

export const PRESENTATION_SLIDES: SlideContent[] = [
  {
    slideNumber: 1,
    title: 'KrishiAI',
    subtitle: 'An AI-powered agricultural assistant for smarter, faster, and more sustainable farming.',
    category: 'Idea Presentation • Eureka',
    tagline: 'AI + COMPUTER VISION + REAL-TIME AGRI INTELLIGENCE',
    footerNote: 'Detect • Decide • Act',
    sections: [
      {
        heading: 'Core Capabilities',
        items: [
          'Computer Vision Crop Disease Screening',
          'Hyper-local Weather Intelligence & Alerts',
          'Multilingual Farmer Advisory (Major Indian Languages)',
          'Smart Irrigation & Input Decision Engine',
        ],
      },
    ],
  },
  {
    slideNumber: 2,
    title: 'The Problem',
    subtitle: 'Farmers often have the crop — but not the right information at the right time.',
    category: 'Problem Statement',
    footerNote: 'CORE GAP: farmers need simple, localized, actionable advice — not scattered information.',
    sections: [
      {
        heading: 'Crop Disease',
        subheading: 'Symptoms are identified late, causing avoidable crop damage and yield loss.',
        badge: '1',
        color: 'emerald',
      },
      {
        heading: 'Unpredictable Weather',
        subheading: 'Sudden rain, heat spikes, or humidity fluctuations disrupt critical farm spray and harvest decisions.',
        badge: '2',
        color: 'emerald',
      },
      {
        heading: 'Improper Irrigation',
        subheading: 'Watering decisions rely on guesswork rather than real-time soil moisture and evapotranspiration data.',
        badge: '3',
        color: 'emerald',
      },
      {
        heading: 'Limited Expert Access',
        subheading: 'Small and medium-scale farmers lack quick, trustworthy agronomy guidance in their mother tongue.',
        badge: '4',
        color: 'amber',
      },
    ],
  },
  {
    slideNumber: 3,
    title: 'Our Solution — KrishiAI',
    subtitle: 'One mobile-first assistant that converts crop signals + real-time information into clear actions.',
    category: 'Solution Architecture',
    steps: [
      { step: 'A', title: 'Upload Crop Image', description: 'AI vision checks visible leaf/stem/fruit symptoms.', color: 'emerald' },
      { step: 'B', title: 'Get Diagnosis Support', description: 'Possible disease + confidence score + instant organic & chemical next steps.', color: 'emerald' },
      { step: 'C', title: 'Ask in Local Language', description: 'Simple voice & text guidance in regional Indian languages.', color: 'emerald' },
      { step: 'D', title: 'Weather Intelligence', description: 'Alerts for weather conditions that trigger or exacerbate crop diseases.', color: 'amber' },
      { step: 'E', title: 'Irrigation Guidance', description: 'Decision support for better, more water-efficient crop watering.', color: 'amber' },
      { step: 'F', title: 'Crop Management', description: 'Practical preventive, seasonal, and post-detection management steps.', color: 'amber' },
    ],
  },
  {
    slideNumber: 4,
    title: 'How KrishiAI Works',
    subtitle: 'A simple pipeline from field observation to actionable recommendation.',
    category: 'Pipeline Workflow',
    footerNote: 'Design Principle: AI should support decisions — not overwhelm the farmer. Every output is designed to be localized, understandable, and action-oriented.',
    steps: [
      { step: '01', title: 'Capture', description: 'Farmer uploads or takes a crop photo in the app.' },
      { step: '02', title: 'Analyze', description: 'Computer vision model detects and classifies possible disease patterns.' },
      { step: '03', title: 'Context', description: 'Weather + crop stage + soil inputs enrich the diagnostic analysis.' },
      { step: '04', title: 'Advise', description: 'KrishiAI converts results into simple, step-by-step recommended actions.' },
      { step: '05', title: 'Learn', description: 'Farmer feedback improves model accuracy and recommendation relevance over time.' },
    ],
  },
  {
    slideNumber: 5,
    title: 'Key Features',
    subtitle: 'KrishiAI combines multiple high-value capabilities in one farmer-focused platform.',
    category: 'Product Capabilities',
    sections: [
      {
        heading: 'Crop Disease Detection',
        subheading: 'Image-based screening for visible crop disease symptoms with instant organic/chemical dosages.',
        color: 'emerald',
      },
      {
        heading: 'Weather Alerts',
        subheading: 'Timely warnings based on relevant weather conditions and pesticide spray safety windows.',
        color: 'amber',
      },
      {
        heading: 'Irrigation Guidance',
        subheading: 'Decision support for better and more efficient watering based on soil and crop growth stage.',
        color: 'cyan',
      },
      {
        heading: 'Regional Languages',
        subheading: 'Guidance delivered through regional language text and voice across 10+ major Indian languages.',
        color: 'emerald',
      },
      {
        heading: 'Crop Management',
        subheading: 'Preventive, seasonal, fertilizer calculation, and post-detection management workflows.',
        color: 'emerald',
      },
      {
        heading: 'Farmer Feedback Loop',
        subheading: 'Continuous feedback mechanisms to calibrate recommendations against localized field realities.',
        color: 'amber',
      },
    ],
  },
  {
    slideNumber: 6,
    title: 'Technology Architecture',
    subtitle: 'A modular architecture allows KrishiAI to start as an MVP and scale gradually.',
    category: 'Tech Stack',
    sections: [
      {
        heading: 'Farmer App (Frontend)',
        subheading: 'Mobile-first React UI • Image Upload & Camera • Voice/Text Assistant • Multilingual Regional UI',
        color: 'emerald',
      },
      {
        heading: 'Intelligence Layer (AI / ML)',
        subheading: 'Multimodal Vision Models (Gemini 3.7 Flash) • Disease Classification • Recommendation Engine',
        color: 'emerald',
      },
      {
        heading: 'Data & Context Layer',
        subheading: 'Real-Time Open-Meteo Weather API • ICAR Agronomy Knowledge Base • Farm/Soil/Stage Inputs',
        color: 'amber',
      },
      {
        heading: 'Cloud / Backend (Express & Node.js)',
        subheading: 'Model Serving API Proxy • Farmer Context State • Feedback Loop & Analytics • Docker & Cloud Run',
        color: 'slate',
      },
    ],
  },
  {
    slideNumber: 7,
    title: 'Target Users & Value Proposition',
    subtitle: 'Built first for farmers who need practical support more than technical complexity.',
    category: 'Market & Impact',
    footerNote: 'VALUE: Localized recommendations that are easy to understand and act on.',
    sections: [
      {
        heading: 'Primary Users',
        subheading: 'Small and medium-scale farmers who need quick crop health and farm-management guidance.',
        color: 'emerald',
      },
      {
        heading: 'Secondary Users',
        subheading: 'Farmer producer organizations (FPOs), agri-input partners, NGOs, cooperatives, and agri-support programs.',
        color: 'amber',
      },
    ],
    steps: [
      { step: '1', title: 'Farmer', description: 'Easy access to guidance in native dialect.' },
      { step: '2', title: 'Field', description: 'Faster response to early symptom outbreaks.' },
      { step: '3', title: 'Crop', description: 'Better chemical, organic, and water decisions.' },
      { step: '4', title: 'Outcome', description: 'Lower avoidable crop loss + improved farm net profits.' },
    ],
  },
  {
    slideNumber: 8,
    title: 'Why KrishiAI?',
    subtitle: 'The differentiator is not just AI — it is how AI is packaged for the farmer.',
    category: 'Competitive Differentiation',
    sections: [
      {
        heading: 'Traditional Information Sources',
        items: [
          'Often fragmented across portals',
          'Expert advice may not be instantly available',
          'Information can be difficult for farmers to interpret',
          'Language barriers and slow response times',
        ],
        color: 'slate',
      },
      {
        heading: 'KrishiAI Approach',
        items: [
          'Image-first instant crop screening',
          'Context-aware recommendations (weather + stage)',
          'Regional language text and voice synthesis',
          'Action-oriented output (exact ml/liter dosage)',
        ],
        color: 'emerald',
      },
      {
        heading: 'Our Advantage',
        items: [
          'One single interface for multiple farm decisions',
          'Designed for low-literacy and mobile accessibility',
          'Continuously learns through field feedback',
          'Scalable across all major Indian crops and states',
        ],
        color: 'slate',
      },
    ],
  },
  {
    slideNumber: 9,
    title: 'Business Model & Sustainability',
    subtitle: 'Start with accessible farmer value, then scale through partnerships.',
    category: 'Business Strategy',
    sections: [
      {
        heading: 'Freemium / Farmer App',
        subheading: 'Core crop guidance and disease diagnosis remains accessible free for smallholders; premium diagnostic tools support advanced users.',
        color: 'emerald',
      },
      {
        heading: 'B2B Partnerships',
        subheading: 'Cooperatives, agri organizations, FPOs, and input institutions deploy KrishiAI for clusters and farmer field schools.',
        color: 'amber',
      },
      {
        heading: 'Enterprise / API',
        subheading: 'Crop disease screening, weather intelligence, and recommendation APIs serve agri-tech and insurance partners.',
        color: 'slate',
      },
    ],
    steps: [
      { step: '1', title: 'Build MVP', description: 'Validate model on selected priority staple crops.' },
      { step: '2', title: 'Pilot', description: 'Test with real farmers + agricultural university experts.' },
      { step: '3', title: 'Improve', description: 'Use field feedback to raise diagnostic accuracy and usability.' },
      { step: '4', title: 'Scale', description: 'Expand across all crops, languages, and agro-climatic zones.' },
    ],
  },
  {
    slideNumber: 10,
    title: 'MVP Roadmap',
    subtitle: 'A focused first version can prove the concept before expanding into a full agri-intelligence platform.',
    category: 'Execution Timeline',
    footerNote: 'Goal: validate a useful, trustworthy MVP — then scale based on real farmer feedback.',
    steps: [
      {
        step: 'Phase 1',
        title: '0–3 Months',
        description: 'Select 2–3 staple crops • Build disease-image dataset • Train baseline multimodal vision model • Create mobile web prototype.',
        color: 'emerald',
      },
      {
        step: 'Phase 2',
        title: '3–6 Months',
        description: 'Live Weather integration • Regional-language UI (10+ languages) • Pilot with farmer test groups • Expert agronomy validation.',
        color: 'emerald',
      },
      {
        step: 'Phase 3',
        title: '6–12 Months',
        description: 'Smart irrigation guidance • Expanded crop & pest catalog • Voice assistant integration • Feedback-driven iterative improvements.',
        color: 'emerald',
      },
      {
        step: 'Phase 4',
        title: '12+ Months',
        description: 'Scale across all agro-climatic regions • Cooperative partnership model • Agri-analytics dashboard • End-to-end ecosystem integrations.',
        color: 'emerald',
      },
    ],
  },
];
