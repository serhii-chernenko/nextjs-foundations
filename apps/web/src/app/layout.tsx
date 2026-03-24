// import { ThemeProvider } from '@repo/ui/components/theme-provider';
import type { Metadata } from 'next';

import { clientEnv } from '@/env/client';

import './globals.css';

export const metadata: Metadata = {
  title: clientEnv.NEXT_PUBLIC_APP_NAME,
  description: 'VAF Web',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="container mx-auto px-4 py-8">{children}</body>
    </html>
  );
}
