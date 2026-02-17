'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, BarChart3, Sparkles, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/queries', label: 'Query AI', icon: Search },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface-950/80 backdrop-blur-xl border-r border-surface-800/40 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-surface-800/40">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight leading-none">GEO Tool</h1>
            <p className="text-surface-500 text-[10px] uppercase tracking-[0.2em] mt-0.5">
              AI Visibility
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-500/10 text-brand-400 shadow-sm'
                  : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px]', isActive && 'text-brand-400')} />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Info badge */}
      <div className="px-3 pb-3">
        <div className="bg-gradient-to-br from-brand-600/20 to-purple-600/20 border border-brand-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-brand-300 text-xs font-semibold uppercase tracking-wider">
              Progetto Pilota
            </span>
          </div>
          <p className="text-surface-300 text-xs leading-relaxed">
            Strumento GEO/AIO interno per monitorare la visibilità AI del brand.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-surface-800/40">
        <div className="px-3 py-2 text-surface-500 text-xs">
          App interna — Nessuna autenticazione richiesta
        </div>
      </div>
    </aside>
  );
}
