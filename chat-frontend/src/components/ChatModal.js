// src/components/ChatModal.js
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './ChatModal.css';

const ChatModal = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const [isHumanSupport, setIsHumanSupport] = useState(false);
  const ws = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendMessage = async () => {
    if (isHumanSupport) {
      // Enviar mensagem para o WebSocket
      if (ws.current) {
        ws.current.send(inputValue);
        setMessages((prevMessages) => [...prevMessages, { type: 'user', text: inputValue }]);
        setInputValue('');
      }
    } else {
      // Enviar mensagem para a API de IA
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
      const resposta = data.message[0].resposta; // Acessar apenas a propriedade `resposta`
      setMessages((prevMessages) => [...prevMessages, { type: 'assistant', text: resposta }]);
      setAwaitingFeedback(true);
    }
  };

  const handleFeedback = (feedback) => {
    if (feedback === 'sim') {
      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: 'Obrigado! O chat foi encerrado.' }]);
      setAwaitingFeedback(false);
      setIsHumanSupport(false);  // Encerrar suporte humano
    } else {
      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: 'Transferindo para um atendente humano...' }]);
      setAwaitingFeedback(false);
      setIsHumanSupport(true);

      // Conectar ao WebSocket para atendimento humano
      ws.current = new WebSocket('ws://localhost:5001');

      ws.current.onopen = () => {
        console.log('Conectado ao WebSocket para atendimento humano');
      };

      ws.current.onmessage = async (event) => {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          setMessages((prevMessages) => [...prevMessages, { type: 'assistant', text }]);
        };
        reader.readAsText(event.data);
      };

      ws.current.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
      };

      ws.current.onclose = () => {
        console.log('Desconectado do WebSocket');
        setIsHumanSupport(false);  // Atualiza o estado ao fechar a conexão
      };
    }
  };

  useEffect(() => {
    // Limpeza ao desmontar o componente
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

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
              <div className="feedback-buttons">
                <button onClick={() => handleFeedback('sim')}>Sim</button>
                <button onClick={() => handleFeedback('não')}>Não</button>
              </div>
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
