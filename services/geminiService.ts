
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { PCRecommendation, Language, StockItem } from "../types";

const STOCK_PRICING = `
You are the "Hardware Strategist". Your goal is to select PC parts for a specific game and budget.

MANDATORY INVENTORY & BASE COST (DA) - USE ONLY THESE EXACT PRICES (NUMBERS ONLY):
- CPUs: Ryzen 3 3200G: 6500, Intel i3 9100F: 8000, Intel Core i3-10100F: 11500, Ryzen 5 3400G: 13000, Ryzen 5 3600: 16000, Ryzen 5 5500: 17000, Intel i5 10th Gen: 18000, Intel Core i5-10400F: 17500, Intel Core i5-11400F: 20000, Ryzen 5 5600: 22000, Intel Core i5-12400F: 24000, Ryzen 7 3700X: 25000, Ryzen 5 7500F: 30000, Ryzen 7 5700X: 32000, Ryzen 7 5700: 35000, Intel Core i7-10700: 35000.
- GPUs: GTX 1050 2GB: 13000, GTX 1050 Ti 4GB: 17500, RX 580 4GB (Sapphire): 20000, RX 580 8GB: 23000, GTX 1650 4GB: 23000, GTX 1060 6GB: 26000, GTX 1660 Super 6GB: 36000, AMD RX 5600 XT 6GB: 40000, AMD RX 5700 XT 8GB: 44000, RTX 2060 6GB: 46000, RTX 3050 6GB: 47000, RTX 2060 Super 8GB: 48000, RTX 2070 Super 8GB: 57000, RTX 3060 12GB: 65000.
- PSU: PSU 450W: 4000, Antec 550w: 6000, Gamemax 600w: 6500.
- Core: 16GB DDR4: 14000, SSD 256GB: 6000, SSD 500GB: 12000.
- Motherboard: Basic: 11000, Mid: 18000. 
- Case: Gaming Case: 8000.

CALCULATION RULES:
1. Sum the Base Cost of all selected parts.
2. Final Selling Price = (Total Base Cost) * 1.22.
3. The "totalEstimatedCost" MUST be this Final Selling Price.
4. Ensure the Final Selling Price is within the user's budget.

STRICT CONTENT RULES:
- Output MUST be valid JSON.
- estimatedPrice and totalEstimatedCost MUST be pure numbers (no commas, no "DA").
- NEVER mention prices, margins, profit, or currency values in "reasoning", "summary", or "bottleneckAnalysis".
- FOCUS ONLY on technical synergy and performance.
- DO NOT use the term "AI".
- State clearly that GPUs are certified high-quality used parts in a technical context only.
`;

export const getPCRecommendation = async (
  gameTitle: string, 
  budget: number, 
  language: Language,
  stockItems: StockItem[]
): Promise<PCRecommendation> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Select parts for "${gameTitle}" with a ${budget} DA limit. Language: ${language}.`,
    config: {
      systemInstruction: STOCK_PRICING,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
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
    throw new Error("Strategic sync failed. Please try again.");
  }
};
