
import { GoogleGenAI, Type } from "@google/genai";
import { PCRecommendation, Language, StockItem } from "../types";

const ALGERIAN_MARKET_RULES = `
MARKET CONTEXT (ALGERIA):
- Mid-range builds (RTX 4060) usually cost between 130,000 DA and 180,000 DA.
- High-end builds (RTX 4070/4080) cost 200,000 DA to 350,000 DA.
- Ultra builds (RTX 4090) exceed 450,000 DA.
- Recommended brands: ASUS, MSI, Gigabyte, Corsair, Kingston (widely available).
- For lower budgets (65k), prioritize AMD APUs or Used GPU builds (RX 580).
`;

export const getPCRecommendation = async (
  gameTitle: string, 
  budget: number, 
  language: Language,
  stockItems: StockItem[]
): Promise<PCRecommendation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a PC Hardware Consultant for "Pc-Club Parts". 
    A client wants a machine optimized for "${gameTitle}" with a strict budget of ${budget} DZD.
    
    GUIDELINES:
    1. Provide a realistic part list available in the Algerian market.
    2. Budget is ${budget} DA. Do not exceed this by more than 5%.
    3. For competitive games (Valorant, CS2), prioritize CPU and High-Refresh capability.
    4. For AAA games (Cyberpunk, Elden Ring), prioritize GPU and VRAM.
    5. Output Language: ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
    
    ${ALGERIAN_MARKET_RULES}`,
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
    throw new Error("Hardware calculation engine failed.");
  }
};
