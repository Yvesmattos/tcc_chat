// src/components/ChatInput.js
import React from 'react';
import './ChatInput.css';

const ChatInput = ({ inputValue, setInputValue, handleSendMessage }) => {
  return (
    <div className="chat-input">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
};

export default ChatInput;
