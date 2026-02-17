'use client';

import { useState, FormEvent } from 'react';
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { useAIQuery } from '@/hooks/useAIQuery';
import { AIProviderName } from '@/lib/types';
import { cn, getSentimentBg } from '@/lib/utils/helpers';

const PROVIDERS: { name: AIProviderName; label: string; color: string }[] = [
  { name: 'google-gemini', label: 'Google Gemini', color: 'bg-blue-500' },
  { name: 'openrouter-chatgpt', label: 'ChatGPT (Llama 3.3)', color: 'bg-emerald-500' },
  { name: 'openrouter-perplexity', label: 'Perplexity (DeepSeek)', color: 'bg-purple-500' },
];

export default function QueriesPage() {
  const [query, setQuery] = useState('');
  const [brandName, setBrandName] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<AIProviderName[]>([]);
  const [expandedResponse, setExpandedResponse] = useState<number | null>(null);
  const { result, isLoading, error, executeQuery } = useAIQuery();

  const toggleProvider = (name: AIProviderName) => {
    setSelectedProviders((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !brandName.trim() || isLoading) return;
    await executeQuery(
      query.trim(),
      brandName.trim(),
      selectedProviders.length > 0 ? selectedProviders : undefined
    );
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Query AI</h1>
        <p className="text-surface-400 text-sm mt-1">
          Testa la visibilità del tuo brand interrogando i motori AI
        </p>
      </div>

      {/* Query Form */}
      <div className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-surface-400 text-xs font-medium mb-1.5 block">Nome Brand</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="es. Notion, Figma, Slack..."
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-surface-400 text-xs font-medium mb-1.5 block">Query da Analizzare</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='es. "What are the best project management tools for remote teams?"'
              rows={3}
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-surface-400 text-xs font-medium mb-2 block">
              Provider AI (opzionale — se vuoto, usa tutti i disponibili)
            </label>
            <div className="flex flex-wrap gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => toggleProvider(p.name)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    selectedProviders.includes(p.name)
                      ? 'bg-brand-500/15 border-brand-500/30 text-brand-300'
                      : 'bg-surface-800/30 border-surface-700/30 text-surface-400 hover:text-white hover:border-surface-600/50'
                  )}
                >
                  <span className={cn('inline-block w-2 h-2 rounded-full mr-2', p.color)} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim() || !brandName.trim()}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-surface-700 disabled:text-surface-500 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/15 hover:shadow-brand-500/30 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analisi in corso...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analizza Visibilità
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Risultati Analisi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-surface-800/30">
                <p className="text-3xl font-bold text-white">{result.visibilityScore}</p>
                <p className="text-surface-500 text-xs mt-1">Visibility Score</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-800/30">
                <p className="text-3xl font-bold text-white">{result.totalMentions}</p>
                <p className="text-surface-500 text-xs mt-1">Menzioni</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-800/30">
                <p className="text-3xl font-bold text-white">{result.providersQueried}</p>
                <p className="text-surface-500 text-xs mt-1">Provider</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-800/30">
                <p className="text-3xl font-bold text-white">
                  {result.brandMentioned ? '✓' : '✗'}
                </p>
                <p className="text-surface-500 text-xs mt-1">Brand Trovato</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {result.responses.map((response, i) => (
              <div
                key={i}
                className="bg-surface-900/50 backdrop-blur-sm border border-surface-800/50 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedResponse(expandedResponse === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-800/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {response.brandAnalysis.mentioned ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-surface-500" />
                    )}
                    <div>
                      <span className="text-white font-medium">
                        {response.provider.replace('openrouter-', '').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      <span className="text-surface-500 text-xs ml-3">{response.responseTimeMs}ms</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border', getSentimentBg(response.brandAnalysis.sentiment))}>
                      {response.brandAnalysis.sentiment}
                    </span>
                    {response.brandAnalysis.mentioned && (
                      <span className="text-emerald-400 text-xs font-medium">
                        {response.brandAnalysis.mentionCount}x menzioni
                      </span>
                    )}
                    {expandedResponse === i ? (
                      <ChevronUp className="w-4 h-4 text-surface-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-surface-400" />
                    )}
                  </div>
                </button>
                {expandedResponse === i && (
                  <div className="px-5 pb-5 border-t border-surface-800/30 pt-4 animate-fade-in">
                    {response.error ? (
                      <p className="text-red-400 text-sm">{response.error}</p>
                    ) : (
                      <p className="text-surface-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {response.content}
                      </p>
                    )}
                    {response.brandAnalysis.excerpts.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-emerald-400 text-xs font-medium mb-2">Estratti con menzione del brand:</p>
                        {response.brandAnalysis.excerpts.map((excerpt, j) => (
                          <p key={j} className="text-surface-300 text-sm italic mb-1">&ldquo;{excerpt}&rdquo;</p>
                        ))}
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
