
export interface PCPart {
  category: string;
  name: string;
  estimatedPrice: number;
  reasoning: string;
}

export interface PerformanceMetric {
  resolution: string;
  settings: string;
  estimatedFps: number;
}

export interface PCRecommendation {
  parts: PCPart[];
  performance: PerformanceMetric[];
  summary: string;
  totalEstimatedCost: number;
  bottleneckAnalysis: string;
}

export interface Game {
  id: string;
  title: string;
  image: string;
  genre: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  ONBOARDING = 'ONBOARDING',
  SENDING_LEAD = 'SENDING_LEAD'
}

export type Language = 'en' | 'fr' | 'ar';

export interface UserContact {
  name: string;
  phone: string;
  willaya: string;
}

export interface StockItem {
  id: string;
  category: string;
  name: string;
}

export interface AdminSettings {
  webhookUrl: string;
  whatsappNumber: string;
}

export interface LeadPayload {
  customer: UserContact;
  game: string;
  budget: number;
  recommendation: PCRecommendation;
  timestamp: string;
}
