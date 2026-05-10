import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const { t } = useLanguage();

  const handleLogout = () => {

    setIsLoggedIn(false);

    navigate('/');

  };

  
  const handleLanguageToggle = () => {

    const currentLanguage =

      localStorage.getItem("language") || "en";

    const newLanguage =

      currentLanguage === "en"
        ? "te"
        : "en";

    localStorage.setItem(
      "language",
      newLanguage
    );

    window.location.reload();

  };

  return (

    <nav className="navbar">

      <div className="nav-container">

        <Link to="/" className="nav-logo">

          <span className="logo-icon">🇮🇳</span>

          <span className="logo-text">
            {t('navbar.logo')}
          </span>

        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>

          {!isLoggedIn ? (

            <>

              <Link to="/login" className="nav-link">
                {t('navbar.login')}
              </Link>

              <Link to="/signup">

                <button className="btn-get-started">
                  {t('navbar.getStarted')}
                </button>

              </Link>

            </>

          ) : (

            <>

              <Link to="/dashboard" className="nav-link">
                {t('navbar.dashboard')}
              </Link>

              <button
                onClick={handleLogout}
                className="btn-logout"
              >
                {t('navbar.logout')}
              </button>

            </>

          )}

         

          <div onClick={handleLanguageToggle}>

            <LanguageSwitcher />

          </div>

        </div>

        <div
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >

          <span></span>
          <span></span>
          <span></span>

        </div>

      </div>

    </nav>

  );
};

export default Navbar;
