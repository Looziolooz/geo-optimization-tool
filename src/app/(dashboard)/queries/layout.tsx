// src/app/(dashboard)/queries/layout.tsx
import React from 'react';

// L'esportazione DEVE essere "default"
export default function QueriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}