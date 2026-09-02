import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

const app = express();
const PORT = 3001;

// -------------------------------------------------------------
// BODY PARSER
// -------------------------------------------------------------

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// -------------------------------------------------------------
// GEMINI MODELS & AI CLIENT WITH AUTO FAILOVER (404 & 429)
// -------------------------------------------------------------

// Active, fully supported Gemini 3.x production models
const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.1-pro-preview',
  'gemini-3.1-flash-lite',
  'gemini-3-flash',
];

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 120000,
        headers: {
          'User-Agent': 'krishiai-app',
        },
      },
    });
  }

  return aiClient;
}

/**
 * Handles backoff on 503 and auto-fails over to the next model 
 * when hitting 429 quota limits or 404 endpoint errors.
 */
async function generateContentWithRetry(
  ai: GoogleGenAI,
  requestPayload: any,
  modelsToTry: string[] = GEMINI_MODELS,
  maxRetriesPerModel = 2
) {
  let lastError: any = null;

  for (const model of modelsToTry) {
    let delay = 1000;

    for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
      try {
        console.log(`[Gemini API] Querying model: ${model} (Attempt ${attempt + 1})`);
        return await ai.models.generateContent({
          model,
          ...requestPayload,
        });
      } catch (error: any) {
        lastError = error;
        const status = error?.status;
        const errorMessage = error?.message || String(error);

        const is503 = status === 503 || /503|UNAVAILABLE|high demand/i.test(errorMessage);
        const is404 = status === 404 || /404|NOT_FOUND|no longer available/i.test(errorMessage);
        const is429 = status === 429 || /429|RESOURCE_EXHAUSTED|quota|limit/i.test(errorMessage);

        // Retry with backoff if server is temporarily overloaded (503)
        if (is503 && attempt < maxRetriesPerModel - 1) {
          console.warn(`[Gemini API] 503 Overload on ${model}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }

        // On 429 Quota Exceeded or 404 Endpoint Not Found, immediately failover to next model
        if (is429 || is404 || is503) {
          console.warn(`[Gemini API] Model ${model} failed (${status || 'Error/Quota'}). Failing over to next model...`);
          break;
        }

        // Throw non-retryable errors immediately (e.g. invalid auth key)
        throw error;
      }
    }
  }

  throw lastError || new Error('All available Gemini models failed or reached quota limits.');
}

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KrishiAI Agri Engine',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    aiEnabled: Boolean(process.env.GEMINI_API_KEY?.trim()),
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// CROP DISEASE SCANNER
// -------------------------------------------------------------

app.post('/api/analyze-crop', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      language = 'en',
      cropHint = '',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: 'imageBase64 is required',
      });
    }

    const cleanBase64 = imageBase64.replace(
      /^data:image\/[\w.+-]+;base64,/,
      ''
    );

    const ai = getAIClient();

    if (!ai) {
      return res.status(503).json({
        error: 'AI service is not configured.',
      });
    }

    const languageMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      pa: 'Punjabi (ਪੰਜਾਬੀ)',
      bn: 'Bengali (বাংলা)',
      te: 'Telugu (తెలుగు)',
      ta: 'Tamil (தமிழ்)',
      mr: 'Marathi (मराठी)',
      gu: 'Gujarati (ગુજરાતી)',
      kn: 'Kannada (ਕನ್ನಡ)',
      ml: 'Malayalam (മലയാളം)',
      or: 'Odia (ଓଡ଼ਿଆ)',
    };

    const targetLang = languageMap[language] || 'English';

    const prompt = `
You are the crop diagnosis engine for KrishiAI.

Analyze the uploaded plant image carefully.

${cropHint ? `The farmer provided this crop hint: ${cropHint}` : ''}

IMPORTANT:

- Analyze the actual image.
- Identify the crop from visible characteristics.
- Do not assume the disease from the crop hint.
- Do not use a fixed diagnosis.
- Do not return Rice Blast unless the image actually supports it.
- If the image does not provide enough evidence, say that the diagnosis is uncertain.
- A tomato image must not automatically be classified as a rice disease.
- Distinguish disease, pest damage, nutrient deficiency and healthy plants.
- Confidence must reflect the visual evidence.

Provide:

1. Crop name
2. Disease/pest/deficiency/healthy status
3. Scientific pathogen name if applicable
4. Confidence percentage
5. Severity
6. Affected plant part
7. Visible symptoms
8. Immediate actions
9. Chemical treatment options
10. Organic treatment options
11. Irrigation precautions
12. Weather/spray precautions

All farmer-facing text must be in ${targetLang}.

Return ONLY valid JSON.
`;

    const response = await generateContentWithRetry(
      ai,
      {
        contents: [
          prompt,
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING },
              diseaseName: { type: Type.STRING },
              scientificName: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low', 'Healthy'] },
              isHealthy: { type: Type.BOOLEAN },
              affectedPart: { type: Type.STRING },
              summary: { type: Type.STRING },
              symptomsObserved: { type: Type.ARRAY, items: { type: Type.STRING } },
              immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
              chemicalRemedies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    chemical: { type: Type.STRING },
                    dosage: { type: Type.STRING },
                    applicationMethod: { type: Type.STRING },
                  },
                  required: ['chemical', 'dosage', 'applicationMethod'],
                },
              },
              organicRemedies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    remedy: { type: Type.STRING },
                    preparation: { type: Type.STRING },
                    application: { type: Type.STRING },
                  },
                  required: ['remedy', 'preparation', 'application'],
                },
              },
              irrigationPrecaution: { type: Type.STRING },
              weatherAdvice: { type: Type.STRING },
            },
            required: [
              'cropName',
              'diseaseName',
              'scientificName',
              'confidence',
              'severity',
              'isHealthy',
              'affectedPart',
              'summary',
              'symptomsObserved',
              'immediateActions',
              'chemicalRemedies',
              'organicRemedies',
              'irrigationPrecaution',
              'weatherAdvice',
            ],
          },
        },
      }
    );

    const responseText = response.text || '{}';

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (error) {
      console.error('Invalid AI JSON response:', responseText);

      return res.status(500).json({
        error: 'The diagnosis service returned an invalid response.',
      });
    }

    return res.json({
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Crop analysis error:', error);

    const errorMessage = error?.message || String(error);
    const isTimeout =
      error?.name === 'AbortError' ||
      /timeout|timed out|headers timeout|deadline/i.test(errorMessage);

    const isQuotaExhausted =
      error?.status === 429 || /429|RESOURCE_EXHAUSTED|quota/i.test(errorMessage);

    if (isQuotaExhausted) {
      return res.status(429).json({
        error: 'Daily AI free tier limits have been reached across available models. Please wait for reset or enable billing.',
        retryable: false,
      });
    }

    const isTemporaryAIError =
      isTimeout ||
      error?.status === 503 ||
      /503|UNAVAILABLE|high demand|temporarily unavailable/i.test(errorMessage);

    if (isTemporaryAIError) {
      return res.status(503).json({
        error: 'AI diagnosis is temporarily unavailable. Please try again in a moment.',
        retryable: true,
        details: isTimeout
          ? 'The AI service took too long to respond.'
          : 'The AI service is temporarily unavailable.',
      });
    }

    return res.status(500).json({
      error: 'Failed to analyze crop image',
      details: errorMessage,
    });
  }
});

// -------------------------------------------------------------
// KRISHI SAATHI CHAT
// -------------------------------------------------------------

app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      language = 'en',
      userProfile,
    } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    const ai = getAIClient();

    if (!ai) {
      return res.status(503).json({
        error: 'AI service is not configured.',
      });
    }

    const languageMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      pa: 'Punjabi (ਪੰਜਾਬੀ)',
      bn: 'Bengali (বাংলা)',
      te: 'Telugu (తెలుగు)',
      ta: 'Tamil (தமிழ்)',
      mr: 'Marathi (मराठी)',
      gu: 'Gujarati (ગુજરાતી)',
      kn: 'Kannada (ਕನ್ನಡ)',
      ml: 'Malayalam (മലയാളം)',
      or: 'Odia (ଓଡ଼ਿਆ)',
    };

    const currentLang = languageMap[language] || 'English';

    const userContext = userProfile
      ? `
Farmer information:
State: ${userProfile.state || 'Not provided'}
District: ${userProfile.district || 'Not provided'}
Crops: ${userProfile.primaryCrops?.join(', ') || 'Not provided'}
Soil: ${userProfile.soilType || 'Not provided'}
Land: ${userProfile.landSizeAcres || 'Not provided'} acres
`
      : 'General Indian farmer context.';

    const systemInstruction = `
You are Krishi Saathi, an agricultural advisory assistant for KrishiAI.

${userContext}

Your mission:

- Provide clear, practical, accurate, and empathetic agronomic advice to Indian farmers.
- Help with crop diseases, fertilizers, irrigation, pest management,
  weather precautions, crop planning, organic farming, government schemes,
  soil management and Mandi marketing.
- Always communicate in ${currentLang}.
- Use a warm, respectful and easy-to-understand tone.
- Format responses with clean, scannable bullet points.
- Keep explanations crisp, practical, and farmer-friendly.
- For chemical recommendations, advise the farmer to verify the product
  label and local agricultural guidance before application.
`;

    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [
            {
              text: item.text,
            },
          ],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: message,
        },
      ],
    });

    const response = await generateContentWithRetry(
      ai,
      {
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      }
    );

    const reply =
      response.text ||
      'I am ready to help with your farming question.';

    return res.json({
      reply,
      language,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat error:', error);

    return res.status(500).json({
      error: 'Failed to process chat message',
      details: error?.message || String(error),
    });
  }
});

// -------------------------------------------------------------
// SMART IRRIGATION
// -------------------------------------------------------------

app.post('/api/irrigation-advisory', (req, res) => {
  try {
    const {
      crop,
      growthStage,
      soilType,
      acres = 1,
      temp = 30,
      rainfallForecastMm = 0,
    } = req.body;

    const cropWaterFactors: Record<string, number> = {
      'Rice / Paddy': 22000,
      Wheat: 11000,
      Cotton: 14000,
      Sugarcane: 25000,
      'Tomato / Vegetables': 9500,
      Potato: 8500,
      'Maize / Corn': 10500,
      Mustard: 6000,
      Soybean: 8000,
      Groundnut: 7500,
      Chilli: 7000,
    };

    const stageMultiplier: Record<string, number> = {
      Germination: 0.6,
      Vegetative: 1.0,
      Flowering: 1.35,
      'Fruiting / Grain filling': 1.25,
      Maturity: 0.5,
    };

    const soilMultiplier: Record<string, number> = {
      Clayey: 0.85,
      Black: 0.9,
      Alluvial: 1.0,
      'Sandy Loam': 1.2,
      Red: 1.1,
      Laterite: 1.15,
    };

    const baseNeed = cropWaterFactors[crop] || 10000;
    const stageFactor = stageMultiplier[growthStage] || 1;
    const soilFactor = soilMultiplier[soilType] || 1;

    const tempFactor =
      temp > 28
        ? 1 + (temp - 28) * 0.025
        : 0.95;

    const rainDeduction = Math.min(
      baseNeed * 0.8,
      rainfallForecastMm * 4046
    );

    const netWaterPerDay =
      Math.max(
        0,
        Math.round(
          baseNeed *
            stageFactor *
            soilFactor *
            tempFactor -
            rainDeduction
        )
      ) * Number(acres);

    const dripRunHours = Number(
      (
        netWaterPerDay /
        (10000 * Number(acres))
      ).toFixed(1)
    );

    const floodHours = Number(
      (
        netWaterPerDay /
        (40000 * Number(acres))
      ).toFixed(1)
    );

    let frequencyHours = 24;

    if (soilType === 'Sandy Loam') {
      frequencyHours = 12;
    }

    if (
      soilType === 'Black' ||
      soilType === 'Clayey'
    ) {
      frequencyHours = 48;
    }

    let recommendation =
      `Apply ${netWaterPerDay.toLocaleString()} Liters of water across ${acres} Acre(s).`;

    if (
      growthStage === 'Flowering' ||
      growthStage === 'Fruiting / Grain filling'
    ) {
      recommendation +=
        ' Critical moisture-sensitive stage. Avoid water stress.';
    }

    if (rainfallForecastMm > 10) {
      recommendation +=
        ` Forecast indicates ${rainfallForecastMm}mm rain. Consider delaying irrigation if field conditions allow.`;
    }

    return res.json({
      crop,
      growthStage,
      soilType,
      acres,
      temp,
      rainfallForecastMm,
      baseNeed,
      stageFactor,
      soilFactor,
      tempFactor,
      rainDeduction,
      netWaterPerDay,
      dripRunHours,
      floodHours,
      frequencyHours,
      recommendation,
      savingsVsTraditionalPct: 38,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || String(error),
    });
  }
});

// -------------------------------------------------------------
// ZIP DOWNLOAD
// -------------------------------------------------------------

app.get('/api/download-zip', (req, res) => {
  const zipPath = path.join(
    process.cwd(),
    'krishiai-codebase.zip'
  );

  res.download(
    zipPath,
    'krishiai-codebase.zip',
    (error) => {
      if (error && !res.headersSent) {
        res.status(500).json({
          error: 'Failed to download zip file',
        });
      }
    }
  );
});

// -------------------------------------------------------------
// VITE
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(
      process.cwd(),
      'dist'
    );

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(
        path.join(
          distPath,
          'index.html'
        )
      );
    });
  }

  app.listen(
    PORT,
    '0.0.0.0',
    () => {
      console.log(
        `🌾 KrishiAI Server running at http://0.0.0.0:${PORT}`
      );
    }
  );
}

startServer();