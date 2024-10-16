import '../globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ClientEffects } from '@/components/client-effects';
import DictionaryProvider from '@/components/dictionary-provider';

import { getDictionary } from './dictionaries';

type Props = {
  params: { lang: string };
};

const metadatas = {
  pt: {
    description: 'Veja todas as curtidas de qualquer perfil do Bluesky',
    keywords: ['curtidas', 'perfil', 'postagem'],
  },
  en: {
    description: 'See all the likes from any profile on Bluesky',
    keywords: ['profile'],
  },
  es: {
    description: 'Ver todos los me gusta de cualquier perfil en Bluesky',
    keywords: ['perfil', 'me gusta'],
  },
};

export function generateMetadata({ params: { lang = 'pt' } }: Props): Metadata {
  const langMetadata = metadatas[lang as keyof typeof metadatas];

  return {
    title: 'BlueSpies',
    description: langMetadata.description,
    keywords: [
      'BlueSky',
      'likes',
      'tweet',
      'post',
      'Bsky',
      'stalk',
      ...langMetadata.keywords,
    ],
    applicationName: 'BlueSpies',
  };
}

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }, { lang: 'es' }];
}

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: Props['params'];
}>) {
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DictionaryProvider dictionary={dictionary}>
          <ClientEffects>{children}</ClientEffects>
          <Analytics />
        </DictionaryProvider>
      </body>
    </html>
  );
}
