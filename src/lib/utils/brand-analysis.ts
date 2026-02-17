import { AIProviderResponse } from '@/lib/types';

interface BrandMentionAnalysis {
  mentioned: boolean;
  mentionCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  excerpts: string[];
}

/**
 * Analyze an AI response to detect brand mentions, sentiment,
 * and extract relevant excerpts.
 */
export function analyzeBrandMention(
  response: AIProviderResponse,
  brandName: string
): BrandMentionAnalysis {
  if (!response.content || response.error) {
    return { mentioned: false, mentionCount: 0, sentiment: 'neutral', excerpts: [] };
  }

  const content = response.content.toLowerCase();
  const brand = brandName.toLowerCase();

  // Count mentions (case-insensitive, word boundary)
  const regex = new RegExp(`\\b${escapeRegex(brand)}\\b`, 'gi');
  const matches = response.content.match(regex) || [];
  const mentionCount = matches.length;
  const mentioned = mentionCount > 0;

  // Extract excerpts around mentions
  const excerpts: string[] = [];
  if (mentioned) {
    const sentences = response.content.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(brand)) {
        excerpts.push(sentence.trim());
      }
    }
  }

  // Simple sentiment analysis based on surrounding words
  const sentiment = mentioned ? analyzeSentiment(content, brand) : 'neutral';

  return { mentioned, mentionCount, sentiment, excerpts: excerpts.slice(0, 3) };
}

function analyzeSentiment(content: string, brand: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = [
    'best', 'top', 'excellent', 'great', 'recommended', 'leading', 'trusted',
    'popular', 'innovative', 'reliable', 'outstanding', 'premier', 'superior',
    'favorite', 'preferred', 'award', 'renowned', 'impressive',
  ];
  const negativeWords = [
    'worst', 'bad', 'poor', 'avoid', 'issues', 'problems', 'complaint',
    'disappointing', 'unreliable', 'overpriced', 'mediocre', 'inferior',
    'controversial', 'criticized', 'scandal',
  ];

  // Check words near brand mentions
  const brandIndex = content.indexOf(brand);
  if (brandIndex === -1) return 'neutral';

  const contextWindow = content.substring(
    Math.max(0, brandIndex - 200),
    Math.min(content.length, brandIndex + brand.length + 200)
  );

  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of positiveWords) {
    if (contextWindow.includes(word)) positiveScore++;
  }
  for (const word of negativeWords) {
    if (contextWindow.includes(word)) negativeScore++;
  }

  if (positiveScore > negativeScore + 1) return 'positive';
  if (negativeScore > positiveScore + 1) return 'negative';
  return 'neutral';
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate overall visibility score (0-100) based on multiple provider responses
 */
export function calculateVisibilityScore(
  responses: AIProviderResponse[],
  brandName: string
): number {
  if (responses.length === 0) return 0;

  const analyses = responses
    .filter((r) => !r.error)
    .map((r) => analyzeBrandMention(r, brandName));

  if (analyses.length === 0) return 0;

  const mentionRate = analyses.filter((a) => a.mentioned).length / analyses.length;
  const avgMentions = analyses.reduce((sum, a) => sum + a.mentionCount, 0) / analyses.length;
  const sentimentScore =
    analyses.reduce((sum, a) => {
      if (a.sentiment === 'positive') return sum + 1;
      if (a.sentiment === 'negative') return sum - 0.5;
      return sum;
    }, 0) / analyses.length;

  // Weighted score: 50% mention rate, 30% mention density, 20% sentiment
  const score = Math.min(
    100,
    mentionRate * 50 + Math.min(avgMentions / 3, 1) * 30 + (sentimentScore + 1) * 10
  );

  return Math.round(score);
}
