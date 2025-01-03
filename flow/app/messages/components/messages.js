'use client';

import React, { useState, useEffect } from 'react';
import { fetchConversations, fetchMessages, sendMessage } from '@/app/lib/api'; // Ensure these API functions are correctly implemented

export default function ChatComponent() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch all conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data || []); // Ensure it's always an array
      } catch (error) {
        console.error('Error loading conversations:', error.response?.data || error.message);
      }
    };
    loadConversations();
  }, []);

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;
    const loadMessages = async () => {
      try {
        const data = await fetchMessages(selectedConversationId);
        console.log(data)
        setMessages(data || []); // Ensure it's always an array
      } catch (error) {
        console.error('Error loading messages:', error.response?.data || error.message);
      }
    };
    loadMessages();
  }, [selectedConversationId]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    try {
      const message = await sendMessage(selectedConversationId, newMessage);
      setMessages((prev) => [...prev, message]); // Append new message to state
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-pink-10 flex items-center justify-center">
      <div className="bg-pink-300 h-full flex shadow-lg">
        {/* Sidebar */}
        <div className="w-1/4 bg-pink-400 p-4 rounded-l-lg">
          <h2 className="text-white text-xl font-bold mb-4">Messages</h2>
          <ul>
            {conversations.map((conversation, index) => (
              <li
                key={conversation.id || index}
                className={`flex items-center gap-3 mb-4 cursor-pointer ${
                  selectedConversationId === conversation.id ? 'bg-pink-500' : ''
                }`}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <div className="w-10 h-10 bg-white rounded-full"></div>
                <div>
                  <p className="text-white font-bold">{conversation.name || "Unnamed Conversation"}</p>
                  <p className="text-white text-sm">{conversation.last_message.content || "No messages yet"}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Section */}
        <div className="w-3/4 bg-white p-4 flex flex-col justify-between rounded-r-lg">
          <div className="flex flex-col gap-4 overflow-y-auto h-96">
            {(messages || []).map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.is_outgoing ? 'bg-pink-400 self-end' : 'bg-pink-300 self-start'
                }`}
                style={{ maxWidth: '70%' }}
              >
                {message.content || 'No content available'}
              </div>
            ))}
          </div>

          {/* Input Section */}
          {selectedConversationId && (
            <div className="flex items-center gap-2 mt-4">
              <button className="bg-pink-400 text-white py-2 px-4 rounded-lg">
                Attachment
              </button>
              <textarea
                type="text"
                placeholder="Enter message"
                className="border rounded-lg flex-1 p-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="bg-pink-400 text-white py-2 px-4 rounded-lg"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
