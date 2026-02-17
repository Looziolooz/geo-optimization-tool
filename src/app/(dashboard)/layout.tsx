'use client';

import { BrandProvider } from '@/lib/store/brand-store';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider>
      <div className="min-h-screen bg-surface-950">
        <Sidebar />
        <main className="ml-64 min-h-screen p-8">{children}</main>
      </div>
    </BrandProvider>
  );
}
