// src/components/ChatModal.js
import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import FeedbackButtons from './FeedbackButtons';
import useWebSocket from './WebSocketHandler';
import './ChatModal.css';

const ChatModal = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const [isHumanSupport, setIsHumanSupport] = useState(false);
  const { sendMessage } = useWebSocket(isHumanSupport, setMessages, setIsHumanSupport);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendMessage = async () => {
    if (isHumanSupport) {
      sendMessage(inputValue);
      setMessages((prevMessages) => [...prevMessages, { type: 'user', text: inputValue }]);
      setInputValue('');
    } else {
      const newMessage = { type: 'user', text: inputValue };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue('');

      const response = await fetch('http://localhost:5001/chat/send_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pergunta: inputValue })
      });

      const data = await response.json();
      const resposta = data.message[0].resposta;
      setMessages((prevMessages) => [...prevMessages, { type: 'assistant', text: resposta }]);
      setAwaitingFeedback(true);
    }
  };

  const handleFeedback = (feedback) => {
    if (feedback === 'sim') {
      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: 'Obrigado! O chat foi encerrado.' }]);
      setAwaitingFeedback(false);
      setIsHumanSupport(false);
    } else {
      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: 'Transferindo para um atendente humano...' }]);
      setAwaitingFeedback(false);
      setIsHumanSupport(true);
    }
  };

  return (
    <div>
      <button className="chat-button" onClick={handleOpen}>Abrir Chat</button>
      {open && (
        <div className="chat-modal">
          <div className="chat-modal-header">
            <h2>Chat de Atendimento</h2>
            <button className="close-button" onClick={handleClose}>X</button>
          </div>
          <div className="chat-modal-content">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </div>
            {awaitingFeedback ? (
              <FeedbackButtons handleFeedback={handleFeedback} />
            ) : (
              <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSendMessage={handleSendMessage}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
