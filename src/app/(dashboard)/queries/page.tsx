'use client';

import { useState, FormEvent } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Zap, Globe, TrendingUp, Users } from 'lucide-react';
import { useAIQuery } from '@/hooks/useAIQuery';
import { useBrandStore } from '@/lib/store/brand-store';
import { AIProviderName, AI_PROVIDERS, INDUSTRIES, QueryResult, ProviderQueryResult } from '@/lib/types';
import { cn, sentimentBg, scoreColor } from '@/lib/utils';
import ScoreRing from '@/components/ui/ScoreRing';
import Link from 'next/link';

export default function QueriesPage() {
  const { brands, activeBrand, addQueryResult, setActiveBrand } = useBrandStore();
  const [query, setQuery] = useState('');
  const [market, setMarket] = useState<'se' | 'en'>('en');
  const [selectedProviders, setSelectedProviders] = useState<AIProviderName[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const { result, isLoading, error, executeQuery } = useAIQuery();

  // Auto-suggest queries based on brand industry
  const industry = INDUSTRIES.find((i) => i.value === activeBrand?.industry);
  const suggestedQueries = market === 'se' ? industry?.queries_se : industry?.queries_en;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !activeBrand || isLoading) return;

    const res = await executeQuery(query.trim(), {
      brandId: activeBrand.id,
      brandName: activeBrand.name,
      competitors: activeBrand.competitors,
      market,
    }, selectedProviders.length > 0 ? selectedProviders : undefined);

    if (res) addQueryResult(res);
  };

  const useSuggestion = (q: string) => {
    const brandQ = activeBrand
      ? q.replace(/best|bästa/i, (m) => m) + ` ${activeBrand.industry}`
      : q;
    setQuery(brandQ);
  };

  if (brands.length === 0) {
    return (
      <div className="max-w-125 mx-auto text-center py-24 animate-fade-in">
        <Search className="w-12 h-12 text-surface-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Add a brand first</h2>
        <p className="text-surface-400 text-sm mb-6">You need at least one brand to run AI queries.</p>
        <Link href="/brands" className="px-5 py-2 bg-brand-600 text-white text-sm rounded-xl">Go to Brands</Link>
      </div>
    );
  }

  return (
    <div className="max-w-250 mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Query Analysis</h1>
        <p className="text-surface-400 text-sm mt-1">Test your brand's visibility across AI search engines</p>
      </div>

      {/* Query Form */}
      <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand + Market selector */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-surface-400 text-xs font-medium mb-1 block">Brand</label>
              <select value={activeBrand?.id || ''} onChange={(e) => setActiveBrand(e.target.value)}
                className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50">
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} ({b.competitors.length} competitors)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-surface-400 text-xs font-medium mb-1 block">Market</label>
              <div className="flex gap-2">
                {[
                  { value: 'en' as const, label: '🌍 International', flag: 'EN' },
                  { value: 'se' as const, label: '🇸🇪 Sverige', flag: 'SE' },
                ].map((m) => (
                  <button key={m.value} type="button" onClick={() => setMarket(m.value)}
                    className={cn('flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all',
                      market === m.value ? 'bg-brand-500/15 border-brand-500/30 text-brand-300' : 'bg-surface-800/30 border-surface-700/30 text-surface-400 hover:text-white')}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Query input */}
          <div>
            <label className="text-surface-400 text-xs font-medium mb-1 block">Query</label>
            <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={2}
              placeholder={market === 'se' ? 'e.g. "Vilka è de bästa verktygen för..."' : 'e.g. "What are the best tools for..."'}
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 resize-none" />
            {suggestedQueries && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-surface-500 text-xs">Suggestions:</span>
                {suggestedQueries.map((q, i) => (
                  <button key={i} type="button" onClick={() => useSuggestion(q)}
                    className="text-xs px-2 py-1 bg-surface-800/50 text-surface-400 hover:text-brand-400 rounded-lg border border-surface-700/30 hover:border-brand-500/30 transition-all">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Providers */}
          <div>
            <label className="text-surface-400 text-xs font-medium mb-1.5 block">AI Providers (empty = all)</label>
            <div className="flex gap-2">
              {(Object.keys(AI_PROVIDERS) as AIProviderName[]).map((name) => (
                <button key={name} type="button"
                  onClick={() => setSelectedProviders((p) => p.includes(name) ? p.filter((x) => x !== name) : [...p, name])}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    selectedProviders.includes(name) ? 'bg-brand-500/15 border-brand-500/30 text-brand-300' : 'bg-surface-800/30 border-surface-700/30 text-surface-400 hover:text-white')}>
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: AI_PROVIDERS[name].color }} />
                  {AI_PROVIDERS[name].label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isLoading || !query.trim() || !activeBrand}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-surface-700 disabled:text-surface-500 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/15 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Analyze Visibility</>}
          </button>
        </form>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />{error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Summary */}
          <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-6">
              <ScoreRing score={result.visibilityScore} size={80} label="Your Score" />
              {result.competitorScores.map((c) => (
                <ScoreRing key={c.name} score={c.score} size={64} label={c.name} />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm">
              <span className="text-surface-400"><Globe className="w-4 h-4 inline mr-1" />{result.market === 'se' ? '🇸🇪 Swedish' : '🌍 International'}</span>
              <span className="text-surface-400"><CpuIcon className="w-4 h-4 inline mr-1" />{result.providerResults.length} providers</span>
              <span className={cn(scoreColor(result.visibilityScore), 'font-semibold')}>
                {result.visibilityScore >= 60 ? '✓ Good visibility' : result.visibilityScore >= 30 ? '⚠ Needs improvement' : '✗ Low visibility'}
              </span>
            </div>
          </div>

          {/* Per-provider results */}
          <div className="space-y-3">
            {result.providerResults.map((pr: ProviderQueryResult, i: number) => (
              <div key={i} className="bg-surface-900/50 border border-surface-800/50 rounded-2xl overflow-hidden">
                <button onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-800/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AI_PROVIDERS[pr.provider]?.color }} />
                    {pr.brandAnalysis.mentioned ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-surface-500" />}
                    <span className="text-white font-medium">{AI_PROVIDERS[pr.provider]?.label}</span>
                    <span className="text-surface-500 text-xs">{pr.responseTimeMs}ms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {pr.brandAnalysis.mentioned && (
                      <span className="text-emerald-400 text-xs font-medium">
                        {pr.brandAnalysis.mentionCount}x • pos #{pr.brandAnalysis.position || '–'}
                      </span>
                    )}
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border', sentimentBg(pr.brandAnalysis.sentiment))}>
                      {pr.brandAnalysis.sentiment}
                    </span>
                    {/* Competitor comparison inline */}
                    {pr.competitorAnalyses.filter((c) => c.mentioned).map((c) => (
                      <span key={c.brandName} className="text-surface-400 text-xs">
                        {c.brandName}: {c.mentionCount}x
                      </span>
                    ))}
                    {expandedIdx === i ? <ChevronUp className="w-4 h-4 text-surface-400" /> : <ChevronDown className="w-4 h-4 text-surface-400" />}
                  </div>
                </button>
                {expandedIdx === i && (
                  <div className="px-5 pb-5 border-t border-surface-800/30 pt-4 animate-fade-in space-y-3">
                    {pr.error ? (
                      <p className="text-red-400 text-sm">{pr.error}</p>
                    ) : (
                      <p className="text-surface-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-12">{pr.content}</p>
                    )}
                    {pr.brandAnalysis.excerpts.length > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-emerald-400 text-xs font-medium mb-1">Brand mentions:</p>
                        {pr.brandAnalysis.excerpts.map((e, j) => (
                          <p key={j} className="text-surface-300 text-sm italic">&ldquo;{e}&rdquo;</p>
                        ))}
                      </div>
                    )}
                    {pr.competitorAnalyses.length > 0 && (
                      <div className="p-3 rounded-xl bg-surface-800/30 border border-surface-700/30">
                        <p className="text-surface-400 text-xs font-medium mb-2 flex items-center gap-1"><Users className="w-3 h-3" /> Competitor mentions:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {pr.competitorAnalyses.map((ca) => (
                            <div key={ca.brandName} className="flex items-center justify-between text-xs">
                              <span className="text-surface-300">{ca.brandName}</span>
                              <span className={cn(ca.mentioned ? 'text-amber-400' : 'text-surface-600')}>
                                {ca.mentioned ? `${ca.mentionCount}x (${ca.sentiment})` : 'absent'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CpuIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/></svg>;
}