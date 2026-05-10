import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { loginUser } from '../../services/api';
import './Login.css';

const Login = () => {

  const navigate = useNavigate();

  const { t } = useLanguage();

  const [formData, setFormData] = useState({

    email: '',

    password: '',
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,
    }));

    // Clear error while typing
    if (errors[name]) {

      setErrors((prev) => ({

        ...prev,

        [name]: '',
      }));
    }
  };

  const validateForm = () => {

    const newErrors = {};

    
    if (!formData.email) {

      newErrors.email =
        t('login.errors.emailRequired');

    } else if (
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {

      newErrors.email =
        t('login.errors.emailInvalid');
    }

   
    if (!formData.password) {

      newErrors.password =
        t('login.errors.passwordRequired');

    } else if (
      formData.password.length < 6
    ) {

      newErrors.password =
        t('login.errors.passwordMin');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {

      setErrors(validationErrors);

      return;
    }

    setLoading(true);

    try {

      console.log(
        'Sending login data:',
        formData
      );

      const response =
        await loginUser({

          email: formData.email,

          password: formData.password,
        });

      console.log(
        'Login Response:',
        response
      );

      if (
        response.statusCode === 200
      ) {

        // Store session
        localStorage.setItem(
          'isLoggedIn',
          'true'
        );

        localStorage.setItem(
          'userEmail',
          formData.email
        );

        localStorage.setItem(
          'currentUser',

          JSON.stringify(
            response.body.user
          )
        );

        alert(
          response.body.message ||
          'Login successful'
        );

        setLoading(false);

       
        navigate('/profile-choice');

      } else {

        alert(
          response.body?.message ||
          'Invalid email or password'
        );

        setLoading(false);
      }

    } catch (error) {

      console.error(
        'Login Error:',
        error
      );

      alert(
        'Login failed'
      );

      setLoading(false);
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">

          <h2>
            {t('login.title')}
          </h2>

          <p>
            {t('login.subtitle')}
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <div className="form-group">

            <label htmlFor="email">

              {t('login.email')}

            </label>

            <div className="input-wrapper">

              <span className="input-icon">
              </span>

              <input
                type="email"
                id="email"
                name="email"
                placeholder={
                  t('login.emailPlaceholder')
                }
                value={formData.email}
                onChange={handleChange}
                className={
                  errors.email
                    ? 'error'
                    : ''
                }
              />

            </div>

            {errors.email && (

              <span className="error-message">

                {errors.email}

              </span>
            )}

          </div>

          <div className="form-group">

            <label htmlFor="password">

              {t('login.password')}

            </label>

            <div className="input-wrapper">

              <span className="input-icon">
              </span>

              <input
                type="password"
                id="password"
                name="password"
                placeholder={
                  t('login.passwordPlaceholder')
                }
                value={formData.password}
                onChange={handleChange}
                className={
                  errors.password
                    ? 'error'
                    : ''
                }
              />

            </div>

            {errors.password && (

              <span className="error-message">

                {errors.password}

              </span>
            )}

          </div>

          <div className="form-options">

            <label className="checkbox-label">

              <input type="checkbox" />

              {' '}

              {t('login.rememberMe')}

            </label>

            <Link
              to="/forgot-password"
              className="forgot-link"
            >

              {t('login.forgotPassword')}

            </Link>

          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >

            {loading

              ? t('login.signingIn')

              : t('login.signIn')}

          </button>

        </form>

        <div className="auth-footer">

          <p>

            {t('login.noAccount')}

            {' '}

            <Link
              to="/signup"
              className="auth-link"
            >

              {t('login.createAccount')}

            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;
