import { ENDPOINTS, API_BASE_URL } from '../config/api';

export const signupUser = async (userData) => {

  const response = await fetch(
    `${API_BASE_URL}/signup`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (data.body) {
    data.body = JSON.parse(data.body);
  }

  return data;
};


export const loginUser = async (userData) => {

  const response = await fetch(
    `${API_BASE_URL}/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (data.body) {
    data.body = JSON.parse(data.body);
  }

  return data;
};

export const getAllSchemes = async () => {

  const response = await fetch(
    ENDPOINTS.GET_SCHEMES
  );

  if (!response.ok) {
    throw new Error('Failed to fetch schemes');
  }

  return response.json();
};


export const matchSchemes = async (
  userData
) => {

  const response = await fetch(
    ENDPOINTS.MATCH_SCHEMES,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to match schemes');
  }

  return response.json();
};


export const saveProfile = async (
  profileData
) => {

  const response = await fetch(
    ENDPOINTS.SAVE_PROFILE,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(profileData),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to save profile');
  }

  return response.json();
};
