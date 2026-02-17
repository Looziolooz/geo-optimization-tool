import { AIProviderResponse, BrandMentionAnalysis, ContentRecommendation } from '@/lib/types';

// ─── Brand Mention Analysis ──────────────────────────────────
export function analyzeBrandMention(
  response: AIProviderResponse,
  brandName: string,
  allBrands: string[] = []
): BrandMentionAnalysis {
  const empty: BrandMentionAnalysis = {
    brandName,
    mentioned: false,
    mentionCount: 0,
    position: null,
    sentiment: 'neutral',
    sentimentScore: 0,
    excerpts: [],
    context: 'absent',
  };

  if (!response.content || response.error) return empty;

  const content = response.content;
  const contentLower = content.toLowerCase();
  const brandLower = brandName.toLowerCase();

  // Count mentions
  const regex = new RegExp(`\\b${escapeRegex(brandLower)}\\b`, 'gi');
  const matches = content.match(regex) || [];
  const mentionCount = matches.length;

  if (mentionCount === 0) return empty;

  // Find position relative to other brands
  const brandPositions = allBrands
    .map((b) => ({ name: b, index: contentLower.indexOf(b.toLowerCase()) }))
    .filter((b) => b.index >= 0)
    .sort((a, b) => a.index - b.index);

  const position = brandPositions.findIndex((b) => b.name.toLowerCase() === brandLower) + 1 || null;

  // Extract excerpts
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  const excerpts = sentences
    .filter((s) => s.toLowerCase().includes(brandLower))
    .map((s) => s.trim())
    .slice(0, 3);

  // Sentiment analysis
  const { sentiment, sentimentScore } = analyzeSentimentDetailed(content, brandName);

  // Context detection
  const context = detectContext(content, brandName);

  return { brandName, mentioned: true, mentionCount, position, sentiment, sentimentScore, excerpts, context };
}

function detectContext(content: string, brandName: string): BrandMentionAnalysis['context'] {
  const lower = content.toLowerCase();
  const brand = brandName.toLowerCase();
  const brandIdx = lower.indexOf(brand);
  if (brandIdx === -1) return 'absent';

  const window = lower.substring(Math.max(0, brandIdx - 100), Math.min(lower.length, brandIdx + brand.length + 100));

  const recommendWords = ['recommend', 'best', 'top pick', 'suggest', 'ideal', 'perfect for', 'rekommenderar', 'bäst'];
  const compareWords = ['compared', 'versus', 'alternative', 'competitor', 'unlike', 'similar to', 'jämfört', 'alternativ'];

  if (recommendWords.some((w) => window.includes(w))) return 'recommended';
  if (compareWords.some((w) => window.includes(w))) return 'compared';
  return 'mentioned';
}

function analyzeSentimentDetailed(content: string, brandName: string): { sentiment: 'positive' | 'neutral' | 'negative'; sentimentScore: number } {
  const lower = content.toLowerCase();
  const brand = brandName.toLowerCase();
  const brandIdx = lower.indexOf(brand);
  if (brandIdx === -1) return { sentiment: 'neutral', sentimentScore: 0 };

  const window = lower.substring(Math.max(0, brandIdx - 250), Math.min(lower.length, brandIdx + brand.length + 250));

  const positive = [
    'best', 'top', 'excellent', 'great', 'recommended', 'leading', 'trusted', 'popular',
    'innovative', 'reliable', 'outstanding', 'premier', 'superior', 'favorite', 'preferred',
    'award', 'renowned', 'impressive', 'highly rated', 'well-known', 'reputable',
    'bäst', 'utmärkt', 'pålitlig', 'populär', 'innovativ', 'ledande', 'betrodd',
  ];
  const negative = [
    'worst', 'bad', 'poor', 'avoid', 'issues', 'problems', 'complaint', 'disappointing',
    'unreliable', 'overpriced', 'mediocre', 'inferior', 'controversial', 'criticized',
    'dålig', 'undvik', 'problem', 'opålitlig', 'dyr', 'kritiserad',
  ];

  let score = 0;
  for (const w of positive) if (window.includes(w)) score += 1;
  for (const w of negative) if (window.includes(w)) score -= 1;

  const normalized = Math.max(-1, Math.min(1, score / 4));
  const sentiment = normalized > 0.2 ? 'positive' : normalized < -0.2 ? 'negative' : 'neutral';

  return { sentiment, sentimentScore: normalized };
}

// ─── Visibility Score ────────────────────────────────────────
export function calculateVisibilityScore(
  analyses: BrandMentionAnalysis[],
): number {
  if (analyses.length === 0) return 0;

  const validAnalyses = analyses.filter(Boolean);
  const mentionRate = validAnalyses.filter((a) => a.mentioned).length / validAnalyses.length;
  const avgMentions = validAnalyses.reduce((s, a) => s + a.mentionCount, 0) / validAnalyses.length;
  const avgSentiment = validAnalyses.reduce((s, a) => s + a.sentimentScore, 0) / validAnalyses.length;

  // Position bonus: being mentioned first = big bonus
  const positionBonus = validAnalyses.reduce((s, a) => {
    if (!a.position) return s;
    if (a.position === 1) return s + 15;
    if (a.position <= 3) return s + 8;
    return s + 3;
  }, 0) / validAnalyses.length;

  // Context bonus
  const contextBonus = validAnalyses.reduce((s, a) => {
    if (a.context === 'recommended') return s + 15;
    if (a.context === 'compared') return s + 5;
    if (a.context === 'mentioned') return s + 2;
    return s;
  }, 0) / validAnalyses.length;

  const score = Math.min(100, Math.round(
    mentionRate * 40 +
    Math.min(avgMentions / 3, 1) * 15 +
    (avgSentiment + 1) * 10 +
    positionBonus +
    contextBonus
  ));

  return Math.max(0, score);
}

// ─── Content Recommendations ─────────────────────────────────
export function generateRecommendations(
  brandName: string,
  analyses: BrandMentionAnalysis[],
  competitors: string[],
  market: 'se' | 'en'
): ContentRecommendation[] {
  const recs: ContentRecommendation[] = [];
  const mentionRate = analyses.filter((a) => a.mentioned).length / Math.max(analyses.length, 1);
  const avgSentiment = analyses.reduce((s, a) => s + a.sentimentScore, 0) / Math.max(analyses.length, 1);

  if (mentionRate < 0.3) {
    recs.push({
      type: 'content',
      priority: 'high',
      title: market === 'se' ? 'Öka synligheten i AI-svar' : 'Increase AI response visibility',
      description: market === 'se'
        ? `${brandName} nämns bara i ${Math.round(mentionRate * 100)}% av AI-svaren. Skapa mer auktoritativt innehåll.`
        : `${brandName} is only mentioned in ${Math.round(mentionRate * 100)}% of AI responses. Create more authoritative content.`,
      actionItems: market === 'se'
        ? ['Publicera jämförelseartiklar med konkurrenter', 'Skapa FAQ-sidor som AI kan citera', 'Bygg upp backlinks från branschsidor']
        : ['Publish comparison articles with competitors', 'Create FAQ pages AI models can reference', 'Build backlinks from industry authority sites'],
    });
  }

  if (avgSentiment < 0) {
    recs.push({
      type: 'pr',
      priority: 'high',
      title: market === 'se' ? 'Förbättra sentimentet' : 'Improve brand sentiment',
      description: market === 'se'
        ? `Negativ ton detekterad kring ${brandName}. Arbeta med rykteshantering.`
        : `Negative sentiment detected around ${brandName}. Focus on reputation management.`,
      actionItems: market === 'se'
        ? ['Svara på negativa omdömen professionellt', 'Publicera kundcase och framgångshistorier', 'Kontakta branschmedia för positiv press']
        : ['Address negative reviews professionally', 'Publish customer success stories and case studies', 'Reach out to industry media for positive coverage'],
    });
  }

  const absentProviders = analyses.filter((a) => !a.mentioned);
  if (absentProviders.length > 0) {
    recs.push({
      type: 'seo',
      priority: 'medium',
      title: market === 'se' ? 'Täck alla AI-plattformar' : 'Cover all AI platforms',
      description: market === 'se'
        ? `${brandName} saknas i ${absentProviders.length} AI-plattform(ar). Optimera strukturerad data.`
        : `${brandName} is missing from ${absentProviders.length} AI platform(s). Optimize structured data.`,
      actionItems: market === 'se'
        ? ['Implementera Schema.org markup', 'Optimera meta-beskrivningar för AI-läsbarhet', 'Säkerställ att Wikipedia/Wikidata har korrekt info']
        : ['Implement Schema.org markup on key pages', 'Optimize meta descriptions for AI readability', 'Ensure Wikipedia/Wikidata entries are accurate'],
    });
  }

  // Competitor gap analysis
  if (competitors.length > 0) {
    recs.push({
      type: 'content',
      priority: 'medium',
      title: market === 'se' ? 'Konkurrensanalys-gap' : 'Competitive gap analysis',
      description: market === 'se'
        ? `Analysera hur konkurrenter som ${competitors.slice(0, 2).join(', ')} positioneras i AI-svar.`
        : `Analyze how competitors like ${competitors.slice(0, 2).join(', ')} are positioned in AI responses.`,
      actionItems: market === 'se'
        ? ['Skapa "X vs Y" jämförelseinnehåll', 'Publicera "bästa alternativ"-guider', 'Positionera er i listicle-format']
        : ['Create "X vs Y" comparison content', 'Publish "best alternatives" guides', 'Position yourself in listicle-format content'],
    });
  }

  recs.push({
    type: 'local',
    priority: market === 'se' ? 'high' : 'low',
    title: market === 'se' ? 'Lokal SEO för AI-synlighet' : 'Local SEO for AI visibility',
    description: market === 'se'
      ? `Optimera för svenska AI-sökningar och lokala resultat.`
      : `Optimize for local AI search results and regional queries.`,
    actionItems: market === 'se'
      ? ['Optimera Google Business Profile', 'Skapa svenskspråkigt innehåll med lokala nyckelord', 'Registrera er på svenska branschkataloger']
      : ['Optimize Google Business Profile', 'Create localized content with regional keywords', 'Register on local business directories'],
  });

  return recs;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
