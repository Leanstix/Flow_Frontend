// components/MessageItem.js
import React from 'react';

export const MessageItem = ({ message, isOwnMessage }) => {
  return (
    <div className={`message-item ${isOwnMessage ? 'own' : ''}`}>
      <p>{message.sender.username}: {message.content}</p>
      <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
    </div>
  );
};

export default MessageItem;
