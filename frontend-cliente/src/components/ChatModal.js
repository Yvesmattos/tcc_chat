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
  const [clientData, setClientData] = useState({ fullname: "", email: "", telephone: "", organization_id: null })
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
    const socket = new WebSocket('wss://ws_chat.serveo.net');
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
      const newMessage = { type: 'user', text: inputValue };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem('chatHistory', JSON.stringify(updatedMessages)); // Salva no localStorage
        return updatedMessages;
      });
  
      setInputValue('');
  
      if (ws) {
        ws.send(JSON.stringify({ type: 'client_message', message: inputValue, clientIdentify: clientData.email, chatId }));
      }
    } else {
      const newMessage = { type: 'user', text: inputValue };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem('chatHistory', JSON.stringify(updatedMessages)); // Salva no localStorage
        return updatedMessages;
      });
  
      setInputValue('');
      setLoading(true);
  
      // Simulação de resposta
      const response = await fetch('https://py_ia_backend.serveo.net/chat/send_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pergunta: inputValue })
      });
  
      const data = await response.json();
      const resposta = data[0].resposta;
  
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { type: 'assistant', text: resposta }];
        localStorage.setItem('chatHistory', JSON.stringify(updatedMessages)); // Salva no localStorage com a resposta
        return updatedMessages;
      });
  
      setLoading(false);
      setAwaitingFeedback(true);
    }
  };

  const handleFeedback = async (feedback) => {
    if (feedback === 'sim') {
      setMessages((prevMessages) => [...prevMessages, { type: 'system', text: 'Obrigado! O chat foi encerrado.' }]);
      setAwaitingFeedback(false);
      setIsHumanSupport(false);
    } else {
      const response1 = await fetch(`https://node_backend.serveo.net/api/client/orgs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: document.location.hostname, clientData }) // Ajustar para pegar o pathname
      });

      const data1 = await response1.json();

      if (data1.id) {
        const response2 = await fetch(`https://node_backend.serveo.net/api/support/chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ client_id: data1.id }) // Envia o chatId único
        });

        const data2 = await response2.json();
        setChatId(data2.id)

        setMessages((prevMessages) => [...prevMessages, { type: 'system', text: 'Transferindo para um atendente humano...' }]);
        setAwaitingFeedback(false);
        setIsHumanSupport(true);

        // Iniciar a conexão com o WebSocket somente agora
        connectWebSocket(data2.id);
      }
    }
  };

  const handleFormSubmit = (data) => {
    console.log(data)
    const updatedClientData = {
      ...clientData,
      fullname: data.name,
      email: data.email,
      telephone: data.fone,
    };

    setClientData(updatedClientData); // Atualiza o estado com o novo objeto
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'system', text: `Informações recebidas: <br>Nome - ${data.name}, <br>Email - ${data.email}, <br>Telefone - ${data.fone}` },
      { type: 'system', text: getGreeting(), isHtml: true }
    ]);
    setIsFormSubmitted(true);
  };

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatHistory');

    if (storedMessages) {
      setIsFormSubmitted(true)
      const parsedMessages = JSON.parse(storedMessages); // Converte para array de mensagens
      setMessages((prevMessages) => [...prevMessages, ...parsedMessages]); // Adiciona as mensagens ao estado
    }
  }, []); // Executa apenas uma vez quando o componente é montado

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
