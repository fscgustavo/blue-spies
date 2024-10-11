'use client';

import { createContext, useContext } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';

import ptDictionary from '../dictionaries/pt.json';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

const DictionaryContext = createContext<Dictionary | null>(null);

export default function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);

  if (dictionary === null) {
    return ptDictionary;
  }

  return dictionary;
}
