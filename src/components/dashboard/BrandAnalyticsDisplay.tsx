'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { VisibilityDataPoint } from '@/lib/types';

interface BrandAnalyticsDisplayProps {
  data: VisibilityDataPoint[];
  brandName: string;
}

export default function BrandAnalyticsDisplay({ data, brandName }: BrandAnalyticsDisplayProps) {
  const trend = useMemo(() => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-3);
    const earlier = data.slice(-6, -3);
    const recentAvg = recent.reduce((s, d) => s + d.mentions, 0) / recent.length;
    const earlierAvg = earlier.length > 0
      ? earlier.reduce((s, d) => s + d.mentions, 0) / earlier.length
      : recentAvg;
    if (recentAvg > earlierAvg * 1.1) return 'up';
    if (recentAvg < earlierAvg * 0.9) return 'down';
    return 'stable';
  }, [data]);

  const totalMentions = data.reduce((s, d) => s + d.mentions, 0);
  const avgMentions = data.length > 0 ? Math.round(totalMentions / data.length) : 0;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string; name: string }>; label?: string }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-surface-800/95 backdrop-blur-sm border border-surface-700/50 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-surface-300 text-xs mb-2 font-medium">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-surface-400 capitalize">{entry.name}:</span>
            <span className="text-white font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Visibilità AI — {brandName}
          </h3>
          <p className="text-surface-400 text-sm mt-1">Andamento menzioni nel tempo</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{totalMentions}</p>
            <p className="text-surface-500 text-xs">menzioni totali</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{avgMentions}</p>
            <p className="text-surface-500 text-xs">media/giorno</p>
          </div>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
              trend === 'up'
                ? 'bg-emerald-500/10 text-emerald-400'
                : trend === 'down'
                ? 'bg-red-500/10 text-red-400'
                : 'bg-surface-500/10 text-surface-400'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {trend === 'stable' && <Minus className="w-4 h-4" />}
            {trend === 'up' ? 'In crescita' : trend === 'down' ? 'In calo' : 'Stabile'}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="gradPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradNeutral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px' }}
              formatter={(value: string) => <span className="text-surface-400 text-sm capitalize">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="positive"
              name="positive"
              stroke="#10b981"
              fill="url(#gradPositive)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="neutral"
              name="neutral"
              stroke="#6366f1"
              fill="url(#gradNeutral)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="negative"
              name="negative"
              stroke="#ef4444"
              fill="url(#gradNegative)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
