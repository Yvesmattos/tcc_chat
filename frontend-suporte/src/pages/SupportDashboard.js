import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import './SupportDashboard.css';
import Header from '../components/Header';
import ChatDetail from '../components/ChatDetail';
import ChatList from '../components/ChatList';



const SupportDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [pendingChats, setPendingChats] = useState([]);
  const [onGoingChats, setOnGoingChats] = useState([]);
  const [resolvedChats, setResolvedChats] = useState([]);
  const [response, setResponse] = useState('');
  const [messageQueue, setMessageQueue] = useState([]);
  const socketRef = useRef(null);

  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  setInterval(() => {
    // alert('e')
    forceUpdate();
  }, 1000);

  // Função para inicializar o WebSocket
  const initializeWebSocket = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(process.env.REACT_APP_API_URL_WS);

      socketRef.current.onopen = () => {
        console.log('connected');
        const support_id = localStorage.getItem('userid');
        socketRef.current.send(
          JSON.stringify({ type: 'identify', userType: 'support', support_id })
        );
      };
    }
  }, []);

  // useEffect para estabelecer a conexão WebSocket
  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [initializeWebSocket]);

  // Enviar mensagens da fila para o backend periodicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      if (messageQueue.length > 0) {
        try {
          await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/support/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(messageQueue),
          });

          // Limpar a fila após o envio bem-sucedido
          setMessageQueue([]);
        } catch (error) {
          console.error('Erro ao enviar mensagens para o backend:', error);
        }
      }
    }, 2000); // Enviar a cada 10 segundos

    return () => clearInterval(interval);
  }, [messageQueue]);

  const handleWebSocketMessage = useCallback((event) => {
    const { sender, message, chatId, type, support_id } = JSON.parse(event.data);

    if (type === 'attendance_confirmed') {
      const currentSupportId = localStorage.getItem('userid'); // Suporte atual

      if (support_id !== currentSupportId) {
        // Remover o chat da lista de pendentes se foi assumido por outro suporte
        setPendingChats((prevChats) => prevChats.filter((chat) => chat.chatId !== chatId));
        console.log(`Chat ${chatId} foi assumido por outro suporte.`);
      }
    } else if (type === 'remove_pending_chat') {
      // Remover o chat da lista de pendentes para todos os suportes
      setPendingChats((prevChats) => prevChats.filter((chat) => chat.chatId !== chatId));
      console.log(`Chat ${chatId} removido da lista de pendentes para este suporte.`);
    } else {
      console.log(event)
      const newMessage = { sender, message, timesend: new Date().toISOString().slice(0, 19).replace('T', ' '), chat_id: chatId };

      // Adiciona a mensagem à fila
      setMessageQueue((prevQueue) => [...prevQueue, newMessage]);

      const updateChatList = (prevChats) => {
        const chatIndex = prevChats.findIndex((chat) => chat.chatId === chatId);

        //adicionando mensagem em chat que já existe na lista
        if (chatIndex !== -1) {
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            messages: [...updatedChats[chatIndex].messages, newMessage],
          };
          return updatedChats;
        }
        return prevChats;
      };

      let updatedPending = updateChatList(pendingChats);
      let updatedOngoing = updateChatList(onGoingChats);

      if (updatedPending === pendingChats) {
        if (updatedOngoing === onGoingChats) {
          updatedPending = [
            ...pendingChats,
            { messages: [newMessage], status: 0, chatId },
          ];
        }
        setOnGoingChats(updatedOngoing);
      }

      setPendingChats(updatedPending);

      if (selectedChat && chatId === selectedChat.chatId) {
        setSelectedChat((prevChat) =>
          prevChat ? { ...prevChat, messages: [...prevChat.messages, newMessage] } : null
        );
      }
    }
  }, [pendingChats, onGoingChats, selectedChat]);


  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.onmessage = handleWebSocketMessage;
    }
  }, [handleWebSocketMessage]);

  // Função para buscar os chats do servidor
  const fetchChats = useCallback(async (status) => {
    const support_id = localStorage.getItem('userid');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/support/chats?status=${status}&support_id=${support_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar chats com status ${status}:`, error);
      return [];
    }
  }, []);

  // Função para buscar todos os chats
  const fetchAllChats = useCallback(async () => {
    const [pending, ongoing, resolved] = await Promise.all([
      fetchChats(0),
      fetchChats(1),
      fetchChats(2),
    ]);

    setPendingChats(pending);
    setOnGoingChats(ongoing);
    setResolvedChats(resolved);
  }, [fetchChats]);

  useEffect(() => {
    fetchAllChats();
  }, [fetchAllChats]);

  // Demais funções relacionadas ao chat
  const handleRespond = async () => {
    if (selectedChat && response.trim() !== '') {
      const messageData = {
        message: response,
        sender: 'support',
        timesend: "2024-09-01 17:16:59", // ajustar
        chat_id: selectedChat.chatId,
      };

      try {
        // Adiciona a mensagem à fila
        setMessageQueue((prevQueue) => [...prevQueue, messageData]);

        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({
            chatId: selectedChat.chatId,
            sender: 'support',
            message: response,
            type: 'support_message',
          }));
        }

        setPendingChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === selectedChat.chatId
              ? { ...chat, messages: [...chat.messages, { sender: 'support', message: response }] }
              : chat
          )
        );

        setSelectedChat((prevChat) => prevChat ? {
          ...prevChat,
          messages: [...prevChat.messages, { sender: 'support', message: response }],
        } : null);

        setResponse('');
      } catch (error) {
        console.error('Erro ao responder chat:', error);
      }
    }
  };

  const handleMarkAsResolved = async () => {
    if (selectedChat) {
      const support_id = localStorage.getItem('userid');
  
      try {
        // Primeiro envia a mensagem de encerramento
        const closeMessage = {
          message: "Este chat foi encerrado",
          sender: 'support',
          timesend: new Date().toISOString().slice(0, 19).replace('T', ' '),
          chat_id: selectedChat.chatId,
        };
  
        // Adiciona a mensagem à fila
        setMessageQueue((prevQueue) => [...prevQueue, closeMessage]);
  
        // Envia via WebSocket para atualização em tempo real
        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({
            chatId: selectedChat.chatId,
            sender: 'support',
            message: "Este chat foi encerrado",
            type: 'support_message',
          }));
        }
  
        // Atualiza o status do chat no backend
        await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/support/updatestatuschat/${selectedChat.chatId}?status=2&support_id=${support_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ response: 'Chat marcado como resolvido' }),
        });
  
        // Atualiza os estados locais
        setPendingChats((prevChats) => prevChats.filter((chat) => chat.chatId !== selectedChat.chatId));
        setOnGoingChats((prevChats) => prevChats.filter((chat) => chat.chatId !== selectedChat.chatId));
        setResolvedChats((prevChats) => [...prevChats, { 
          ...selectedChat, 
          status: 2,
          messages: [...selectedChat.messages, closeMessage] // Adiciona a mensagem de encerramento
        }]);
  
        // Atualiza o chat selecionado para mostrar a mensagem de encerramento
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, closeMessage],
          status: 2
        } : null);
        
        setResponse('');
      } catch (error) {
        console.error('Erro ao marcar chat como resolvido:', error);
      }
    }
  };

  const startChat = async () => {
    if (selectedChat) {
      const support_id = localStorage.getItem('userid');

      try {
        await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/support/updatestatuschat/${selectedChat.chatId}?status=1&support_id=${support_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ response: 'Chat iniciado' }),
        });

        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({
            chatId: selectedChat.chatId,
            sender: 'support',
            type: 'take_attendance',
            support_id
          }));
        }

        setPendingChats((prevChats) => prevChats.filter((chat) => chat.chatId !== selectedChat.chatId));
        setOnGoingChats((prevChats) => [...prevChats, { ...selectedChat, status: 1 }]);

        setSelectedChat(null);
        setResponse('');
      } catch (error) {
        console.error('Erro ao iniciar chat:', error);
      }
    }
  };

  const handleLogout = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getChatMessages = async (chat) => {
    chat.chatId = chat.id > 0 ? chat.id : chat.chatId
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/support/chats/${chat.chatId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const messages = await response.json();
      setSelectedChat({ ...chat, messages });
    } catch (error) {
      console.error('Erro ao buscar mensagens do chat:', error);
    }
  };

  const handleTicket = async (e) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/support/tickets/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ subject: e.subject, chat_id: selectedChat.chatId }),
      });

      console.log(response)
    } catch (error) {
      console.error('Erro ao marcar chat como resolvido:', error);
    }
  }

  return (
    <div className="dashboard-container">
      <Header handleLogout={handleLogout} />
      <div className="main-content">
        <ChatList
          onGoingChats={onGoingChats}
          pendingChats={pendingChats}
          resolvedChats={resolvedChats}
          setSelectedChat={setSelectedChat}
          getChatMessages={getChatMessages}
        />
        {selectedChat && (
          <ChatDetail
            selectedChat={selectedChat}
            response={response}
            setResponse={setResponse}
            handleRespond={handleRespond}
            handleMarkAsResolved={handleMarkAsResolved}
            startChat={startChat}
            handleTicket={handleTicket}
          />
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;
