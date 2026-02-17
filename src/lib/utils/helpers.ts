import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'adesso';
  if (diffMins < 60) return `${diffMins}m fa`;
  if (diffHours < 24) return `${diffHours}h fa`;
  if (diffDays < 7) return `${diffDays}g fa`;
  return formatDate(d);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function getSentimentColor(sentiment: 'positive' | 'neutral' | 'negative'): string {
  switch (sentiment) {
    case 'positive': return 'text-emerald-400';
    case 'negative': return 'text-red-400';
    default: return 'text-surface-400';
  }
}

export function getSentimentBg(sentiment: 'positive' | 'neutral' | 'negative'): string {
  switch (sentiment) {
    case 'positive': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'negative': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-surface-500/10 text-surface-400 border-surface-500/20';
  }
}
