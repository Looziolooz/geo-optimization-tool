'use client';

import { cn } from '@/lib/utils/helpers';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'brand' | 'emerald' | 'amber' | 'red' | 'purple';
}

const colorMap = {
  brand: {
    iconBg: 'bg-brand-500/10',
    iconText: 'text-brand-400',
    shadow: 'shadow-brand-500/5',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-400',
    shadow: 'shadow-emerald-500/5',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-400',
    shadow: 'shadow-amber-500/5',
  },
  red: {
    iconBg: 'bg-red-500/10',
    iconText: 'text-red-400',
    shadow: 'shadow-red-500/5',
  },
  purple: {
    iconBg: 'bg-purple-500/10',
    iconText: 'text-purple-400',
    shadow: 'shadow-purple-500/5',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'brand',
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        'bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-5 hover:border-surface-700/50 transition-all duration-300',
        colors.shadow
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl', colors.iconBg)}>
          <Icon className={cn('w-5 h-5', colors.iconText)} />
        </div>
        {trend && trendValue && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              trend === 'up' && 'bg-emerald-500/10 text-emerald-400',
              trend === 'down' && 'bg-red-500/10 text-red-400',
              trend === 'stable' && 'bg-surface-500/10 text-surface-400'
            )}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-surface-500 text-sm mt-1">{title}</p>
      {subtitle && <p className="text-surface-600 text-xs mt-0.5">{subtitle}</p>}
    </div>
  );
}
