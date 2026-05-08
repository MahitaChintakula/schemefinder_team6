import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { signupUser } from '../../services/api';
import './Signup.css';

const Signup = () => {

  const navigate = useNavigate();

  const { t } = useLanguage();

  const [formData, setFormData] = useState({

    fullName: '',

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

    // Clear errors while typing
    if (errors[name]) {

      setErrors((prev) => ({

        ...prev,

        [name]: '',
      }));
    }
  };

  const validateForm = () => {

    const newErrors = {};

    // Full name validation
    if (!formData.fullName) {

      newErrors.fullName =
        t('signup.errors.nameRequired');

    } else if (
      formData.fullName.length < 3
    ) {

      newErrors.fullName =
        t('signup.errors.nameMin');
    }

    // Email validation
    if (!formData.email) {

      newErrors.email =
        t('signup.errors.emailRequired');

    } else if (
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {

      newErrors.email =
        t('signup.errors.emailInvalid');
    }

    // Password validation
    if (!formData.password) {

      newErrors.password =
        t('signup.errors.passwordRequired');

    } else if (
      formData.password.length < 6
    ) {

      newErrors.password =
        t('signup.errors.passwordMin');

    } else if (
      !/(?=.*[A-Z])(?=.*[0-9])/.test(
        formData.password
      )
    ) {

      newErrors.password =
        t('signup.errors.passwordStrength');
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

      // Create user object
      const newUser = {

        fullName: formData.fullName,

        email: formData.email,

        password: formData.password,
      };

      console.log(
        'Sending signup data:',
        newUser
      );

      // Send data to backend
      const response =
        await signupUser(newUser);

      console.log(
        'Signup Response:',
        response
      );

      setLoading(false);

      // Success message
      alert(
        response.message ||
        'Signup successful'
      );

      // Navigate to login page
      navigate('/login');

    } catch (error) {

      console.error(
        'Signup Error:',
        error
      );

      alert(
        'Signup failed'
      );

      setLoading(false);
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-card signup-card">

        <div className="auth-header">

          <h2>
            {t('signup.title')}
          </h2>

          <p>
            {t('signup.subtitle')}
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <div className="form-group">

            <label htmlFor="fullName">

              {t('signup.fullName')}

            </label>

            <div className="input-wrapper">

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder={
                  t('signup.fullNamePlaceholder')
                }
                value={formData.fullName}
                onChange={handleChange}
                className={
                  errors.fullName
                    ? 'error'
                    : ''
                }
              />

            </div>

            {errors.fullName && (

              <span className="error-message">

                {errors.fullName}

              </span>
            )}

          </div>

          <div className="form-group">

            <label htmlFor="email">

              {t('signup.email')}

            </label>

            <div className="input-wrapper">

              <input
                type="email"
                id="email"
                name="email"
                placeholder={
                  t('signup.emailPlaceholder')
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

              {t('signup.password')}

            </label>

            <div className="input-wrapper">

              <input
                type="password"
                id="password"
                name="password"
                placeholder={
                  t('signup.passwordPlaceholder')
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

            <div className="password-hint">

              <small>
                {t('signup.passwordHint')}
              </small>

            </div>

          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >

            {loading

              ? t('signup.creatingAccount')

              : t('signup.createAccount')}

          </button>

        </form>

        <div className="auth-footer">

          <p>

            {t('signup.hasAccount')}

            {' '}

            <Link
              to="/login"
              className="auth-link"
            >

              {t('signup.signIn')}

            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;