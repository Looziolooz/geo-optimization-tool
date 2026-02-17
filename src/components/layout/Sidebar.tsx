'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, BarChart3, Building2, Plus, Globe, ChevronDown, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBrandStore } from '@/lib/store/brand-store';
import ScoreRing from '@/components/ui/ScoreRing';
import { useState } from 'react';

const navItems = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/queries', label: 'Query AI', icon: Search },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/brands', label: 'Brands', icon: Building2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { brands, activeBrand, setActiveBrand } = useBrandStore();
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface-950/80 backdrop-blur-xl border-r border-surface-800/40 flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-surface-800/40">
        <Link href="/overview" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight leading-none">GEO Tool</h1>
            <p className="text-surface-500 text-[9px] uppercase tracking-[0.2em] mt-0.5">AI Visibility</p>
          </div>
        </Link>
      </div>

      {/* Brand Selector */}
      <div className="px-3 pt-4 pb-2">
        <div className="relative">
          <button
            onClick={() => setBrandMenuOpen(!brandMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-800/40 border border-surface-700/30 hover:border-surface-600/50 transition-all text-left"
          >
            {activeBrand ? (
              <>
                <ScoreRing score={activeBrand.visibilityScore} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{activeBrand.name}</p>
                  <p className="text-surface-500 text-[10px] uppercase">{activeBrand.market === 'se' ? '🇸🇪 Sverige' : activeBrand.market === 'en' ? '🌍 International' : '🌍 Both'}</p>
                </div>
              </>
            ) : (
              <span className="text-surface-400 text-sm">Välj brand...</span>
            )}
            <ChevronDown className={cn('w-4 h-4 text-surface-500 transition-transform', brandMenuOpen && 'rotate-180')} />
          </button>

          {brandMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface-900 border border-surface-700/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setActiveBrand(b.id); setBrandMenuOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-surface-800/50 transition-colors',
                    b.id === activeBrand?.id && 'bg-brand-500/10'
                  )}
                >
                  <ScoreRing score={b.visibilityScore} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{b.name}</p>
                    <p className="text-surface-500 text-[10px]">{b.industry}</p>
                  </div>
                </button>
              ))}
              <Link
                href="/brands"
                onClick={() => setBrandMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-brand-400 hover:bg-surface-800/50 transition-colors border-t border-surface-800/50"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Lägg till brand</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                isActive ? 'bg-brand-500/10 text-brand-400' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
              )}>
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-surface-800/40">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-surface-500 hover:text-white rounded-xl hover:bg-surface-800/50 transition-all text-sm">
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </Link>
        <p className="text-surface-600 text-[10px] px-3 mt-2">Agency Tool • Multi-brand GEO</p>
      </div>
    </aside>
  );
}
