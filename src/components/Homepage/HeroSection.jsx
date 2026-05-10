import { TypeAnimation } from 'react-type-animation';
import { useLanguage } from '../../contexts/LanguageContext';
import './HeroSection.css';

const HeroSection = () => {
  const { t, language } = useLanguage();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">
              <TypeAnimation
                sequence={
                  language === "te"
                    ? [
                        'పత్రాలు అప్లోడ్ చేయండి',
                        2000,
                        'అర్హత పథకాలు కనుగొనండి',
                        2000,
                        'ప్రభుత్వ ప్రయోజనాలు పొందండి',
                        2000
                      ]
                    : [
                        'Find Eligible Schemes',
                        2000,
                        'Upload Documents Easily',
                        2000,
                        'Get Government Benefits',
                        2000
                      ]
                }
                speed={50}
                repeat={Infinity}
              />
            </span>

            <br />

            {t('hero.titleHighlight')}
          </h1>

          <h2 className="hero-subtitle">
            {t('hero.subtitle')}

            <span className="accent">
              {" "}
              {t('hero.subtitleAccent')}
            </span>
          </h2>

          <p className="hero-description">
            {t('hero.description')}
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => (window.location.href = "/signup")}
            >
              {t('navbar.getStarted')}
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-card card-1">
            <span>🏠 {t('hero.scheme1')}</span>
          </div>

          <div className="floating-card card-2">
            <span>💰 {t('hero.scheme2')}</span>
          </div>

          <div className="floating-card card-3">
            <span>📚 {t('hero.scheme3')}</span>
          </div>

          <div className="floating-card card-4">
            <span>🛡️ {t('hero.scheme4')}</span>
          </div>

          <div className="floating-card card-5">
            <span>🎓 {t('hero.scheme5')}</span>
          </div>

          <div className="floating-card card-6">
            <span>👧 {t('hero.scheme6')}</span>
          </div>

          <div className="floating-card card-7">
            <span>🏥 {t('hero.scheme7')}</span>
          </div>

          <div className="floating-card card-8">
            <span>💳 {t('hero.scheme8')}</span>
          </div>

          <div className="floating-card card-9">
            <span>💼 {t('hero.scheme9')}</span>
          </div>

          <div className="floating-card card-10">
            <span>🔥 {t('hero.scheme10')}</span>
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
