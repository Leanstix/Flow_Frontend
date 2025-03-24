"use client";
import React, { useState, useEffect } from 'react';
import { fetchConversations, fetchMessages, sendMessage } from '@/app/lib/api';
import { IoArrowBack } from 'react-icons/io5';

export default function ChatComponent({ selectedConversationId, setSelectedConversationId, isSidebarMode }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [expandedMessages, setExpandedMessages] = useState({});
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  // Fetch all conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data || []);
      } catch (error) {
        console.error('Error loading conversations:', error.response?.data || error.message);
      }
    };
    loadConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;
    const loadMessages = async () => {
      try {
        const data = await fetchMessages(selectedConversationId);
        setMessages(data || []);
      } catch (error) {
        console.error('Error loading messages:', error.response?.data || error.message);
      }
    };
    loadMessages();
  }, [selectedConversationId]);

  // Handle Escape key to close chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedConversationId) {
        setSelectedConversationId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedConversationId]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    try {
      const message = await sendMessage(selectedConversationId, newMessage);
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Conversations List (Right Sidebar Mode) */}
      {isSidebarMode && !selectedConversationId && (
        <div className="h-full overflow-y-auto">
          <h2 className="text-white text-xl font-bold mb-4">Messages</h2>
          <ul>
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                className="flex items-center gap-3 mb-4 cursor-pointer p-2 rounded-lg hover:bg-gray-800"
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="text-white font-bold">{conversation.name || 'Unnamed Chat'}</p>
                  <p className="text-white text-sm">
                    {conversation.last_message?.content?.slice(0, 10) || 'No messages yet'}...
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Section (Middle Section) */}
      {!isSidebarMode && selectedConversationId && (
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 overflow-y-auto h-96">
            {messages.map((message) => (
              <div key={message.id} className={`p-3 rounded-lg ${message.is_outgoing ? 'bg-pink-400 self-end' : 'bg-pink-300 self-start'}`}>
                {message.content}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-2 mt-4">
            <textarea
              placeholder="Enter message"
              className="border rounded-lg flex-1 p-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="bg-pink-400 text-white py-2 px-4 rounded-lg" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
