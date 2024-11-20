// components/CreateConversation.js
import React, { useState } from 'react';
import { createConversation } from '../../lib/api';

export const CreateConversation = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]); // Load this list from your backend or context

  const handleCreateConversation = async () => {
    try {
      await createConversation(selectedUsers.map(user => user.id));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div className="create-conversation">
      <h2>Start New Conversation</h2>
      <select multiple onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, option => option.value))}>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>
      <button onClick={handleCreateConversation}>Create Conversation</button>
    </div>
  );
};

export default CreateConversation;
