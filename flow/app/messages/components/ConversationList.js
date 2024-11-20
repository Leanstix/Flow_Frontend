"use client";
import React, { useEffect, useState } from 'react';
import { fetchConversations } from '../../lib/api'; // Import from your API file
import { useRouter } from 'next/navigation';

export const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };
    loadConversations();
  }, []);

  const openConversation = (conversationId) => {
    router.push(`/conversations/${conversationId}`);
  };

  return (
    <div className="conversation-list">
      <h2>Conversations</h2>
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => openConversation(conv.id)}
          className="conversation-item"
        >
          <p>{conv.participants.map(user => user.username).join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
