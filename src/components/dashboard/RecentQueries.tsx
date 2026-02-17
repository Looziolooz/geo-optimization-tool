'use client';

import { Clock, CheckCircle2, XCircle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface RecentQuery {
  id: string;
  query: string;
  brandMentioned: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  visibilityScore: number;
  timestamp: string;
  providersQueried: number;
}

// Demo data - in production this comes from Firestore
const demoQueries: RecentQuery[] = [
  {
    id: '1',
    query: 'Best project management tools for startups',
    brandMentioned: true,
    sentiment: 'positive',
    visibilityScore: 78,
    timestamp: '2 ore fa',
    providersQueried: 3,
  },
  {
    id: '2',
    query: 'Top CRM software comparison 2025',
    brandMentioned: true,
    sentiment: 'neutral',
    visibilityScore: 45,
    timestamp: '5 ore fa',
    providersQueried: 3,
  },
  {
    id: '3',
    query: 'Enterprise collaboration platforms review',
    brandMentioned: false,
    sentiment: 'neutral',
    visibilityScore: 0,
    timestamp: '1 giorno fa',
    providersQueried: 2,
  },
  {
    id: '4',
    query: 'Alternatives to traditional ERP systems',
    brandMentioned: true,
    sentiment: 'positive',
    visibilityScore: 62,
    timestamp: '1 giorno fa',
    providersQueried: 3,
  },
  {
    id: '5',
    query: 'AI-powered business analytics tools',
    brandMentioned: false,
    sentiment: 'neutral',
    visibilityScore: 12,
    timestamp: '2 giorni fa',
    providersQueried: 3,
  },
];

export default function RecentQueries() {
  return (
    <div className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-surface-400" />
          <h3 className="text-lg font-semibold text-white">Query Recenti</h3>
        </div>
        <span className="text-surface-500 text-xs">{demoQueries.length} query</span>
      </div>

      <div className="space-y-2">
        {demoQueries.map((q) => (
          <div
            key={q.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/30 transition-colors cursor-pointer group"
          >
            {/* Status Icon */}
            <div className="shrink-0">
              {q.brandMentioned ? (
                q.sentiment === 'positive' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : q.sentiment === 'negative' ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <Minus className="w-5 h-5 text-surface-400" />
                )
              ) : (
                <XCircle className="w-5 h-5 text-surface-600" />
              )}
            </div>

            {/* Query text */}
            <div className="flex-1 min-w-0">
              <p className="text-surface-200 text-sm truncate group-hover:text-white transition-colors">
                {q.query}
              </p>
              <p className="text-surface-500 text-xs mt-0.5">
                {q.providersQueried} provider • {q.timestamp}
              </p>
            </div>

            {/* Score */}
            <div
              className={cn(
                'shrink-0 text-sm font-semibold tabular-nums w-10 text-right',
                q.visibilityScore >= 60
                  ? 'text-emerald-400'
                  : q.visibilityScore >= 30
                  ? 'text-amber-400'
                  : 'text-surface-500'
              )}
            >
              {q.visibilityScore}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
