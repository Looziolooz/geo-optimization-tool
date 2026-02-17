'use client';

import { useState } from 'react';
import { Eye, BarChart3, Search, Cpu, TrendingUp, Activity } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import BrandAnalyticsDisplay from '@/components/dashboard/BrandAnalyticsDisplay';
import QueryInputWidget from '@/components/dashboard/QueryInputWidget';
import RecentQueries from '@/components/dashboard/RecentQueries';
import { VisibilityDataPoint } from '@/lib/types';

// Demo data for the chart
const demoVisibilityData: VisibilityDataPoint[] = [
  { date: '1 Feb', mentions: 12, positive: 8, neutral: 3, negative: 1, avgPosition: 3.2 },
  { date: '2 Feb', mentions: 15, positive: 10, neutral: 4, negative: 1, avgPosition: 2.8 },
  { date: '3 Feb', mentions: 9, positive: 5, neutral: 3, negative: 1, avgPosition: 4.1 },
  { date: '4 Feb', mentions: 18, positive: 12, neutral: 5, negative: 1, avgPosition: 2.1 },
  { date: '5 Feb', mentions: 22, positive: 14, neutral: 6, negative: 2, avgPosition: 1.9 },
  { date: '6 Feb', mentions: 16, positive: 9, neutral: 5, negative: 2, avgPosition: 3.0 },
  { date: '7 Feb', mentions: 25, positive: 17, neutral: 6, negative: 2, avgPosition: 1.5 },
  { date: '8 Feb', mentions: 20, positive: 13, neutral: 5, negative: 2, avgPosition: 2.3 },
  { date: '9 Feb', mentions: 28, positive: 19, neutral: 7, negative: 2, avgPosition: 1.3 },
  { date: '10 Feb', mentions: 24, positive: 16, neutral: 6, negative: 2, avgPosition: 1.8 },
  { date: '11 Feb', mentions: 30, positive: 21, neutral: 7, negative: 2, avgPosition: 1.1 },
  { date: '12 Feb', mentions: 26, positive: 18, neutral: 6, negative: 2, avgPosition: 1.6 },
  { date: '13 Feb', mentions: 32, positive: 22, neutral: 8, negative: 2, avgPosition: 1.0 },
  { date: '14 Feb', mentions: 29, positive: 20, neutral: 7, negative: 2, avgPosition: 1.4 },
];

export default function DashboardPage() {
  const [brandName] = useState('My Brand');

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-surface-400 text-sm mt-1">
          Panoramica della visibilità AI per <span className="text-brand-400 font-medium">{brandName}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Visibility Score"
          value="72"
          icon={Eye}
          color="brand"
          trend="up"
          trendValue="+8%"
          subtitle="su 100"
        />
        <StatCard
          title="Menzioni Totali"
          value="286"
          icon={BarChart3}
          color="emerald"
          trend="up"
          trendValue="+23%"
          subtitle="ultimi 30 giorni"
        />
        <StatCard
          title="Query Analizzate"
          value="48"
          icon={Search}
          color="purple"
          trend="stable"
          trendValue="0%"
          subtitle="questa settimana"
        />
        <StatCard
          title="Provider Attivi"
          value="3"
          icon={Cpu}
          color="amber"
          subtitle="ChatGPT, Gemini, Perplexity"
        />
      </div>

      {/* Analytics Chart */}
      <BrandAnalyticsDisplay data={demoVisibilityData} brandName={brandName} />

      {/* Bottom Grid: Query + Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        <QueryInputWidget brandName={brandName} />
        <RecentQueries />
      </div>
    </div>
  );
}
