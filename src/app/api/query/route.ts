import { NextRequest, NextResponse } from 'next/server';
import { getProviderManager } from '@/lib/providers/provider-manager';
import { querySchema, ApiResponse, AIProviderResponse, BrandMentionAnalysis, ProviderQueryResult } from '@/lib/types';
import { analyzeBrandMention, calculateVisibilityScore } from '@/lib/analysis/brand-analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = querySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { query, brandId, market, providers, includeCompetitors } = parsed.data;
    const brandName = body.brandName as string;
    const competitors = (body.competitors as string[]) || [];

    const manager = getProviderManager();
    const available = manager.getAvailable();
    if (!available.length) {
      return NextResponse.json<ApiResponse>({ success: false, error: 'No AI providers configured' }, { status: 503 });
    }

    // Build prompt based on market
    const marketContext = market === 'se'
      ? 'Svara på svenska. Fokusera på den svenska marknaden.'
      : 'Answer in English. Focus on the international market.';

    const prompt = `${query}\n\n${marketContext}\n\nProvide a comprehensive answer. Mention specific brands, companies, and products by name when relevant. Be factual and include comparisons if applicable.`;

    const responses: AIProviderResponse[] = await manager.queryAll(prompt, providers);

    // Analyze brand + competitors for each provider
    const allBrands = [brandName, ...competitors];

    const providerResults: ProviderQueryResult[] = responses.map((r) => {
      const brandAnalysis = analyzeBrandMention(r, brandName, allBrands);
      const competitorAnalyses: BrandMentionAnalysis[] = includeCompetitors
        ? competitors.map((c) => analyzeBrandMention(r, c, allBrands))
        : [];

      return {
        provider: r.provider,
        content: r.content,
        responseTimeMs: r.responseTimeMs,
        tokensUsed: r.tokensUsed,
        error: r.error,
        brandAnalysis,
        competitorAnalyses,
      };
    });

    const brandAnalyses = providerResults.map((r) => r.brandAnalysis);
    const visibilityScore = calculateVisibilityScore(brandAnalyses);

    // Competitor scores
    const competitorScores = competitors.map((comp) => {
      const compAnalyses = providerResults.map((r) =>
        r.competitorAnalyses.find((ca) => ca.brandName === comp)
      ).filter(Boolean) as BrandMentionAnalysis[];
      return { name: comp, score: calculateVisibilityScore(compAnalyses) };
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        query,
        brandId,
        brandName,
        market,
        providerResults,
        visibilityScore,
        competitorScores,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Query API]', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const manager = getProviderManager();
  return NextResponse.json<ApiResponse>({
    success: true,
    data: { providers: manager.getAvailable().map((p) => ({ name: p.name, label: p.displayName })) },
  });
}
