import { useState, useEffect } from "react";
import { fetchConversations, fetchMessages, sendMessage } from "@/app/lib/api";

export default function ChatComponent({ selectedConversationId, setSelectedConversationId, showOnlyConversations, showOnlyMessages }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [expandedMessages, setExpandedMessages] = useState({}); // Track expanded messages

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data || []);
      } catch (error) {
        console.error("Error loading conversations:", error.response?.data || error.message);
      }
    };
    loadConversations();
  }, []);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversationId) return;
    const loadMessages = async () => {
      try {
        const data = await fetchMessages(selectedConversationId);
        setMessages(data || []);
      } catch (error) {
        console.error("Error loading messages:", error.response?.data || error.message);
      }
    };
    loadMessages();
  }, [selectedConversationId]);

  // Close chat on "Escape" key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedConversationId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedConversationId]);

  // Handle message input
  const handleInputChange = (e) => setNewMessage(e.target.value);

  // Handle Enter key (send or newline)
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      await handleSendMessage();
    }
  };

  // Send message
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

  // Handle expanding a message
  const toggleExpandMessage = (messageId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Show conversation list in right sidebar */}
      {showOnlyConversations && (
        <div className="h-full overflow-y-auto">
          <h2 className="text-white text-xl font-bold mb-4">Messages</h2>
          <ul>
          {conversations.map((conversation, index) => (
              <li
                key={conversation.id || index}
                className={`flex items-center gap-3 mb-4 cursor-pointer p-2 rounded-lg ${
                  selectedConversationId === conversation.id ? 'bg-[#070007]' : ''
                }`}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <div className="w-10 h-10 bg-[#070007] rounded-full"></div>
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
      )}

      {/* Show messages in the middle section */}
      {showOnlyMessages && selectedConversationId && (
        <div className="h-full flex flex-col justify-between relative pb-16">
          {/* Messages List */}
          <div className="flex flex-col gap-4 overflow-y-auto flex-grow p-4">
            {messages.map((message) => {
              const isExpanded = expandedMessages[message.id];
              const contentToShow = isExpanded ? message.content : message.content.slice(0, 255);

              return (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg whitespace-pre-line ${message.is_outgoing ? "bg-[#1F062E] self-end" : "bg-[#1F062E] self-start"}`}
                >
                  {contentToShow}
                  {message.content.length > 255 && !isExpanded && (
                    <span className="text-blue-500 cursor-pointer ml-2" onClick={() => toggleExpandMessage(message.id)}>
                      Read more
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border flex items-center gap-2">
            <textarea
              type="text"
              placeholder="Type a message..."
              className="border rounded-lg flex-1 p-2 resize-none"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={2}
            />
            <button className="bg-[#1F062E] text-white py-2 px-4 rounded-lg" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
