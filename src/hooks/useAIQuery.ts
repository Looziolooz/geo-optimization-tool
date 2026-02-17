'use client';

import { useState, useCallback } from 'react';
import { QueryResult, AIProviderName } from '@/lib/types';

interface UseQueryOptions {
  brandId: string;
  brandName: string;
  competitors?: string[];
  market?: 'se' | 'en';
}

export function useAIQuery() {
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = useCallback(async (
    query: string,
    options: UseQueryOptions,
    providers?: AIProviderName[]
  ) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          brandId: options.brandId,
          brandName: options.brandName,
          competitors: options.competitors || [],
          market: options.market || 'en',
          providers,
          includeCompetitors: true,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data.data);
      return data.data as QueryResult;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Query failed';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, executeQuery, setResult };
}
