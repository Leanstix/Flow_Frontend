import { useState, useEffect } from "react";
import { fetchConversations, fetchMessages } from "../api/chatApi";

export default function ChatComponent({ selectedConversationId, setSelectedConversationId, showOnlyConversations, showOnlyMessages }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedConversationId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedConversationId]);

  return (
    <div className="h-full flex flex-col">
      {/* Show conversation list in right sidebar */}
      {showOnlyConversations && (
        <div className="h-full overflow-y-auto">
          <h2 className="text-white text-xl font-bold mb-4">Messages</h2>
          <ul>
            {conversations.map((conversation, index) => (
              <li 
                key={conversation.id || index} 
                className={`p-2 rounded-lg cursor-pointer ${selectedConversationId === conversation.id ? "bg-gray-700" : ""}`}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <p className="text-white font-bold">{conversation.name || "Unnamed Conversation"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show messages in the middle section */}
      {showOnlyMessages && selectedConversationId && (
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 overflow-y-auto h-96">
            {messages.map((message) => (
              <div key={message.id} className={`p-3 rounded-lg ${message.is_outgoing ? "bg-pink-400 self-end" : "bg-pink-300 self-start"}`}>
                {message.content}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <textarea
              type="text"
              placeholder="Enter message"
              className="border rounded-lg flex-1 p-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="bg-pink-400 text-white py-2 px-4 rounded-lg" onClick={() => {}}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
