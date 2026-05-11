export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const ENDPOINTS = {

  GET_SCHEMES:
    `${API_BASE_URL}/schemes`,

  MATCH_SCHEMES:
    `${API_BASE_URL}/match`,

  SAVE_PROFILE:
    `${API_BASE_URL}/save-profile`,
};
