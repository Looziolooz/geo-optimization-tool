'use client';

import { useState, FormEvent } from 'react';
import { Search, Loader2, Zap, AlertCircle } from 'lucide-react';
import { useAIQuery } from '@/hooks/useAIQuery';
import { getSentimentBg } from '@/lib/utils/helpers';

interface QueryInputWidgetProps {
  brandName: string;
}

export default function QueryInputWidget({ brandName }: QueryInputWidgetProps) {
  const [query, setQuery] = useState('');
  const { result, isLoading, error, executeQuery, reset } = useAIQuery();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    await executeQuery(query.trim(), brandName);
  };

  return (
    <div className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-brand-400" />
        <h3 className="text-lg font-semibold text-white">Query AI Engine</h3>
      </div>
      <p className="text-surface-400 text-sm mb-4">
        Testa come i motori AI rispondono alle query relative al tuo brand.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`es. "Best ${brandName} alternatives"`}
            className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-surface-700 disabled:text-surface-500 text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 disabled:shadow-none"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Analizza
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Visibility Score */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/30 border border-surface-700/30">
            <div className="relative">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={result.visibilityScore >= 60 ? '#10b981' : result.visibilityScore >= 30 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${result.visibilityScore}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {result.visibilityScore}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">Visibility Score</p>
              <p className="text-surface-400 text-sm">
                {result.brandMentioned
                  ? `${result.totalMentions} menzioni in ${result.providersQueried} provider`
                  : 'Brand non menzionato dai provider AI'}
              </p>
            </div>
          </div>

          {/* Provider Responses */}
          <div className="space-y-3">
            {result.responses.map((response, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-800/20 border border-surface-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-brand-400 text-sm font-medium capitalize">
                    {response.provider.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getSentimentBg(
                        response.brandAnalysis.sentiment
                      )}`}
                    >
                      {response.brandAnalysis.sentiment}
                    </span>
                    <span className="text-surface-500 text-xs">{response.responseTimeMs}ms</span>
                  </div>
                </div>
                {response.error ? (
                  <p className="text-red-400 text-sm">{response.error}</p>
                ) : (
                  <p className="text-surface-300 text-sm leading-relaxed line-clamp-4">
                    {response.content}
                  </p>
                )}
                {response.brandAnalysis.mentioned && (
                  <p className="text-emerald-400 text-xs mt-2">
                    ✓ Brand menzionato {response.brandAnalysis.mentionCount}x
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={reset}
            className="text-surface-400 hover:text-white text-sm transition-colors"
          >
            ← Nuova query
          </button>
        </div>
      )}
    </div>
  );
}
