import 'server-only';

const dictionaries = {
  pt: () =>
    import('../../dictionaries/pt.json').then((module) => module.default),
  en: () =>
    import('../../dictionaries/en.json').then((module) => module.default),
  es: () =>
    import('../../dictionaries/es.json').then((module) => module.default),
} as const;

export const getDictionary = (locale: string) => {
  return dictionaries[(locale as keyof typeof dictionaries) ?? 'pt']();
};
