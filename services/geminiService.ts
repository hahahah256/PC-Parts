
import { GoogleGenAI, Type } from "@google/genai";
import { PCRecommendation, Language, StockItem } from "../types";

const STOCK_PRICING = `
MANDATORY INVENTORY & BASE COST (DA) - USE ONLY THESE EXACT PRICES:
- GPUs: 
  * Gtx 1050 2gb = 13,000
  * Rx 580 4gb Sapphire = 20,000
  * Gtx 1650 4gb = 23,000
  * Rx 580 8gb = 24,000
  * Gtx 1060 6gb = 26,000
  * Amd Rx 5600 Xt 6gb = 40,000
  * Rtx 3050 6gb = 47,000
  * RTX 2060 super 8GB = 48,000
  * Rtx 3060 12 gb = 65,000
- CPUs:
  * Ryzen 3 3200g = 6,500
  * i3 9100f = 8,000
  * Ryzen 5 5500 = 17,000
  * Ryzen 5 7500f = 30,000
  * Ryzen 7 5700 = 35,000
- Power Supplies (PSU):
  * Alimentation Antec Meta 550w = 6,000
  * Psu Gamemax 600w Reel = 6,500
- Core Components:
  * 16 GB RAM DDR4 = 14,000
  * SSD 256 GB = 6,000
- Other Parts (Estimates for completeness):
  * Basic Motherboard (H310/A320/A520) = 11,000
  * Mid Motherboard (B450/B550/B760) = 18,000
  * Gaming Case = 8,000

PRICING CALCULATION LOGIC:
1. Sum the BASE COSTS of all selected parts above.
2. ADD 23% PROFIT: Final Selling Price = Total Base Cost * 1.23.
3. The "totalEstimatedCost" returned in the JSON must be this FINAL SELLING PRICE.
4. "estimatedPrice" for each part should be the individual BASE COST (for internal record only).
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
    contents: `Act as a Hardware Strategist for "Pc-Club Parts". 
    Create a PC build for the game "${gameTitle}" with a client budget of ${budget} DA.
    
    STRICT RULES:
    1. Use ONLY the parts and BASE PRICES from STOCK_PRICING.
    2. Ensure the build is logical (e.g., don't put a 3060 with an i3 9100f if it causes massive bottlenecking).
    3. The total price the customer sees MUST include a 23% markup (Total Base Cost * 1.23).
    4. Language for fields "reasoning", "summary", "bottleneckAnalysis": ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
    
    ${STOCK_PRICING}`,
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
    throw new Error("Hardware configuration engine failed. Please try again.");
  }
};
