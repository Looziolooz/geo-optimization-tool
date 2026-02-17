import { z } from 'zod';

// ─── AI Provider Types ───────────────────────────────────────
export type AIProviderName = 'google-gemini' | 'openrouter-chatgpt' | 'openrouter-perplexity';

export const AI_PROVIDERS: Record<AIProviderName, { label: string; color: string; description: string }> = {
  'google-gemini': { label: 'Google Gemini', color: '#4285F4', description: 'Google AI (simula Google AI Overviews)' },
  'openrouter-chatgpt': { label: 'ChatGPT', color: '#10a37f', description: 'Llama 3.3 70B (simula ChatGPT)' },
  'openrouter-perplexity': { label: 'Perplexity', color: '#7c3aed', description: 'DeepSeek V3 (simula Perplexity)' },
};

export interface AIProviderResponse {
  provider: AIProviderName;
  content: string;
  citations?: string[];
  responseTimeMs: number;
  tokensUsed?: number;
  error?: string;
}

// ─── Brand Types ─────────────────────────────────────────────
export const brandSchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().optional(),
  industry: z.string().min(1),
  market: z.enum(['se', 'en', 'both']),
  competitors: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  description: z.string().max(500).optional(),
});

export type BrandInput = z.infer<typeof brandSchema>;

export interface Brand extends BrandInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastAnalysis?: string;
  visibilityScore: number;
}

// ─── Query Types ─────────────────────────────────────────────
export const querySchema = z.object({
  query: z.string().min(1).max(500),
  brandId: z.string().min(1),
  market: z.enum(['se', 'en']).default('en'),
  providers: z.array(z.enum(['google-gemini', 'openrouter-chatgpt', 'openrouter-perplexity'])).optional(),
  includeCompetitors: z.boolean().default(true),
});

export type QueryInput = z.infer<typeof querySchema>;

export interface BrandMentionAnalysis {
  brandName: string;
  mentioned: boolean;
  mentionCount: number;
  position: number | null; // 1 = mentioned first, 2 = second, etc.
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  excerpts: string[];
  context: 'recommended' | 'compared' | 'mentioned' | 'absent';
}

export interface ProviderQueryResult {
  provider: AIProviderName;
  content: string;
  responseTimeMs: number;
  tokensUsed?: number;
  error?: string;
  brandAnalysis: BrandMentionAnalysis;
  competitorAnalyses: BrandMentionAnalysis[];
}

export interface QueryResult {
  id: string;
  query: string;
  brandId: string;
  brandName: string;
  market: 'se' | 'en';
  providerResults: ProviderQueryResult[];
  visibilityScore: number;
  competitorScores: { name: string; score: number }[];
  timestamp: string;
}

// ─── Analytics Types ─────────────────────────────────────────
export interface VisibilityDataPoint {
  date: string;
  score: number;
  mentions: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface CompetitorComparison {
  name: string;
  visibilityScore: number;
  mentionRate: number;
  avgSentiment: number;
  shareOfVoice: number;
}

export interface BrandDashboard {
  brand: Brand;
  currentScore: number;
  scoreDelta: number; // change vs previous period
  totalQueries: number;
  totalMentions: number;
  mentionRate: number;
  avgSentiment: number;
  trend: VisibilityDataPoint[];
  competitorComparison: CompetitorComparison[];
  providerBreakdown: { provider: AIProviderName; score: number; mentions: number; total: number }[];
  topQueries: { query: string; score: number; mentioned: boolean }[];
  recentAlerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'mention_drop' | 'sentiment_change' | 'competitor_surge' | 'new_mention' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  brandId: string;
  timestamp: string;
  read: boolean;
}

// ─── Industry Presets ────────────────────────────────────────
export const INDUSTRIES = [
  { value: 'healthcare', label: 'Healthcare / Sjukvård', queries_en: ['best clinics', 'top healthcare providers', 'medical services review'], queries_se: ['bästa kliniker', 'bästa vårdgivare', 'sjukvård recension'] },
  { value: 'saas', label: 'SaaS / Software', queries_en: ['best software tools', 'top SaaS platforms', 'software comparison'], queries_se: ['bästa programvaror', 'bästa SaaS-plattformar', 'programvarujämförelse'] },
  { value: 'ecommerce', label: 'E-commerce', queries_en: ['best online stores', 'top e-commerce platforms', 'online shopping review'], queries_se: ['bästa nätbutiker', 'bästa e-handelsplattformar', 'näthandel recension'] },
  { value: 'finance', label: 'Finance / Finans', queries_en: ['best financial services', 'top banks', 'investment platforms review'], queries_se: ['bästa finanstjänster', 'bästa banker', 'investeringsplattformar recension'] },
  { value: 'marketing', label: 'Marketing / Agency', queries_en: ['best marketing agencies', 'top digital agencies', 'marketing services review'], queries_se: ['bästa marknadsföringsbyråer', 'bästa digitalbyråer', 'marknadsföringstjänster recension'] },
  { value: 'hospitality', label: 'Hospitality / Tourism', queries_en: ['best hotels', 'top restaurants', 'travel services review'], queries_se: ['bästa hotell', 'bästa restauranger', 'resetjänster recension'] },
  { value: 'education', label: 'Education / Utbildning', queries_en: ['best online courses', 'top education platforms', 'learning review'], queries_se: ['bästa onlinekurser', 'bästa utbildningsplattformar', 'utbildning recension'] },
  { value: 'entertainment', label: 'Entertainment / Casting', queries_en: ['best casting platforms', 'talent agencies', 'entertainment industry tools'], queries_se: ['bästa castingplattformar', 'talangbyråer', 'underhållningsbranschens verktyg'] },
  { value: 'realestate', label: 'Real Estate / Fastigheter', queries_en: ['best real estate platforms', 'property services review'], queries_se: ['bästa fastighetsplattformar', 'fastighetstjänster recension'] },
  { value: 'other', label: 'Other / Annat', queries_en: ['best providers', 'top companies', 'services review'], queries_se: ['bästa leverantörer', 'bästa företag', 'tjänster recension'] },
] as const;

export type IndustryValue = typeof INDUSTRIES[number]['value'];

// ─── Recommendation Types ────────────────────────────────────
export interface ContentRecommendation {
  type: 'content' | 'seo' | 'pr' | 'local';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
}

// ─── API Response ────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
