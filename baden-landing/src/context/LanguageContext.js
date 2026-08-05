import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru');

  // Keep <html lang> in step with the toggle. public/index.html declares
  // lang="ru" as the document default, which was correct for the Russian
  // page and wrong for the English one: the whole site claimed to be Russian
  // regardless of what was on screen, which affects screen-reader
  // pronunciation, browser translation prompts, and hyphenation.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggle: () => setLang((l) => (l === 'ru' ? 'en' : 'ru')),
      isRu: lang === 'ru',
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
