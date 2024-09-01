// src/components/SupportDashboard.js
import React, { useState, useRef, useEffect } from 'react';
import useWebSocket from '../WebSocketHandler';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';
import './SupportDashboard.css';
import '../ChatMessage.css'

const SupportDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });
  const { sendMessage } = useWebSocket(true, setMessages);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Aqui você deve substituir com a lógica real de autenticação
    if (loginDetails.username === 'support' && loginDetails.password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Credenciais inválidas!');
    }
  };

  const handleSendMessage = () => {
    let mensagem = [message => inputValue, type => 'message']
    sendMessage(mensagem);
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: inputValue }]);
    setInputValue('');
  };

  return (
    <div className="support-modal-overlay">
      <div className="support-modal">
        {!isLoggedIn ? (
          <div className="login-form">
            <h2>Login do Suporte</h2>
            <form onSubmit={handleLoginSubmit}>
              <label>
                Usuário:
                <input
                  type="text"
                  name="username"
                  value={loginDetails.username}
                  onChange={handleLoginChange}
                  required
                />
              </label>
              <label>
                Senha:
                <input
                  type="password"
                  name="password"
                  value={loginDetails.password}
                  onChange={handleLoginChange}
                  required
                />
              </label>
              <button type="submit">Entrar</button>
            </form>
          </div>
        ) : (
          <>
            <h2>Suporte Dashboard</h2>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;
