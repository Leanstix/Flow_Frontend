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
    const { access, refresh } = response.data;

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
    const token = localStorage.getItem('authToken');
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
    const response = await api.post('/register/', userData);
    return response.data;
  } catch (error) {
    console.error('Sign-Up error:', error.response?.data || error.message);
    throw error;
  }
};

// ------------------------ User Profile Update ------------------------

/**
 * Update User Profile
 * @param {Object} formData - User profile data
 * @returns {Promise} - Axios response with updated profile data
 */
export const updateUserProfile = async (formData) => {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    
    // Ensure the form data is JSON-formatted, as required by the API
    const response = await api.put('/profile/update/', formData, config);
    return response.data;
  } catch (error) {
    console.error('Profile Update error:', error.response?.data || error.message);
    throw error;
  }
};

// ------------------------ Messaging API Calls ------------------------

/**
 * Create a new conversation
 * @param {Array} participants - List of participant IDs
 * @returns {Promise} - Axios response with created conversation data
 */
export const createConversation = async (participants) => {
  try {
    const response = await api.post('/conversations/', { participants });
    return response.data;
  } catch (error) {
    console.error('Error creating conversation:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch all conversations for the logged-in user
 * @returns {Promise} - Axios response with list of conversations
 */
export const fetchConversations = async () => {
  try {
    const response = await api.get('/conversations/');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch a single conversation by ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - Axios response with conversation details
 */
export const fetchConversation = async (conversationId) => {
  try {
    const response = await api.get(`/conversations/${conversationId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a conversation by ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - Axios response with delete result
 */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/conversations/${conversationId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting conversation:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send a new message in a conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} content - Message content
 * @returns {Promise} - Axios response with created message data
 */
export const sendMessage = async (conversationId, content) => {
  try {
    const response = await api.post('/messages/', { conversation: conversationId, content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch all messages in a conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - Axios response with list of messages
 */
export const fetchMessages = async (conversationId) => {
  try {
    const response = await api.get(`/conversations/${conversationId}/messages/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mark a message as read
 * @param {string} messageId - Message ID
 * @returns {Promise} - Axios response with updated message data
 */
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await api.patch(`/messages/${messageId}/`, { is_read: true });
    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error.response?.data || error.message);
    throw error;
  }
};
