import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './ProfileChoicePage.css';

const ProfileChoicePage = () => {

  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="choice-container">

      <div className="choice-card">

        <h1>
          {language === 'te'
            ? 'ధృవీకరణ విధానాన్ని ఎంచుకోండి'
            : 'Select Verification Method'}
        </h1>

        <p>
          {language === 'te'
            ? 'ప్రభుత్వ పథకాలను కనుగొనడానికి విధానాన్ని ఎంచుకోండి.'
            : 'Choose how you want to find eligible government schemes.'}
        </p>

        <div className="choice-options">

          <div
            className="choice-box"
           
            // }
            onClick={() => navigate('/document-upload')}
          >
            <div className="choice-icon">📄</div>

            <h2>
              {language === 'te'
                ? 'పత్రాలను అప్‌లోడ్ చేయండి'
                : 'Upload Documents'}
            </h2>

            <p>
              {language === 'te'
                ? 'ఆధార్, ఆదాయ ధృవీకరణ, కుల ధృవీకరణ పత్రాలు అప్‌లోడ్ చేయండి.'
                : 'Upload Aadhaar, income certificate, caste certificate etc...'}
            </p>
          </div>

       

          <div
            className="choice-box"
            onClick={() => navigate('/user-details')}
          >
            <div className="choice-icon">🧑</div>

            <h2>
              {language === 'te'
                ? 'మీ వివరాలు చెప్పండి'
                : 'Tell About Yourself'}
            </h2>

            <p>
              {language === 'te'
                ? 'వయస్సు, వర్గం, ఆదాయం, ఉద్యోగం వంటి వివరాలను నమోదు చేయండి.'
                : 'Fill details manually like age, category, income and occupation.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfileChoicePage;
