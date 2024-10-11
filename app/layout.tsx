import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ClientEffects } from '@/components/client-effects';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'BlueSpies',
  description: 'Veja todas as curtidas de qualquer perfil do Bluesky',
  keywords: ['Bluesky', 'curtidas', 'likes', 'perfil', 'tweet', 'post'],
  applicationName: 'BlueSpies',
};

export default function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientEffects>{children}</ClientEffects>
        <Analytics />
      </body>
    </html>
  );
}
