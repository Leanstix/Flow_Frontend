'use client';

import React, { useState } from 'react';
import { searchUsers, sendMessage, sendFriendRequest } from '@/app/lib/api';
import { useRouter } from 'next/navigation';

const FriendSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const router = useRouter();

  const handleUserClick = (userName) => {
    router.push(`/profile/${userName}`);
  };

  // Handle search input change with debounce
  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the messaging modal
  const handleMessage = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!selectedUser || !messageContent.trim()) return;

    try {
      const conversationId = selectedUser.conversation_id; // Assume conversation_id is part of user data
      await sendMessage(conversationId, messageContent);
      alert('Message sent!');
      setMessageContent('');
      setShowModal(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Error sending message.');
    }
  };

  // Handle sending a friend request
  const handleAddMate = async (userId) => {
    try {
      await sendFriendRequest(userId);
      setSentRequests((prev) => [...prev, userId]);
    } catch (error) {
      console.error('Failed to send friend request:', error);
      alert('Error sending friend request.');
    }
  };

  return (
    <div className="block justify-center h-screen bg-white">
      {/* Search Bar */}
      <div className="flex w-96 p-6 bg-white rounded-[30px] mx-auto">
        <input
          type="text"
          placeholder="Search Flowmates"
          className="text-center w-full border rounded-lg h-9"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Search Results */}
      <div>
        {loading && <div className="text-center mt-4">Loading...</div>}
        {!loading && searchResults.length === 0 && searchQuery && (
          <div className="text-center mt-4">No results found.</div>
        )}

        {searchResults.map((user) => (
          <div key={user.id} className="flex m-4 w-fit mx-auto items-center">
            <div className="col-span-2 border w-[80px] h-[80px] rounded-full flex items-center justify-center bg-gray-200">
              {/* Replace with actual profile picture */}
              <span className="text-gray-500">
                <button onClick={() => handleUserClick(user.user_name)}>
                  {user.user_name ? user.user_name[0] : user.email[0]}
                </button>
              </span>
            </div>
            <div className="justify-start col-span-7 grid grid-rows-3 items-left ml-4">
              <div className="row-span-1 text-[18px] font-medium">
                {user.user_name || user.email}
              </div>
              <div className="row-span-2 text-sm text-gray-500">
                {user.bio || 'No bio available'}
              </div>
            </div>
            <div className="ml-4">
              {user.is_friends ? (
                <button
                  className="w-[84px] rounded-lg p-1 bg-purple-600 text-white"
                  onClick={() => handleMessage(user)}
                >
                  Message
                </button>
              ) : (
                <button
                  className={`w-[84px] rounded-lg p-1 ${
                    sentRequests.includes(user.id)
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-purple-600 text-white'
                  }`}
                  onClick={() => handleAddMate(user.id)}
                  disabled={sentRequests.includes(user.id)}
                >
                  {sentRequests.includes(user.id) ? 'Pending' : 'Add Friend'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Messaging Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Message {selectedUser.user_name || selectedUser.email}</h2>
            <textarea
              className="w-full border rounded-lg p-2 mb-4"
              rows="4"
              placeholder="Type your message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendSearch;
