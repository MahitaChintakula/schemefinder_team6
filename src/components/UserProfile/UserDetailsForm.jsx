import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  matchSchemes,
  saveProfile,
} from '../../services/api';
import './UserDetailsForm.css';

const UserDetailsForm = () => {

  const navigate = useNavigate();

  const { t } = useLanguage();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      fullName: '',

      category: '',

      location: '',

      annualIncome: '',

      age: '',

      gender: '',

      occupation: '',

      degree: '',
    });

  const [errors, setErrors] =
    useState({});

  // Check login session
  useEffect(() => {

    const isLoggedIn =
      localStorage.getItem(
        'isLoggedIn'
      );

    if (isLoggedIn !== 'true') {

      navigate('/login');

      return;
    }

    // Auto fill user name
    const currentUser = JSON.parse(

      localStorage.getItem(
        'currentUser'
      )
    );

    if (currentUser) {

      setFormData((prev) => ({

        ...prev,

        fullName:
          currentUser.fullName || '',
      }));
    }

  }, [navigate]);

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

    if (!formData.fullName) {

      newErrors.fullName =
        'Full name is required';
    }

    if (!formData.category) {

      newErrors.category =
        'Category is required';
    }

    if (!formData.location) {

      newErrors.location =
        'State is required';
    }

    if (!formData.age) {

      newErrors.age =
        'Age is required';

    } else if (
      formData.age < 18 ||
      formData.age > 100
    ) {

      newErrors.age =
        'Enter valid age';
    }

    if (!formData.gender) {

      newErrors.gender =
        'Gender is required';
    }

    if (!formData.annualIncome) {

      newErrors.annualIncome =
        'Annual income is required';
    }

    if (!formData.occupation) {

      newErrors.occupation =
        'Occupation is required';
    }

    if (
      formData.occupation ===
        'student' &&
      !formData.degree
    ) {

      newErrors.degree =
        'Degree is required';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {

      // Convert income
      let incomeValue = 0;

      switch (
        formData.annualIncome
      ) {

        case 'below_1lakh':
          incomeValue = 50000;
          break;

        case '1lakh_2lakh':
          incomeValue = 150000;
          break;

        case '2lakh_5lakh':
          incomeValue = 350000;
          break;

        case '5lakh_10lakh':
          incomeValue = 750000;
          break;

        case 'above_10lakh':
          incomeValue = 1200000;
          break;

        default:
          incomeValue = 0;
      }

      // Current logged in user
      const currentUser =
        JSON.parse(

          localStorage.getItem(
            'currentUser'
          )
        );

      // Backend profile data
      const profileData = {

        email:
          currentUser?.email || '',

        fullName:
          formData.fullName,

        age: Number(formData.age),

        gender:
          formData.gender,

        occupation:
          formData.occupation,

        annual_income:
          incomeValue,

        state:
          formData.location,

        caste_category:
          formData.category,

        degree:
          formData.degree,
      };

      console.log(
        'Sending Profile Data:',
        profileData
      );

      // Save profile
      const saveResponse =
        await saveProfile(
          profileData
        );

      console.log(
        'Save Profile Response:',
        saveResponse
      );

      // Match schemes
      const response =
        await matchSchemes(
          profileData
        );

      console.log(
        'Match API Response:',
        response
      );

      let matchedSchemes = [];

      // Handle Lambda body response
      if (
        response &&
        response.body
      ) {

        matchedSchemes =
          typeof response.body ===
          'string'

            ? JSON.parse(
                response.body
              )

            : response.body;

      } else if (
        Array.isArray(response)
      ) {

        matchedSchemes =
          response;
      }

      console.log(
        'Matched Schemes:',
        matchedSchemes
      );

      setLoading(false);

      // Navigate to results
      navigate(
        '/scheme-results',
        {

          state: {

            matchedSchemes,

            userProfile:
              profileData,
          },
        }
      );

    } catch (error) {

      console.error(
        'Backend Error:',
        error
      );

      alert(
        'Error connecting to backend'
      );

      setLoading(false);
    }
  };

  return (

    <div className="profile-container">

      <div className="profile-card">

        <div className="profile-header">

          <h2>
            {t('userProfile.title')}
          </h2>

          <p>
            {t('userProfile.subtitle')}
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={handleChange}
            />

            {errors.fullName && (

              <span className="error-message">

                {
                  errors.fullName
                }

              </span>
            )}

          </div>

          {/* Category */}
          <div className="form-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={
                formData.category
              }
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="general">
                General
              </option>

              <option value="obc">
                OBC
              </option>

              <option value="sc">
                SC
              </option>

              <option value="st">
                ST
              </option>

            </select>

            {errors.category && (

              <span className="error-message">

                {
                  errors.category
                }

              </span>
            )}

          </div>

          {/* Age */}
          <div className="form-group">

            <label>
              Age
            </label>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />

            {errors.age && (

              <span className="error-message">

                {errors.age}

              </span>
            )}

          </div>

          {/* Gender */}
          <div className="form-group">

            <label>
              Gender
            </label>

            <select
              name="gender"
              value={
                formData.gender
              }
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

            </select>

            {errors.gender && (

              <span className="error-message">

                {
                  errors.gender
                }

              </span>
            )}

          </div>

          {/* State */}
          <div className="form-group">

            <label>
              State
            </label>

            <input
              type="text"
              name="location"
              value={
                formData.location
              }
              onChange={handleChange}
            />

            {errors.location && (

              <span className="error-message">

                {
                  errors.location
                }

              </span>
            )}

          </div>

          {/* Income */}
          <div className="form-group">

            <label>
              Annual Income
            </label>

            <select
              name="annualIncome"
              value={
                formData.annualIncome
              }
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="below_1lakh">
                Below 1 Lakh
              </option>

              <option value="1lakh_2lakh">
                1-2 Lakh
              </option>

              <option value="2lakh_5lakh">
                2-5 Lakh
              </option>

              <option value="5lakh_10lakh">
                5-10 Lakh
              </option>

              <option value="above_10lakh">
                Above 10 Lakh
              </option>

            </select>

            {errors.annualIncome && (

              <span className="error-message">

                {
                  errors.annualIncome
                }

              </span>
            )}

          </div>

          {/* Occupation */}
          <div className="form-group">

            <label>
              Occupation
            </label>

            <select
              name="occupation"
              value={
                formData.occupation
              }
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="student">
                Student
              </option>

              <option value="farmer">
                Farmer
              </option>

              <option value="business">
                Business
              </option>

              <option value="unemployed">
                Unemployed
              </option>

            </select>

            {errors.occupation && (

              <span className="error-message">

                {
                  errors.occupation
                }

              </span>
            )}

          </div>

          {/* Degree */}
          {formData.occupation ===
            'student' && (

            <div className="form-group">

              <label>
                Degree
              </label>

              <input
                type="text"
                name="degree"
                value={
                  formData.degree
                }
                onChange={handleChange}
              />

              {errors.degree && (

                <span className="error-message">

                  {
                    errors.degree
                  }

                </span>
              )}

            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >

            {loading
              ? 'Loading...'
              : 'Find Schemes'}

          </button>

        </form>

      </div>

    </div>
  );
};

export default UserDetailsForm;