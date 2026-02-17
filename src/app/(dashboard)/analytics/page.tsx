'use client';

import { useMemo } from 'react';
import { useBrandStore } from '@/lib/store/brand-store';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Search } from 'lucide-react';
import { AI_PROVIDERS, ProviderQueryResult } from '@/lib/types';
import ScoreRing from '@/components/ui/ScoreRing';
import Link from 'next/link';
import { cn, scoreColor } from '@/lib/utils';

export default function AnalyticsPage() {
  const { activeBrand, getQueryHistory } = useBrandStore();
  const history = activeBrand ? getQueryHistory(activeBrand.id) : [];

  const providerData = useMemo(() => {
    const map: Record<string, { mentions: number; total: number }> = {};
    for (const q of history) {
      for (const pr of q.providerResults) {
        const label = AI_PROVIDERS[pr.provider]?.label || pr.provider;
        if (!map[label]) map[label] = { mentions: 0, total: 0 };
        map[label].total++;
        if (pr.brandAnalysis.mentioned) map[label].mentions++;
      }
    }
    return Object.entries(map).map(([provider, d]) => ({ 
      provider, 
      ...d, 
      rate: d.total > 0 ? Math.round((d.mentions / d.total) * 100) : 0 
    }));
  }, [history]);

  const sentimentData = useMemo(() => {
    let pos = 0, neu = 0, neg = 0;
    for (const q of history) {
      for (const pr of q.providerResults) {
        if (pr.brandAnalysis.sentiment === 'positive') pos++;
        else if (pr.brandAnalysis.sentiment === 'negative') neg++;
        else neu++;
      }
    }
    return [
      { name: 'Positive', value: pos, fill: '#10b981' },
      { name: 'Neutral', value: neu, fill: '#6366f1' },
      { name: 'Negative', value: neg, fill: '#ef4444' },
    ];
  }, [history]);

  const competitorData = useMemo(() => {
    if (!activeBrand) return [];
    const scores: Record<string, number[]> = { [activeBrand.name]: [] };
    activeBrand.competitors.forEach((c) => (scores[c] = []));

    for (const q of history) {
      scores[activeBrand.name].push(q.visibilityScore);
      for (const cs of q.competitorScores) {
        if (scores[cs.name]) scores[cs.name].push(cs.score);
      }
    }

    return Object.entries(scores).map(([name, s]) => ({
      name,
      avgScore: s.length > 0 ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0,
      queries: s.length,
      isBrand: name === activeBrand.name,
    })).sort((a, b) => b.avgScore - a.avgScore);
  }, [history, activeBrand]);

  if (!activeBrand) {
    return (
      <div className="max-w-125 mx-auto text-center py-24 animate-fade-in">
        <BarChart3 className="w-12 h-12 text-surface-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Select a brand</h2>
        <p className="text-surface-400 text-sm">Use the sidebar to select a brand, then run queries to see analytics.</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-125 mx-auto text-center py-24 animate-fade-in">
        <Search className="w-12 h-12 text-surface-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No data yet for {activeBrand.name}</h2>
        <p className="text-surface-400 text-sm mb-6">Run some AI queries first to see analytics.</p>
        <Link href="/queries" className="px-5 py-2 bg-brand-600 text-white text-sm rounded-xl">Go to Queries</Link>
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics — {activeBrand.name}</h1>
        <p className="text-surface-400 text-sm mt-1">{history.length} queries analyzed</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Provider performance */}
        <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            <h3 className="text-white font-semibold">Provider Performance</h3>
          </div>
          {providerData.length > 0 ? (
            <>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={providerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="provider" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
                    <Bar dataKey="mentions" name="Mentions" fill="#0c93e7" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="total" name="Total Queries" fill="#1e293b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {providerData.map((p) => (
                  <div key={p.provider} className="flex items-center justify-between text-sm">
                    <span className="text-surface-400">{p.provider}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${p.rate}%` }} />
                      </div>
                      <span className="text-white font-medium w-10 text-right">{p.rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-surface-500 text-sm">No data</p>}
        </div>

        {/* Sentiment */}
        <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <PieIcon className="w-5 h-5 text-brand-400" />
            <h3 className="text-white font-semibold">Sentiment Distribution</h3>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                  {sentimentData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
                <Legend formatter={(v: string) => <span className="text-surface-400 text-sm">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4 text-center">
            {sentimentData.map((s) => (
              <div key={s.name}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-surface-500 text-xs">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Benchmark */}
      {competitorData.length > 1 && (
        <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            <h3 className="text-white font-semibold">Competitive Benchmark — Share of Voice</h3>
          </div>
          <div className="space-y-3">
            {competitorData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4">
                <span className="text-surface-600 text-sm font-mono w-6 text-right">#{i + 1}</span>
                <ScoreRing score={c.avgScore} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm font-medium', c.isBrand ? 'text-brand-400' : 'text-surface-200')}>{c.name}</p>
                    {c.isBrand && <span className="text-[10px] px-1.5 py-0.5 bg-brand-500/15 text-brand-400 rounded-full border border-brand-500/20">YOUR BRAND</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-surface-800 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', c.isBrand ? 'bg-brand-500' : 'bg-surface-500')}
                      style={{ width: `${c.avgScore}%` }} />
                  </div>
                  <span className={cn('text-sm font-semibold w-10 text-right', scoreColor(c.avgScore))}>{c.avgScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}