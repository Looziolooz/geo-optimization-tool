'use client';

import { useState, useEffect } from 'react';
import { Settings, CheckCircle2, XCircle, Loader2, Globe, RefreshCw } from 'lucide-react';
import { AI_PROVIDERS, AIProviderName } from '@/lib/types';

export default function SettingsPage() {
  const [providers, setProviders] = useState<{ name: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const checkProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/query');
      const data = await res.json();
      if (data.success) setProviders(data.data.providers);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { checkProviders(); }, []);

  const allProviderNames = Object.keys(AI_PROVIDERS) as AIProviderName[];
  const configuredNames = providers.map((p) => p.name);

  return (
    <div className="max-w-[800px] mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-surface-400 text-sm mt-1">AI provider configuration and system status</p>
      </div>

      {/* Provider Status */}
      <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-400" />
            <h3 className="text-white font-semibold">AI Providers</h3>
          </div>
          <button onClick={checkProviders} disabled={loading} className="text-surface-400 hover:text-white text-sm flex items-center gap-1">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-surface-400 py-4"><Loader2 className="w-4 h-4 animate-spin" /> Checking providers...</div>
        ) : (
          <div className="space-y-3">
            {allProviderNames.map((name) => {
              const info = AI_PROVIDERS[name];
              const configured = configuredNames.includes(name);
              return (
                <div key={name} className="flex items-center gap-4 p-3 rounded-xl bg-surface-800/20">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
                  {configured
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    : <XCircle className="w-5 h-5 text-red-400" />}
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{info.label}</p>
                    <p className="text-surface-500 text-xs">{info.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${configured ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {configured ? 'Active' : 'Not configured'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Env guide */}
      <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Configuration (.env.local)</h3>
        <pre className="bg-surface-950 border border-surface-800 rounded-xl p-4 text-sm text-surface-300 overflow-x-auto font-mono leading-relaxed">
{`# Google Gemini (FREE)
# Get key: https://aistudio.google.com/
GOOGLE_AI_API_KEY=your_key_here

# OpenRouter (FREE) — powers ChatGPT + Perplexity
# Get key: https://openrouter.ai/
OPENROUTER_API_KEY=your_key_here

# Firebase (optional, for data persistence)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...`}
        </pre>
        <p className="text-surface-500 text-xs mt-3">See GUIDA_API_KEYS.md for detailed setup instructions.</p>
      </div>
    </div>
  );
}
