import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

//---------------------- Login Function --------------------

export const login = async (email, password) => {
  try {
    const response = await api.post('/login/', { email, password });
    if (!response?.data?.access || !response?.data?.refresh) {
      throw new Error('Invalid token structure received from server');
    }
    localStorage.setItem('authToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Logout Function --------------------

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log(refreshToken)
    if (!refreshToken) {
      throw new Error('No refresh token found.');
    }
    const response = await api.post(
      '/logout/',
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

//------------------ token getter --------------------------

export const refreshToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      throw new Error('Refresh token not found.');
    }

    const response = await api.post(
      '/token/generate-access-token/',
      {}, 
      {
        headers: {
          Authorization: `Bearer ${storedRefreshToken}`,
        },
      }
    );

    localStorage.setItem('authToken', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    throw error;
  }
};

//----------------------- User Registration -----------------------

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
export const UserProfileUpdate = async (formData) => {
  try {
    const access_token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data',
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

export const updateUserProfile = async (formData) => {
  try {
    const access_token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    
    // Ensure the form data is JSON-formatted, as required by the API
    const response = await api.patch('/profile/update/', formData, config);
    return response.data;
  } catch (error) {
    console.error('Profile Update error:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Get posts --------------------

export const getPosts = async () => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get('/posts/', config);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error.response?.data || error.message);
    throw error;
  }
};

// -----------------------Create Posts ----------------------

export const createPost = async (content) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post('/posts/', { content }, config);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error.response?.data || error.message);
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
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      throw new Error("No authToken found in localStorage");
    }

    console.log("Creating conversation with participants:", participants);
    const response = await api.post(
      "/conversations/",
      { participants },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * Fetch all conversations for the logged-in user
 * @returns {Promise} - Axios response with list of conversations
 */
export const fetchConversations = async () => {
  try {
    const accessToken = localStorage.getItem("authToken");
    const response = await api.get("/conversations/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error.response?.data || error.message);
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
    const accessToken = localStorage.getItem("authToken");
    const response = await api.get(`/conversations/${conversationId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation:", error.response?.data || error.message);
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
    const accessToken = localStorage.getItem("authToken");
    const response = await api.delete(`/conversations/${conversationId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting conversation:", error.response?.data || error.message);
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
    const accessToken = localStorage.getItem("authToken");
    const response = await api.post(
      "/messages/",
      { conversation: conversationId, content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchMessages = async (conversationId) => {
  try {
    const accessToken = localStorage.getItem("authToken");
    const response = await api.get(`/conversations/${conversationId}/messages/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error.response?.data || error.message);
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
    const accessToken = localStorage.getItem("authToken");
    const response = await api.patch(
      `/messages/${messageId}/`,
      { is_read: true },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking message as read:", error.response?.data || error.message);
    throw error;
  }
};



// -----------------Send flow request -------------------
export const sendFriendRequest = async (toUserId) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post('/friend-requests/', { to_user_id: toUserId }, config);
    return response.data;
  } catch (error) {
    console.error('Error sending friend request:', error.response?.data || error.message);
    throw error;
  }
};

// -----------------Accept flow request -------------------------

export const acceptFriendRequest = async (friendRequestId) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.patch(`/friend-requests/${friendRequestId}/`, {}, config);
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error.response?.data || error.message);
    throw error;
  }
};

// ----------------- Get Friends ---------------------

export const getFriends = async () => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get('/friends/', config);
    return response.data;
  } catch (error) {
    console.error('Error retrieving friends:', error.response?.data || error.message);
    throw error;
  }
};

// -----------------Get flow requests ---------------------

export const getFriendRequests = async () => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get('/friend-requests/', config);
    return response.data;
  } catch (error) {
    console.error('Error retrieving friend requests:', error.response?.data || error.message);
    throw error;
  }
};

// -----------------Search users ---------------------

export const searchUsers = async (query) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get('/search/', { params: { q: query }, ...config });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error.response?.data || error.message);
    throw error;
  }
};

// --------------------- Like post ----------------------

export const toggleLike = async (postId) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post(`/posts/${postId}/like/`, {}, config);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// ------------------------ add comment -----------------------

export const addComment = async (postId, content) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post(`/posts/${postId}/comment/`, { content }, config);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// ------------------------ Fetch Comments ------------------------

/**
 * Fetch comments for a specific post with pagination
 * @param {string} postId - The ID of the post
 * @param {number} page - The page number for pagination (optional, defaults to 1)
 * @returns {Promise} - Axios response with comments data
 */
export const fetchComments = async (postId, page = 1) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 10, page }, // Limiting results to 10 comments per request
    };
    const response = await api.get(`/posts/${postId}/comments/`, config);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error.response?.data || error.message);
    throw error;
  }
};

// ----------------------- repost ---------------------------

export const repost = async (postId) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post(`/posts/${postId}/repost/`, {}, config);
    return response.data;
  } catch (error) {
    console.error('Error reposting:', error);
    throw error;
  }
};

// ------------------ report post -----------------------

export const reportPost = async (postId) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post(`/posts/${postId}/report/`, {}, config);
    return response.data;
  } catch (error) {
    console.error('Error reporting post:', error);
    throw error;
  }
};

// -----------------Search posts not created by the authorized user ---------------------
export const searchPostsNotByUser = async (query, page = 1, limit = 10) => {
  try {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      throw new Error("User is not authenticated. Token missing.");
    }

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const response = await api.get("/posts/search/not-by-user/", {
      params: { q: query, page, limit }, // Include pagination params
      ...config,
    });

    return response.data; // Backend should return paginated response with metadata
  } catch (error) {
    console.error(
      "Error searching posts not created by the user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// -----------------Search posts created by the authorized user ---------------------
export const searchPostsByUser = async (query = "", page = 1, limit = 10) => {
  try {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      throw new Error("User is not authenticated. Token missing.");
    }

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const response = await api.get("/posts/search/by-user/", {
      params: { q: query.trim(), page, limit }, // Ensure query is trimmed
      ...config,
    });

    return response.data; // Return paginated response
  } catch (error) {
    console.error(
      "Error searching posts created by the user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//---------------------- Fetch All Advertisements --------------------
export const fetchAdvertisements = async () => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get('/adds/', config);
    return response.data;
  } catch (error) {
    console.error('Error fetching advertisements:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Create Advertisement --------------------
export const createAdvertisement = async (advertisementData) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post('/adds/create/', advertisementData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating advertisement:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Fetch Advertisement Details --------------------
export const fetchAdvertisementDetails = async (adId) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get(`/adds/${adId}/`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching advertisement details:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Send Message to Seller --------------------
export const sendMessageToSeller = async (messageData) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post(`/adds/messages/send/`, messageData, config);
    return response.data;
  } catch (error) {
    console.error('Error sending message to seller:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Fetch Seller Messages --------------------
export const fetchSellerMessages = async () => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get(`/adds/messages/seller/`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching seller messages:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Fetch Customer Messages --------------------
export const fetchCustomerMessages = async () => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get(`/adds/messages/customer/`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer messages:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Reply to Message --------------------
export const replyMessage = async (replyData) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.post(`/adds/messages/reply/`, replyData, config);
    return response.data;
  } catch (error) {
    console.error('Error replying to customer message:', error.response?.data || error.message);
    throw error;
  }
};

//---------------------- Fetch Replies for Customer --------------------
export const fetchRepliesForCustomer = async (adId) => {
  try {
    const accessToken = localStorage.getItem('authToken');
    if (!accessToken) {
      throw new Error('User is not authenticated. Token missing.');
    }
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };
    const response = await api.get(`/adds/${adId}/messages/replies/`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching replies for customer:', error.response?.data || error.message);
    throw error;
  }
};
