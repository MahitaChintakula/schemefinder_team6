import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './HowItWorks.css';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: "1",
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      icon: "📝",
      color: "#1a5f7a"
    },
    {
      number: "2",
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      icon: "⚡",
      color: "#f47b20"
    },
    {
      number: "3",
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      icon: "🎯",
      color: "#27ae60"
    }
  ];

  return (
    <section className="howitworks-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('howItWorks.title')}</h2>
          <p className="section-subtitle">{t('howItWorks.subtitle')}</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number" style={{ backgroundColor: step.color }}>
                {step.number}
              </div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

        <div className="cta-section">
          <div className="cta-content">
            <h3>{t('howItWorks.cta.title')}</h3>
            <p>{t('howItWorks.cta.description')}</p>
          
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
