
import { GoogleGenAI, Type } from "@google/genai";
import { PCRecommendation, Language, StockItem } from "../types";

const SCREENSHOT_CATALOG = `
AVAILABLE BUILDS & PARTS (MANDATORY RESTRICTION):
You can ONLY use parts from these 3 specific configurations found in our physical catalog:

BUILD 1: AMD RYZEN APU BUILD (Price: 65,000 DA)
- CPU: AMD Ryzen 5 5600G (6 Cores)
- Motherboard: MB B550
- RAM: 16GB DDR4 3200MHz
- Storage: 256GB SATA SSD
- GPU: Integrated Radeon Graphics (APU)

BUILD 2: AMD RYZEN/RADEON BUILD (Price: 65,000 DA)
- CPU: AMD Ryzen 3 3200G (4 Cores)
- Motherboard: MB B450
- RAM: 16GB DDR4 3200MHz
- GPU: AMD Radeon RX 580 8GB
- Storage: 256GB SATA SSD

BUILD 3: INTEL/NVIDIA BUILD (Price: 64,000 DA)
- CPU: Intel Core i5-7th Gen (4 Cores)
- Motherboard: MB H110
- RAM: 16GB DDR4 3200MHz
- GPU: NVIDIA GTX 1650 4GB
- Storage: 256GB SATA SSD
`;

export const getPCRecommendation = async (
  gameTitle: string, 
  budget: number, 
  language: Language,
  stockItems: StockItem[]
): Promise<PCRecommendation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Custom stock from admin panel still takes priority if provided, 
  // otherwise we use the strict Screenshot Catalog.
  const stockContext = stockItems.length > 0 
    ? `INVENTORY: ${stockItems.map(s => `[${s.category}: ${s.name}]`).join(', ')}.`
    : SCREENSHOT_CATALOG;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a PC hardware expert. A customer wants a PC for "${gameTitle}" with a budget of ${budget} DZD.
    
    CRITICAL RULE: You MUST ONLY recommend components that exist in the following inventory:
    ${stockContext}
    
    Instructions:
    1. If the budget is around 65,000 DA, select the BUILD from the catalog that best runs "${gameTitle}".
    2. If the user's budget is lower than the catalog prices, recommend the most affordable parts from the catalog but warn them about the price.
    3. Output Language: ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
    4. All prices must be in DZD.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          parts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                name: { type: Type.STRING },
                estimatedPrice: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              },
              required: ["category", "name", "estimatedPrice", "reasoning"]
            }
          },
          performance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                resolution: { type: Type.STRING },
                settings: { type: Type.STRING },
                estimatedFps: { type: Type.NUMBER }
              },
              required: ["resolution", "settings", "estimatedFps"]
            }
          },
          summary: { type: Type.STRING },
          totalEstimatedCost: { type: Type.NUMBER },
          bottleneckAnalysis: { type: Type.STRING }
        },
        required: ["parts", "performance", "summary", "totalEstimatedCost", "bottleneckAnalysis"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as PCRecommendation;
  } catch (error) {
    throw new Error("Failed to parse hardware recommendation.");
  }
};
