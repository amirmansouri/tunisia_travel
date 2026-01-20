'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from './translations';

// Create a recursive type for nested translation objects
type DeepStringRecord = {
  [key: string]: string | DeepStringRecord;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'arivo-travel-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Update document direction for RTL support
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language] as typeof translations.en,
    dir: language === 'ar' ? 'rtl' : 'ltr',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
