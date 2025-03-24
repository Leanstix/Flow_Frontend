"use client";

import React, { useState, useEffect } from "react";
import { fetchConversations, fetchMessages, sendMessage } from "@/app/lib/api";
import { IoArrowBack } from "react-icons/io5";

export default function ChatComponent() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close chat on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedConversationId) {
        setSelectedConversationId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedConversationId]);

  // Fetch conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data || []);
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };
    loadConversations();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversationId) return;
    const loadMessages = async () => {
      try {
        const data = await fetchMessages(selectedConversationId);
        setMessages(data || []);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();
  }, [selectedConversationId]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    try {
      const message = await sendMessage(selectedConversationId, newMessage);
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Expand long messages
  const toggleExpandMessage = (messageId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  // Handle attachment options
  const handleAttachmentClick = () => setShowAttachmentOptions(!showAttachmentOptions);

  const handleOptionClick = (option) => {
    setShowAttachmentOptions(false);
    if (option === "photos_videos") document.getElementById("photoVideoInput").click();
    if (option === "document") document.getElementById("documentInput").click();
    if (option === "camera") {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => console.log("Camera accessed:", stream))
        .catch((error) => console.error("Error accessing camera:", error));
    }
  };

  // Handle Enter key to send or add new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-screen flex">
      {/* Conversations Sidebar */}
      {(isMobileView && !selectedConversationId) || !isMobileView ? (
        <div className={`${isMobileView ? "w-full" : "w-1/5"} bg-[#070007] p-4 overflow-y-auto`}>
          <h2 className="text-white text-xl font-bold mb-4">Messages</h2>
          <ul>
            {conversations.map((conversation, index) => (
              <li
                key={conversation.id || index}
                className={`flex items-center gap-3 mb-4 cursor-pointer p-2 rounded-lg ${
                  selectedConversationId === conversation.id ? "bg-[#070007]" : ""
                }`}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <div className="w-10 h-10 bg-[#070007] rounded-full"></div>
                <div>
                  <p className="text-white font-bold">{conversation.name || "Unnamed Conversation"}</p>
                  <p className="text-white text-sm">
                    {conversation.last_message?.content?.slice(0, 10) + "..." || "No messages yet"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Chat Window */}
      {(!isMobileView || selectedConversationId) && (
        <div className={`${isMobileView ? "w-full" : "w-4/5"} bg-[#070007] p-4 flex flex-col justify-between`}>
          {isMobileView && selectedConversationId && (
            <div className="flex items-center gap-2 mb-4">
              <IoArrowBack className="text-pink-400 text-2xl cursor-pointer" onClick={() => setSelectedConversationId(null)} />
              <h2 className="text-xl font-bold">Chat</h2>
            </div>
          )}

          {/* Message List */}
          <div className="flex flex-col gap-4 overflow-y-auto h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg whitespace-pre-wrap ${
                  message.is_outgoing ? "bg-pink-400 self-end" : "bg-pink-300 self-start"
                }`}
                style={{ maxWidth: "70%" }}
              >
                {expandedMessages[message.id] ? message.content : message.content.slice(0, 255)}
                {message.content.length > 255 && !expandedMessages[message.id] && (
                  <span className="text-blue-500 cursor-pointer ml-2" onClick={() => toggleExpandMessage(message.id)}>
                    Read more
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          {selectedConversationId && (
            <div className="relative flex items-center gap-2 mt-4">
              <button className="bg-pink-400 text-white py-2 px-4 rounded-lg" onClick={handleAttachmentClick}>
                Attachment
              </button>

              {showAttachmentOptions && (
                <div className="absolute bottom-12 left-0 bg-[#070007] border rounded-lg shadow-lg p-2">
                  <ul>
                    <li className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleOptionClick("photos_videos")}>
                      Photos & Videos
                    </li>
                    <li className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleOptionClick("camera")}>
                      Camera
                    </li>
                    <li className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleOptionClick("document")}>
                      Document
                    </li>
                  </ul>
                </div>
              )}

              <textarea
                className="border rounded-lg flex-1 p-2"
                placeholder="Enter message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="bg-pink-400 text-white py-2 px-4 rounded-lg" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          )}

          {/* Hidden File Inputs */}
          <input type="file" id="photoVideoInput" accept="image/*,video/*" style={{ display: "none" }} />
          <input type="file" id="documentInput" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} />
        </div>
      )}
    </div>
  );
}
