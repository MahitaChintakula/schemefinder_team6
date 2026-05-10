import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import './SchemeResults.css';

const SchemeResults = () => {

  const { language } = useLanguage();

  const location = useLocation();

  const schemes = Array.isArray(
    location.state?.matchedSchemes
  )
    ? location.state.matchedSchemes
    : [];

  return (

    <div className="results-container">

      <div className="results-header">

        <h2>
          {language === 'te'
            ? 'మీకు అర్హత ఉన్న ప్రభుత్వ పథకాలు'
            : 'Your Eligible Government Schemes'}
        </h2>

        <p>
          {language === 'te'
            ? `మీ ప్రొఫైల్ ఆధారంగా ${schemes.length} పథకాలు కనుగొన్నాము`
            : `Based on your profile, we found ${schemes.length} schemes`}
        </p>

      </div>

      <div className="schemes-grid">

        {schemes.length > 0 ? (

          schemes.map((scheme) => (

            <div
              key={scheme.scheme_id}
              className="scheme-card"
            >

              <div className="scheme-content">

                <div className="scheme-header">

                  <h3>
                    {scheme.scheme_name}
                  </h3>

                </div>

                <p className="scheme-description">
                  {scheme.benefit_description}
                </p>

                <div className="documents-section">

                  <strong>
                    {language === 'te'
                      ? 'అవసరమైన పత్రాలు:'
                      : 'Required Documents:'}
                  </strong>

                  <ul>

                    {scheme.documents_required?.map((doc, index) => (

                      <li key={index}>
                        {doc}
                      </li>

                    ))}

                  </ul>

                </div>

                <div className="scheme-details">

                  <span className="detail-tag">
                    🏷️ {scheme.category}
                  </span>

                </div>

                <div className="scheme-footer">

                  <a
                    href={scheme.application_link}
                    target="_blank"
                    rel="noreferrer"
                    className="view-details-btn"
                  >
                    {language === 'te'
                      ? 'దరఖాస్తు చేయండి →'
                      : 'Apply Now →'}
                  </a>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="no-schemes">

            <h3>
              {language === 'te'
                ? 'పథకాలు కనుగొనబడలేదు'
                : 'No schemes found'}
            </h3>

            <p>
              {language === 'te'
                ? 'మీ వివరాలకు సరిపోయే పథకాలు లేవు'
                : 'No matching schemes available for your profile'}
            </p>

          </div>

        )}

      </div>

    </div>

  );
};

export default SchemeResults;
