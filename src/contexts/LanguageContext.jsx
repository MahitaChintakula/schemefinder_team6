import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en.json';
import te from '../locales/te.json';

const LanguageContext = createContext();

const translations = { en, te };

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang && (savedLang === 'en' || savedLang === 'te') ? savedLang : 'en';
  });

  const [dir, setDir] = useState('ltr');

  useEffect(() => {
    localStorage.setItem('language', language);
    setDir(language === 'te' ? 'ltr' : 'ltr'); // Telugu also uses LTR
    document.documentElement.lang = language;
  }, [language]);

  const t = (path) => {
    const keys = path.split('.');
    let value = translations[language];
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    return value || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};