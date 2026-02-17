'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Globe, X, Building2 } from 'lucide-react';
import { useBrandStore } from '@/lib/store/brand-store';
import { INDUSTRIES, BrandInput, IndustryValue } from '@/lib/types';
import ScoreRing from '@/components/ui/ScoreRing';
import { cn, timeAgo } from '@/lib/utils';

export default function BrandsPage() {
  const { brands, addBrand, deleteBrand, setActiveBrand } = useBrandStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BrandInput>({
    name: '', 
    domain: '', 
    industry: 'saas', 
    market: 'both', 
    competitors: [], 
    keywords: [], 
    description: '',
  });
  const [competitorInput, setCompetitorInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    addBrand(form);
    setForm({ 
      name: '', 
      domain: '', 
      industry: 'saas', 
      market: 'both', 
      competitors: [], 
      keywords: [], 
      description: '' 
    });
    setShowForm(false);
  };

  const addCompetitor = () => {
    if (!competitorInput.trim()) return;
    setForm((f) => ({ ...f, competitors: [...f.competitors, competitorInput.trim()] }));
    setCompetitorInput('');
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    setForm((f) => ({ ...f, keywords: [...f.keywords, keywordInput.trim()] }));
    setKeywordInput('');
  };

  return (
    // max-w-[1000px] aggiornato in max-w-250 per Tailwind v4
    <div className="max-w-250 mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Brands</h1>
          <p className="text-surface-400 text-sm mt-1">Hantera alla dina brands och konkurrenter / Manage your brands and competitors</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-brand-500/15">
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      {/* Add Brand Form */}
      {showForm && (
        <div className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-6 space-y-4 animate-slide-up">
          <h3 className="text-white font-semibold">Nytt Brand / New Brand</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-surface-400 text-xs font-medium mb-1 block">Brand Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Acasting" className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50" />
            </div>
            <div>
              <label className="text-surface-400 text-xs font-medium mb-1 block">Domain (optional)</label>
              <input value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                placeholder="e.g. acasting.se" className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50" />
            </div>
            <div>
              <label className="text-surface-400 text-xs font-medium mb-1 block">Industry *</label>
              <select value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value as IndustryValue }))}
                className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50">
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-surface-400 text-xs font-medium mb-1 block">Market *</label>
              <select value={form.market} onChange={(e) => setForm((f) => ({ ...f, market: e.target.value as 'se' | 'en' | 'both' }))}
                className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50">
                <option value="se">🇸🇪 Sverige (Swedish)</option>
                <option value="en">🌍 International (English)</option>
                <option value="both">🌐 Both</option>
              </select>
            </div>
          </div>

          {/* Competitors */}
          <div>
            <label className="text-surface-400 text-xs font-medium mb-1 block">Competitors</label>
            <div className="flex gap-2 mb-2">
              <input value={competitorInput} onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                placeholder="Add competitor name..." className="flex-1 bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2 text-white text-sm placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50" />
              <button onClick={addCompetitor} className="px-3 py-2 bg-surface-700 hover:bg-surface-600 text-white text-sm rounded-xl">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.competitors.map((c, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-surface-800 text-surface-300 text-xs rounded-lg">
                  {c}
                  <button onClick={() => setForm((f) => ({ ...f, competitors: f.competitors.filter((_, j) => j !== i) }))} className="text-surface-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="text-surface-400 text-xs font-medium mb-1 block">Keywords / Nyckelord</label>
            <div className="flex gap-2 mb-2">
              <input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="Add keyword..." className="flex-1 bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2 text-white text-sm placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50" />
              <button onClick={addKeyword} className="px-3 py-2 bg-surface-700 hover:bg-surface-600 text-white text-sm rounded-xl">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.keywords.map((k, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-brand-500/10 text-brand-400 text-xs rounded-lg border border-brand-500/20">
                  {k}
                  <button onClick={() => setForm((f) => ({ ...f, keywords: f.keywords.filter((_, j) => j !== i) }))} className="text-brand-400/50 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-all">Save Brand</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 text-surface-400 hover:text-white text-sm rounded-xl transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Brand List */}
      {brands.length === 0 ? (
        <div className="text-center py-20 bg-surface-900/30 border border-surface-800/40 rounded-2xl">
          <Building2 className="w-12 h-12 text-surface-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No brands yet</h3>
          <p className="text-surface-400 text-sm mb-4">Lägg till ditt första brand för att börja monitorera AI-synligheten.</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2 bg-brand-600 text-white text-sm rounded-xl">
            <Plus className="w-4 h-4 inline mr-1" /> Add your first brand
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-surface-900/50 border border-surface-800/50 rounded-2xl p-5 hover:border-surface-700/50 transition-all group">
              <div className="flex items-center gap-4">
                <ScoreRing score={brand.visibilityScore} size={56} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{brand.name}</h3>
                    <span className="text-surface-500 text-xs px-2 py-0.5 bg-surface-800 rounded-full">{brand.market === 'se' ? '🇸🇪 SE' : brand.market === 'en' ? '🌍 EN' : '🌐 Both'}</span>
                    <span className="text-surface-500 text-xs">{brand.industry}</span>
                  </div>
                  {brand.domain && <p className="text-surface-400 text-sm">{brand.domain}</p>}
                  <div className="flex items-center gap-3 mt-1.5">
                    {brand.competitors.length > 0 && (
                      <span className="text-surface-500 text-xs">vs {brand.competitors.join(', ')}</span>
                    )}
                    {brand.lastAnalysis && (
                      <span className="text-surface-600 text-xs">Last: {timeAgo(brand.lastAnalysis)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setActiveBrand(brand.id)} className="px-3 py-1.5 bg-brand-600/20 text-brand-400 text-xs rounded-lg hover:bg-brand-600/30 transition-all">
                    Analyze
                  </button>
                  <button onClick={() => deleteBrand(brand.id)} className="p-1.5 text-surface-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}