import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import FeedbackButtons from './FeedbackButtons';
import CircularProgress from '@mui/material/CircularProgress';
import './ChatModal.css';
import IdentificationForm from './Identification/IdentifiationChatModal';

const ChatModal = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const [isHumanSupport, setIsHumanSupport] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [clientData, setClientData] = useState({ name: "", email: "", telephone: "" })
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Bom dia!' : currentHour < 18 ? 'Boa tarde!' : 'Boa noite!';
    return `${greeting}<br/>Eu sou sua IAtendente, e estou aqui para te IAjudar. Digite em apenas uma frase o que você precisa.`;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const connectWebSocket = (chatIdAux) => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    // Identificar como cliente ao conectar usando o chatId
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'identify', userType: 'client', clientData, chatId: chatIdAux }));
    };

    // Quando uma mensagem é recebida do WebSocket
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.sender === 'support') {
        setMessages((prevMessages) => [...prevMessages, { type: 'assistant', text: data.message }]);
      }
    };

    // Fechar a conexão WebSocket quando o componente for desmontado ou quando o suporte é encerrado
    socket.onclose = () => {
      setWs(null);
    };
  };

  const handleSendMessage = async () => {
    if (isHumanSupport) {
      setMessages((prevMessages) => [...prevMessages, { type: 'user', text: inputValue }]);
      setInputValue('');
      if (ws) {
        ws.send(JSON.stringify({ type: 'client_message', message: inputValue, clientIdentify: clientData.email, chatId }));
      }
    } else {
      const newMessage = { type: 'user', text: inputValue };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue('');
      setLoading(true); // Set loading to true when sending a message

      // Simulação de resposta (API desativada no momento)
      // const response = await fetch('http://127.0.0.1:8085/chat/send_question', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ pergunta: inputValue })
      // });

      // const data = await response.json();
      // const resposta = data[0].resposta;

      // setMessages((prevMessages) => [...prevMessages, { type: 'assistant', text: resposta }]);
      setLoading(false); // Set loading to false when response is received
      setAwaitingFeedback(true);
    }
  };

  const handleFeedback = async (feedback) => {
    if (feedback === 'sim') {
      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: 'Obrigado! O chat foi encerrado.' }]);
      setAwaitingFeedback(false);
      setIsHumanSupport(false);
    } else {
      const response = await fetch(`http://localhost:5000/api/support/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ clientIdentify: clientData.email }) // Envia o chatId único
      });

      const data = await response.json();
      setChatId(data.id)

      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: 'Transferindo para um atendente humano...' }]);
      setAwaitingFeedback(false);
      setIsHumanSupport(true);

      // Iniciar a conexão com o WebSocket somente agora
      connectWebSocket(data.id);
    }
  };

  const handleFormSubmit = (data) => {
    const updatedClientData = {
      ...clientData,
      name: data.nome,
      email: data.email,
      telephone: data.fone,
    };

    setClientData(updatedClientData); // Atualiza o estado com o novo objeto
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'system', text: `Informações recebidas: <br>Nome - ${data.nome}, <br>Email - ${data.email}, <br>Telefone - ${data.fone}` },
      { type: 'system', text: getGreeting(), isHtml: true }
    ]);
    setIsFormSubmitted(true);
  };

  return (
    <div>
      <button className="chat-button" onClick={handleOpen}>
        <img src="/logo_iai.png" alt="Logo" className="logo-image" width={40} height={40} />
        <span>IAtendente</span>
      </button>
      {open && (
        <div className="chat-modal">
          <div className="chat-modal-header">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img src="/logo_iai.png" alt="Logo" className="logo-image" width={60} height={60} style={{ margin: "auto" }} />
              <h2 style={{ color: "white", fontWeight: 'bold' }}>IAtendente</h2>
            </div>
            <button className="close-button" onClick={handleClose}><span title='Minimizar' style={{ fontWeight: 900 }}>_</span></button>
          </div>
          <div className="chat-modal-content">
            <div className="chat-messages" style={{ transition: "all 0.5s ease" }}>
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            {isFormSubmitted ? (
              awaitingFeedback ? (
                <FeedbackButtons handleFeedback={handleFeedback} />
              ) : (
                <>
                  {loading && (
                    <div className="loading-spinner">
                      <CircularProgress />
                    </div>
                  )}
                  <ChatInput
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleSendMessage={handleSendMessage}
                    loading={loading} // Pass loading state to ChatInput
                  />
                </>
              )
            ) : (
              <IdentificationForm onSubmit={handleFormSubmit} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
