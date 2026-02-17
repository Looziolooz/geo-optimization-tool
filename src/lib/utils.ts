import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('sv-SE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function timeAgo(d: Date | string): string {
  const ms = Date.now() - new Date(d).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just nu';
  if (mins < 60) return `${mins}m sedan`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h sedan`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d sedan`;
  return formatDate(d);
}

export function sentimentColor(s: 'positive' | 'neutral' | 'negative') {
  return s === 'positive' ? 'text-emerald-400' : s === 'negative' ? 'text-red-400' : 'text-surface-400';
}

export function sentimentBg(s: 'positive' | 'neutral' | 'negative') {
  return s === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : s === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/20'
    : 'bg-surface-500/10 text-surface-400 border-surface-500/20';
}

export function scoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-red-400';
}

export function scoreBg(score: number): string {
  if (score >= 70) return 'from-emerald-500 to-emerald-600';
  if (score >= 40) return 'from-amber-500 to-amber-600';
  return 'from-red-500 to-red-600';
}
