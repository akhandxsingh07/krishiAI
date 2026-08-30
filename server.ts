import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load .env from project root
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
// AI CLIENT
// -------------------------------------------------------------

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
        headers: {
          'User-Agent': 'krishiai-app',
        },
      },
    });
  }

  return aiClient;
}

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KrishiAI Agri Engine',
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
      kn: 'Kannada (ಕನ್ನಡ)',
      ml: 'Malayalam (മലയാളം)',
      or: 'Odia (ଓଡ଼ିଆ)',
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',

      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },

      config: {
        responseMimeType: 'application/json',

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            cropName: {
              type: Type.STRING,
            },

            diseaseName: {
              type: Type.STRING,
            },

            scientificName: {
              type: Type.STRING,
            },

            confidence: {
              type: Type.NUMBER,
            },

            severity: {
              type: Type.STRING,
              enum: ['High', 'Medium', 'Low', 'Healthy'],
            },

            isHealthy: {
              type: Type.BOOLEAN,
            },

            affectedPart: {
              type: Type.STRING,
            },

            summary: {
              type: Type.STRING,
            },

            symptomsObserved: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },

            immediateActions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },

            chemicalRemedies: {
              type: Type.ARRAY,

              items: {
                type: Type.OBJECT,

                properties: {
                  chemical: {
                    type: Type.STRING,
                  },

                  dosage: {
                    type: Type.STRING,
                  },

                  applicationMethod: {
                    type: Type.STRING,
                  },
                },

                required: [
                  'chemical',
                  'dosage',
                  'applicationMethod',
                ],
              },
            },

            organicRemedies: {
              type: Type.ARRAY,

              items: {
                type: Type.OBJECT,

                properties: {
                  remedy: {
                    type: Type.STRING,
                  },

                  preparation: {
                    type: Type.STRING,
                  },

                  application: {
                    type: Type.STRING,
                  },
                },

                required: [
                  'remedy',
                  'preparation',
                  'application',
                ],
              },
            },

            irrigationPrecaution: {
              type: Type.STRING,
            },

            weatherAdvice: {
              type: Type.STRING,
            },
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
    });

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

    return res.status(500).json({
      error: 'Failed to analyze crop image',
      details: error?.message || String(error),
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
      kn: 'Kannada (ಕನ್ನಡ)',
      ml: 'Malayalam (മലയാളം)',
      or: 'Odia (ଓଡ଼ିଆ)',
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

Help with:

- Crop diseases
- Pest management
- Fertilizers
- Irrigation
- Weather precautions
- Crop planning
- Organic farming
- Soil management
- Indian farming practices
- Government agricultural schemes
- Mandi and crop marketing

Always respond in ${currentLang}.

Give practical, clear and farmer-friendly answers.

For chemical recommendations, advise the farmer to verify the product label and local agricultural guidance before application.
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',

      contents,

      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

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

    const rainDeduction =
      Math.min(
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
      waterRequiredLitersPerDay: netWaterPerDay,
      irrigationFrequencyHours: frequencyHours,
      dripRunTimeHours: dripRunHours,
      floodIrrigationHours: floodHours,
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