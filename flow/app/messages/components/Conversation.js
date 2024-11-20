"use client";
import React, { useEffect, useState } from 'react';
import { fetchConversation, sendMessage, fetchMessages } from '../../lib/api';
import { useRouter } from 'next/navigation';

export const Conversation = () => {
  const router = useRouter();
  const conversationId = router.query?.conversationId;
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (conversationId) {
      const loadConversation = async () => {
        try {
          const data = await fetchConversation(conversationId);
          setConversation(data);
          const msgData = await fetchMessages(conversationId);
          setMessages(msgData);
        } catch (error) {
          console.error('Error loading conversation:', error);
        }
      };
      loadConversation();
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const message = await sendMessage(conversationId, newMessage);
        setMessages([...messages, message]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="conversation">
      <h2>Conversation</h2>
      <div className="message-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender.id === conversation?.currentUserId ? 'own' : ''}`}
          >
            <p>
              {msg.sender.username}: {msg.content}
            </p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Conversation;
