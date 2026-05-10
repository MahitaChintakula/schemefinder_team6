import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >

      <div className="nav-container">

        <motion.div
          whileHover={{
            scale: 1.05
          }}
        >

          <Link to="/" className="nav-logo">

            <span className="logo-icon">🇮🇳</span>

            <span className="logo-text">
              {t('navbar.logo')}
            </span>

          </Link>

        </motion.div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>

          {!isLoggedIn ? (

            <>

              <motion.div
                whileHover={{
                  y: -2,
                  scale: 1.05
                }}
              >

                <Link
                  to="/login"
                  className="nav-link"
                >
                  {t('navbar.login')}
                </Link>

              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05
                }}
                whileTap={{
                  scale: 0.95
                }}
              >

                {/* <Link to="/signup">

                  <button className="btn-get-started">
                    {t('navbar.getStarted')}
                  </button>

                </Link> */}

              </motion.div>

            </>

          ) : (

            <>

              <motion.div
                whileHover={{
                  y: -2,
                  scale: 1.05
                }}
              >

                <Link
                  to="/dashboard"
                  className="nav-link"
                >
                  {t('navbar.dashboard')}
                </Link>

              </motion.div>

              <motion.button
                whileHover={{
                  scale: 1.05
                }}
                whileTap={{
                  scale: 0.95
                }}
                onClick={handleLogout}
                className="btn-logout"
              >
                {t('navbar.logout')}
              </motion.button>

            </>

          )}

         

          <motion.div
            whileHover={{
              rotate: 5,
              scale: 1.05
            }}
            onClick={handleLanguageToggle}
          >

            <LanguageSwitcher />

          </motion.div>

        </div>

        <motion.div
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{
            scale: 0.9
          }}
        >

          <span></span>
          <span></span>
          <span></span>

        </motion.div>

      </div>

    </motion.nav>

  );
};

export default Navbar;
