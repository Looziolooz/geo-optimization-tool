'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Brand, BrandInput, QueryResult } from '@/lib/types';

interface BrandStore {
  brands: Brand[];
  activeBrandId: string | null;
  activeBrand: Brand | null;
  queryHistory: QueryResult[];
  addBrand: (input: BrandInput) => Brand;
  updateBrand: (id: string, input: Partial<BrandInput>) => void;
  deleteBrand: (id: string) => void;
  setActiveBrand: (id: string) => void;
  addQueryResult: (result: QueryResult) => void;
  getQueryHistory: (brandId: string) => QueryResult[];
}

const BrandContext = createContext<BrandStore | undefined>(undefined);

const STORAGE_KEY = 'geo-tool-brands';
const QUERIES_KEY = 'geo-tool-queries';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Brand[];
        setBrands(parsed);
        if (parsed.length > 0) setActiveBrandId(parsed[0].id);
      }
      const queries = localStorage.getItem(QUERIES_KEY);
      if (queries) setQueryHistory(JSON.parse(queries));
    } catch { /* ignore parse errors */ }
  }, []);

  // Persist brands
  useEffect(() => {
    if (brands.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
    }
  }, [brands]);

  // Persist queries
  useEffect(() => {
    if (queryHistory.length > 0) {
      localStorage.setItem(QUERIES_KEY, JSON.stringify(queryHistory));
    }
  }, [queryHistory]);

  const activeBrand = brands.find((b) => b.id === activeBrandId) || null;

  const addBrand = useCallback((input: BrandInput): Brand => {
    const now = new Date().toISOString();
    const brand: Brand = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      visibilityScore: 0,
    };
    setBrands((prev) => [...prev, brand]);
    setActiveBrandId(brand.id);
    return brand;
  }, []);

  const updateBrand = useCallback((id: string, input: Partial<BrandInput>) => {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...input, updatedAt: new Date().toISOString() } : b
      )
    );
  }, []);

  const deleteBrand = useCallback((id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    setActiveBrandId((prev) => (prev === id ? null : prev));
  }, []);

  const setActiveBrand = useCallback((id: string) => {
    setActiveBrandId(id);
  }, []);

  const addQueryResult = useCallback((result: QueryResult) => {
    setQueryHistory((prev) => [result, ...prev].slice(0, 200)); // keep last 200
    // Update brand visibility score
    setBrands((prev) =>
      prev.map((b) =>
        b.id === result.brandId
          ? { ...b, visibilityScore: result.visibilityScore, lastAnalysis: result.timestamp, updatedAt: result.timestamp }
          : b
      )
    );
  }, []);

  const getQueryHistory = useCallback(
    (brandId: string) => queryHistory.filter((q) => q.brandId === brandId),
    [queryHistory]
  );

  return (
    <BrandContext.Provider
      value={{
        brands, activeBrandId, activeBrand, queryHistory,
        addBrand, updateBrand, deleteBrand, setActiveBrand,
        addQueryResult, getQueryHistory,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandStore(): BrandStore {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrandStore must be inside BrandProvider');
  return ctx;
}
