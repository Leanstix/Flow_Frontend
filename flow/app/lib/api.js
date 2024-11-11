import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Base URL for Django backend

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach token if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, error => Promise.reject(error));

/**
 * Login function
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Axios response with token and user data if successful
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/login/login/', { email, password }); // Update with the correct endpoint
    const { token, user_id, email: userEmail } = response.data;

    // Store token in localStorage for subsequent requests
    localStorage.setItem('authToken', token);

    return { token, user_id, email: userEmail };
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
    const response = await api.post('/login/logout/');
    localStorage.removeItem('authToken'); // Remove token on logout
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
