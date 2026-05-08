import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  return (
    <button className="language-switcher" onClick={toggleLanguage}>
      <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
      <span className="lang-separator">|</span>
      <span className={`lang-option ${language === 'te' ? 'active' : ''}`}>తె</span>
    </button>
  );
};

export default LanguageSwitcher;