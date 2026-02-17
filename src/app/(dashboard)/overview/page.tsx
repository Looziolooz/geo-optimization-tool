'use client';

import { useBrandStore } from '@/lib/store/brand-store';
import { Eye, BarChart3, Search, Cpu, TrendingUp, Building2, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ScoreRing from '@/components/ui/ScoreRing';
import { cn, scoreColor, timeAgo, sentimentBg } from '@/lib/utils';
import { AI_PROVIDERS } from '@/lib/types';

export default function OverviewPage() {
  const { brands, activeBrand, queryHistory, getQueryHistory } = useBrandStore();

  if (brands.length === 0) {
    return (
      <div className="max-w-[600px] mx-auto text-center py-24 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-8 h-8 text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Welcome to GEO Tool</h1>
        <p className="text-surface-400 mb-8 leading-relaxed">
          Start by adding your first brand to monitor its AI visibility across ChatGPT, Gemini, and Perplexity.
          <br />Börja med att lägga till ditt första brand för att monitorera AI-synligheten.
        </p>
        <Link href="/brands" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-brand-500/15">
          <Plus className="w-5 h-5" /> Add Your First Brand
        </Link>
      </div>
    );
  }

  const brandQueries = activeBrand ? getQueryHistory(activeBrand.id) : [];
  const totalQueries = queryHistory.length;
  const avgScore = brands.length > 0 ? Math.round(brands.reduce((s, b) => s + b.visibilityScore, 0) / brands.length) : 0;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-surface-400 text-sm mt-1">
          {activeBrand ? `AI visibility for ${activeBrand.name}` : `${brands.length} brands being monitored`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Brands', value: brands.length, icon: Building2, color: 'brand' },
          { label: 'Avg Score', value: avgScore, icon: Eye, color: avgScore >= 60 ? 'emerald' : 'amber' },
          { label: 'Total Queries', value: totalQueries, icon: Search, color: 'purple' },
          { label: 'AI Providers', value: '3', icon: Cpu, color: 'amber' },
        ].map((s, i) => (
          <div key={i} className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-5">
            <div className={cn('p-2 rounded-xl w-fit mb-3', `bg-${s.color === 'brand' ? 'brand' : s.color}-500/10`)}>
              <s.icon className={cn('w-5 h-5', `text-${s.color === 'brand' ? 'brand' : s.color}-400`)} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-surface-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Brands grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">All Brands</h2>
          <Link href="/brands" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
            Manage <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} href="/queries"
              className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-5 hover:border-surface-700/50 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <ScoreRing score={brand.visibilityScore} size={48} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{brand.name}</h3>
                  <p className="text-surface-500 text-xs">{brand.market === 'se' ? '🇸🇪' : '🌍'} {brand.industry}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-surface-500">
                <span>{brand.competitors.length} competitors</span>
                <span>{brand.lastAnalysis ? timeAgo(brand.lastAnalysis) : 'Not analyzed'}</span>
              </div>
              <div className="mt-3 h-1 bg-surface-800 rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full transition-all', brand.visibilityScore >= 60 ? 'bg-emerald-500' : brand.visibilityScore >= 30 ? 'bg-amber-500' : 'bg-red-500')}
                  style={{ width: `${brand.visibilityScore}%` }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent queries */}
      {brandQueries.length > 0 && activeBrand && (
        <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Recent Queries — {activeBrand.name}</h2>
          <div className="space-y-2">
            {brandQueries.slice(0, 8).map((q) => (
              <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/30 transition-colors">
                <ScoreRing score={q.visibilityScore} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-surface-200 text-sm truncate">{q.query}</p>
                  <p className="text-surface-500 text-xs">{q.market === 'se' ? '🇸🇪' : '🌍'} • {q.providerResults.length} providers • {timeAgo(q.timestamp)}</p>
                </div>
                {q.competitorScores.length > 0 && (
                  <div className="flex items-center gap-1">
                    {q.competitorScores.slice(0, 2).map((c, i) => (
                      <span key={i} className={cn('text-xs px-1.5 py-0.5 rounded', scoreColor(c.score))}>
                        {c.name}: {c.score}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick action */}
      <div className="text-center">
        <Link href="/queries" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-brand-500/15">
          <Search className="w-5 h-5" /> Run AI Query
        </Link>
      </div>
    </div>
  );
}
