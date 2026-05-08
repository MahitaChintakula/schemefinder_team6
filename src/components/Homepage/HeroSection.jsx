import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">{t('hero.title')}</span>
            <br />
            {t('hero.titleHighlight')}
          </h1>
          
          <h2 className="hero-subtitle">
            {t('hero.subtitle')} <span className="accent">{t('hero.subtitleAccent')}</span>
          </h2>
          
          <p className="hero-description">
            {t('hero.description')}
          </p>
          
          {/* <div className="hero-buttons">
            <button className="btn-primary">
              {t('hero.primaryBtn')}
            </button>
            <button className="btn-secondary">
              {t('hero.secondaryBtn')}
            </button>
          </div> */}
        </div>
        
        <div className="hero-image">
          <div className="floating-card card-1">
            <span>🏠 PM Awas Yojana</span>
          </div>
          <div className="floating-card card-2">
            <span>💰 PM-KISAN</span>
          </div>
          <div className="floating-card card-3">
            <span>📚 Scholarship</span>
          </div>
          <div className="hero-illustration">
            <div className="circle-animation"></div>
            <div className="circle-animation delay-1"></div>
            <div className="circle-animation delay-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;