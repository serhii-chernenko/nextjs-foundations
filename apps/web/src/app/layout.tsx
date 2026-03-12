import { ThemeProvider } from '@repo/ui/components/theme-provider';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { clientEnv } from '@/env/client';

import './globals.css';

export const metadata: Metadata = {
  title: clientEnv.NEXT_PUBLIC_APP_NAME,
  description: 'VAF Web',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const regionVariant = headersList.get('x-region-variant');
  const htmlLang = regionVariant === 'ua' ? 'uk' : 'en';

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <body
        className="container mx-auto px-4 py-8"
        data-region-variant={regionVariant ?? 'default'}
      >
        {regionVariant === 'ua' ? (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-900 text-sm">
            Ukrainian regional variant is active for this request.
          </div>
        ) : null}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
        {/* TODO: Convert to next/script (Section 4 Lesson 3) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </body>
    </html>
  );
}
