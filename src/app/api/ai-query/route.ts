import { NextRequest, NextResponse } from 'next/server';
import { getProviderManager } from '@/lib/api-providers/provider-manager';
import { querySchema, ApiResponse, AIProviderResponse } from '@/lib/types';
import { analyzeBrandMention, calculateVisibilityScore } from '@/lib/utils/brand-analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = querySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { query, brandName, providers } = parsed.data;
    const manager = getProviderManager();

    // Check available providers
    const available = manager.getAvailableProviders();
    if (available.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'No AI providers configured. Add API keys to your .env.local file.',
        },
        { status: 503 }
      );
    }

    // Build the prompt for brand visibility analysis
    const analysisPrompt = `${query}

Please provide a comprehensive, detailed answer. If relevant, mention specific brands, companies, products, or services by name.`;

    let responses: AIProviderResponse[];

    if (providers && providers.length > 0) {
      // Query specific providers in parallel
      responses = await manager.queryAllProviders(analysisPrompt, providers);
    } else {
      // Query all available providers in parallel
      responses = await manager.queryAllProviders(analysisPrompt);
    }

    // Analyze brand mentions in each response
    const analyses = responses.map((r) => ({
      ...r,
      brandAnalysis: analyzeBrandMention(r, brandName),
    }));

    const visibilityScore = calculateVisibilityScore(responses, brandName);

    const totalMentions = analyses.reduce(
      (sum, a) => sum + a.brandAnalysis.mentionCount,
      0
    );
    const mentioned = analyses.some((a) => a.brandAnalysis.mentioned);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        query,
        brandName,
        responses: analyses,
        visibilityScore,
        brandMentioned: mentioned,
        totalMentions,
        providersQueried: responses.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[AI Query API] Error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const manager = getProviderManager();
  const available = manager.getAvailableProviders();

  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      availableProviders: available.map((p) => p.name),
      totalProviders: available.length,
    },
  });
}
