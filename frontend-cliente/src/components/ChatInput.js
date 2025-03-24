// src/components/ChatInput.js
import React from 'react';
import './ChatInput.css';

const ChatInput = ({ inputValue, setInputValue, handleSendMessage, loading, disabled }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.ctrlKey) {
      event.preventDefault(); // Evitar que a nova linha seja adicionada
      handleSendMessage();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={loading}
        placeholder="Digite sua mensagem..."
      />
      <button onClick={handleSendMessage} disabled={loading || disabled }>Enviar</button> {/* Disable button when loading is true */}
    </div>
  );
};

export default ChatInput;
