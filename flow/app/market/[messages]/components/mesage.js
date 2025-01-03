"use client";

import { useState, useEffect } from "react";
import {
  fetchSellerMessages,
  //replyToCustomerMessage,
  fetchRepliesForCustomer,
} from "@/app/lib/api";

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchSellerMessages();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    loadMessages();
  }, []);

  const handleReply = async (messageId) => {
    try {
      const replyData = { content: newReply };
      //await replyToCustomerMessage(selectedMessage.adId, messageId, replyData);
      alert("Reply sent successfully");
      setNewReply("");
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  const handleViewReplies = async (message) => {
    try {
      const replies = await fetchRepliesForCustomer(message.adId);
      setSelectedMessage({ ...message, replies });
    } catch (err) {
      console.error("Failed to fetch replies", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Customer Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Message List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages available.</p>
          ) : (
            <ul className="space-y-4">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewReplies(message)}
                >
                  <p className="font-medium">{message.customerName}</p>
                  <p className="text-gray-600 text-sm">{message.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Replies and Reply Form */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Replies</h2>
          {selectedMessage ? (
            <>
              <div className="mb-4">
                <h3 className="font-medium">{selectedMessage.customerName}</h3>
                <p className="text-gray-600">{selectedMessage.content}</p>
              </div>
              <ul className="space-y-3 mb-4">
                {selectedMessage.replies && selectedMessage.replies.length > 0 ? (
                  selectedMessage.replies.map((reply) => (
                    <li
                      key={reply.id}
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      <p className="text-gray-700">{reply.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reply.timestamp).toLocaleString()}
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No replies yet.</p>
                )}
              </ul>
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Type your reply..."
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <button
                onClick={() => handleReply(selectedMessage.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send Reply
              </button>
            </>
          ) : (
            <p className="text-gray-500">Select a message to view replies and reply.</p>
          )}
        </div>
      </div>
    </div>
  );
}
