
import { GoogleGenAI, Type } from "@google/genai";
import { PCRecommendation, Language, StockItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPCRecommendation = async (
  gameTitle: string, 
  budget: number, 
  language: Language,
  stockItems: StockItem[]
): Promise<PCRecommendation> => {
  const stockContext = stockItems.length > 0 
    ? `INVENTORY PRIORITY: The seller has the following parts in stock. Use them in the recommendation IF they are suitable for the ${budget} DZD budget and the game "${gameTitle}": ${stockItems.map(s => `[${s.category}: ${s.name}]`).join(', ')}.`
    : '';

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a PC hardware expert for the Algerian market. Recommend a complete PC build for "${gameTitle}" with a budget of ${budget} DZD. 
    
    Output Language: ${language === 'ar' ? 'Arabic (Modern Standard)' : language === 'fr' ? 'French' : 'English'}.
    All prices MUST be in DZD.
    
    ${stockContext}
    
    Ensure components are currently available in North Africa (Algeria). Ensure compatibility between motherboard, CPU, and RAM.`,
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
                category: { type: Type.STRING, description: "Component type (e.g., CPU, GPU, RAM)" },
                name: { type: Type.STRING, description: "Specific model name" },
                estimatedPrice: { type: Type.NUMBER, description: "Price in DZD" },
                reasoning: { type: Type.STRING, description: "Why this part is optimal for this build" }
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
    console.error("Failed to parse Gemini response", error);
    throw new Error("Invalid hardware recommendation generated.");
  }
};
