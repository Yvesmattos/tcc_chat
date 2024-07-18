// src/components/ChatMessage.js
import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  return (
    <div className={`container-message-${message.type}`}>
      <div className={`chat-message ${message.type}`}>
        <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
      </div>
    </div>
  );
};

export default ChatMessage;
