"use client";

import React, { useState, useEffect } from 'react';
import { fetchConversations, fetchMessages, sendMessage } from '@/app/lib/api'; // Ensure these API functions are correctly implemented
import { IoArrowBack } from 'react-icons/io5';

export default function ChatComponent() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({}); // Track expanded messages
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close chat on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedConversationId) {
        setSelectedConversationId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedConversationId]);

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

  // Handle back navigation in mobile view
  const handleBack = () => {
    setSelectedConversationId(null);
  };

  // Handle expanding a message
  const toggleExpandMessage = (messageId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleAttachmentClick = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  const handleOptionClick = (option) => {
    setShowAttachmentOptions(false);
  
    switch (option) {
      case 'photos_videos':
        // Open file manager for photos & videos
        document.getElementById('photoVideoInput').click();
        break;
  
      case 'camera':
        // Open camera (requires media capture API)
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            console.log("Camera accessed:", stream);
            // Handle stream or display camera UI
          })
          .catch((error) => {
            console.error("Error accessing camera:", error);
          });
        break;
  
      case 'document':
        // Open file manager for documents
        document.getElementById('documentInput').click();
        break;
  
      default:
        break;
    }
  };

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar for conversations */}
      {(isMobileView && !selectedConversationId) || !isMobileView ? (
        <div
          className={`${
            isMobileView ? 'w-full' : 'w-1/5'
          } bg-pink-400 p-4 overflow-y-auto`}
        >
          <h2 className="text-white text-xl font-bold mb-4">Messages</h2>
          <ul>
            {conversations.map((conversation, index) => (
              <li
                key={conversation.id || index}
                className={`flex items-center gap-3 mb-4 cursor-pointer p-2 rounded-lg ${
                  selectedConversationId === conversation.id ? 'bg-pink-500' : ''
                }`}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <div className="w-10 h-10 bg-white rounded-full"></div>
                <div>
                  <p className="text-white font-bold">
                    {conversation.name || 'Unnamed Conversation'}
                  </p>
                  <p className="text-white text-sm">
                    {conversation.last_message.content.length > 10
                      ? conversation.last_message.content.slice(0, 10) + '...'
                      : conversation.last_message.content || 'No messages yet'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Chat section */}
      {(!isMobileView || selectedConversationId) && (
        <div
          className={`${
            isMobileView ? 'w-full' : 'w-4/5'
          } bg-white p-4 flex flex-col justify-between`}
        >
          {isMobileView && selectedConversationId && (
            <div className="flex items-center gap-2 mb-4">
              <IoArrowBack
                className="text-pink-400 text-2xl cursor-pointer"
                onClick={handleBack}
              />
              <h2 className="text-xl font-bold">Chat</h2>
            </div>
          )}

          {!selectedConversationId && !isMobileView ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-xl">Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 overflow-y-auto h-96">
                {(messages || []).map((message) => {
                  const isExpanded = expandedMessages[message.id];
                  const contentToShow = isExpanded
                    ? message.content
                    : message.content.slice(0, 255);

                  return (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg whitespace-pre-wrap ${
                        message.is_outgoing ? 'bg-pink-400 self-end' : 'bg-pink-300 self-start'
                      }`}
                      style={{ maxWidth: '70%' }}
                    >
                      {contentToShow}
                      {message.content.length > 255 && !isExpanded && (
                        <span
                          className="text-blue-500 cursor-pointer ml-2"
                          onClick={() => toggleExpandMessage(message.id)}
                        >
                          Read more
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Input Section */}
              {selectedConversationId && (
                <div className="relative flex items-center gap-2 mt-4">
                  <button
                    className="bg-pink-400 text-white py-2 px-4 rounded-lg"
                    onClick={handleAttachmentClick}
                  >
                    Attachment
                  </button>
                  {showAttachmentOptions && (
                    <div className="absolute bottom-12 left-0 bg-white border rounded-lg shadow-lg p-2">
                      <ul>
                        <li
                          className="cursor-pointer p-2 hover:bg-gray-200"
                          onClick={() => handleOptionClick('photos_videos')}
                        >
                          Photos & Videos
                        </li>
                        <li
                          className="cursor-pointer p-2 hover:bg-gray-200"
                          onClick={() => handleOptionClick('camera')}
                        >
                          Camera
                        </li>
                        <li
                          className="cursor-pointer p-2 hover:bg-gray-200"
                          onClick={() => handleOptionClick('document')}
                        >
                          Document
                        </li>
                      </ul>
                    </div>
                  )}
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
