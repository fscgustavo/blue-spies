'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Script from 'next/script';
import { ReactNode } from 'react';

export function ClientEffects({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Script />
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADS_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
      {children}
    </QueryClientProvider>
  );
}
