import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GEO Tool — AI Visibility Monitor',
  description: 'Multi-brand AI visibility monitoring for agencies.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="noise-overlay">{children}</body>
    </html>
  );
}
