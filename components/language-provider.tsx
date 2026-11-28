'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ne';
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void } | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tej-language');
      if (saved === 'en' || saved === 'ne') updateLanguage(saved);
    } catch { /* Language selection still works when storage is unavailable. */ }
  }, []);

  function setLanguage(value: Language) {
    updateLanguage(value);
    try { localStorage.setItem('tej-language', value); } catch { /* Keep the choice for this visit. */ }
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <div className="language-switcher" role="group" aria-label="Preferred language">
    <button type="button" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
    <button type="button" aria-label="Nepali" aria-pressed={language === 'ne'} onClick={() => setLanguage('ne')}>NP</button>
    <span className="language-status" role="status" lang={language}>{language === 'ne' ? 'नेपाली भाषा चयन गरिएको छ।' : 'English selected.'}</span>
  </div>;
}
