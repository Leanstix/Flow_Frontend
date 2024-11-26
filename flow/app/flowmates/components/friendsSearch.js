'use client';

import React, { useState } from 'react';
import { searchUsers, sendFriendRequest } from '../../lib/api';

const FriendSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle search input change
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
      setSearchResults(results); // Assume the API returns an array of user objects
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a friend request
  const handleAddMate = async (userId) => {
    try {
      const response = await sendFriendRequest(userId);
      alert('Flow request sent successfully!');
    } catch (error) {
      console.error('Failed to send flow request:', error);
      alert('Error sending flow request.');
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
            <div className="col-span-2 border w-[80px] h-[80px] rounded-full">
              {/* Profile Picture Placeholder */}
            </div>
            <div className="justify-start col-span-7 grid grid-rows-3 items-left ml-4">
              <div className="row-span-1 text-[18px] font-medium">{user.email}</div>
              <div className="row-span-2 text-sm text-gray-500">{user.bio || 'No bio available'}</div>
            </div>
            <div className="ml-4">
              <button
                className="bg-purple-600 w-[84px] text-white rounded-lg p-1"
                onClick={() => handleAddMate(user.id)}
              >
                Add Mate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSearch;