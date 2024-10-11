import { Metadata } from 'next';

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
    description: '',
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

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const dictionary = await getDictionary(lang);

  return (
    <DictionaryProvider dictionary={dictionary}>{children}</DictionaryProvider>
  );
}
