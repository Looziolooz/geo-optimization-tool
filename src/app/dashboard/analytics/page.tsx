'use client';

import { useMemo } from 'react';
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
  Legend,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Globe } from 'lucide-react';

const providerData = [
  { provider: 'ChatGPT', mentions: 124, total: 180, rate: 68.9 },
  { provider: 'Gemini', mentions: 89, total: 165, rate: 53.9 },
  { provider: 'Perplexity', mentions: 73, total: 142, rate: 51.4 },
];

const sentimentData = [
  { name: 'Positive', value: 186, fill: '#10b981' },
  { name: 'Neutral', value: 72, fill: '#6366f1' },
  { name: 'Negative', value: 28, fill: '#ef4444' },
];

const topQueriesData = [
  { query: 'Best project management tools', mentions: 18 },
  { query: 'Top CRM software 2025', mentions: 15 },
  { query: 'Enterprise collaboration platforms', mentions: 12 },
  { query: 'AI-powered business tools', mentions: 10 },
  { query: 'Startup tech stack recommendations', mentions: 8 },
  { query: 'SaaS alternatives comparison', mentions: 7 },
  { query: 'Business automation software', mentions: 6 },
];

export default function AnalyticsPage() {
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-surface-800/95 backdrop-blur-sm border border-surface-700/50 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-surface-300 text-xs mb-1 font-medium">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-white text-sm">
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    // max-w-[1400px] -> max-w-350
    <div className="max-w-350 mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-surface-400 text-sm mt-1">
          Analisi dettagliata della visibilità AI del tuo brand
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Provider Comparison */}
        <div className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-semibold text-white">Confronto Provider</h3>
          </div>
          {/* h-[280px] -> h-70 */}
          <div className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="provider" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mentions" name="Menzioni" fill="#0c93e7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="total" name="Query Totali" fill="#1e293b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {providerData.map((p) => (
              <div key={p.provider} className="flex items-center justify-between text-sm">
                <span className="text-surface-400">{p.provider}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${p.rate}%` }}
                    />
                  </div>
                  <span className="text-white font-medium w-14 text-right">{p.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-semibold text-white">Distribuzione Sentiment</h3>
          </div>
          {/* h-[280px] -> h-70 */}
          <div className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} menzioni`, '']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend
                  formatter={(value: string) => (
                    <span className="text-surface-400 text-sm">{value}</span>
                  )}
                />
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

      {/* Top Queries */}
      <div className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-brand-400" />
          <h3 className="text-lg font-semibold text-white">Top Query per Menzioni</h3>
        </div>
        <div className="space-y-3">
          {topQueriesData.map((q, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-surface-600 text-sm font-mono w-6 text-right">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-surface-200 text-sm truncate">{q.query}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-surface-800 rounded-full overflow-hidden">
                  <div
                    // bg-gradient-to-r -> bg-linear-to-r
                    className="h-full bg-linear-to-r from-brand-600 to-brand-400 rounded-full transition-all"
                    style={{ width: `${(q.mentions / topQueriesData[0].mentions) * 100}%` }}
                  />
                </div>
                <span className="text-white font-semibold text-sm w-8 text-right">
                  {q.mentions}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}