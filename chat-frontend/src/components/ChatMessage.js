// src/components/ChatMessage.js
import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.type}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default ChatMessage;
