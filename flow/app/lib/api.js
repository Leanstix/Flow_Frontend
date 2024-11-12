import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Base URL for Django backend

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Login function
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Axios response with token and user data if successful
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/login/login/', { email, password });
    const { access, refresh } = response.data;  // Update to retrieve JWT tokens

    // Save tokens in localStorage after receiving them from server
    localStorage.setItem('authToken', access);
    localStorage.setItem('refreshToken', refresh);

    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logout function
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Fetch token for logout only
    const response = await api.post('/login/logout/', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear tokens after logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Register (Sign-Up) function
 * @param {Object} userData - User data for registration
 * @returns {Promise} - Axios response with registration result
 */
export const signUp = async (userData) => {
  try {
    const response = await api.post('/register/', userData); // Update endpoint if necessary
    return response.data;
  } catch (error) {
    console.error('Sign-Up error:', error.response?.data || error.message);
    throw error;
  }
};
