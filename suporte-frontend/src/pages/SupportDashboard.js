import React, { useState, useEffect } from 'react';
import './SupportDashboard.css';

function SupportDashboard() {
  const [chats, setChats] = useState([]);
  const [resolvedChats, setResolvedChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [response, setResponse] = useState('');
  const [ws, setWs] = useState(null);
  const [supportId] = useState(`support-${Date.now()}`); // Gerar um ID único para o suporte

  useEffect(() => {
    // Conectar ao WebSocket
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'identify', userType: 'support', supportId }));
    };

    socket.onmessage = (event) => {
      const { chatId, sender, message } = JSON.parse(event.data);
      const newMessage = { sender, text: message };

      // Atualizar lista de chats pendentes
      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex((chat) => chat.id === chatId);
        if (chatIndex !== -1) {
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            messages: [...updatedChats[chatIndex].messages, newMessage]
          };
          return updatedChats;
        } else {
          return [...prevChats, { id: chatId, messages: [newMessage], resolved: false }];
        }
      });

      // Atualizar mensagens do chat selecionado
      if (selectedChat && chatId === selectedChat.id) {
        setSelectedChat((prevChat) => prevChat ? {
          ...prevChat,
          messages: [...prevChat.messages, newMessage]
        } : null);
      }
    };

    // Fechar a conexão WebSocket quando o componente for desmontado
    return () => {
      socket.close();
    };
  }, [selectedChat, supportId]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch('http://localhost:5000/api/support/chats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      }
    }

    async function fetchResolvedChats() {
      try {
        const response = await fetch('http://localhost:5000/api/support/resolved-chats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setResolvedChats(data);
      } catch (error) {
        console.error('Erro ao buscar chats respondidos:', error);
      }
    }

    fetchChats();
    fetchResolvedChats();
  }, []);

  const handleRespond = async () => {
    if (selectedChat && response.trim() !== '') {
      try {
        await fetch(`http://localhost:5000/api/support/respond/${selectedChat.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ response })
        });

        // Enviar a resposta para o WebSocket
        if (ws) {
          ws.send(JSON.stringify({
            chatId: selectedChat.id,
            sender: 'support',
            message: response,
            type: "support_response"
          }));
        }

        // Atualizar a lista de chats
        setChats((prevChats) =>
          prevChats.map(chat =>
            chat.id === selectedChat.id
              ? { ...chat, messages: [...chat.messages, { sender: 'support', text: response }] }
              : chat
          )
        );

        // Atualizar o chat selecionado
        if (selectedChat) {
          setSelectedChat((prevChat) => ({
            ...prevChat,
            messages: [...prevChat.messages, { sender: 'support', text: response }]
          }));
        }

        // Limpar o campo de resposta
        setResponse('');
      } catch (error) {
        console.error('Erro ao responder chat:', error);
      }
    }
  };

  const handleMarkAsResolved = async () => {
    if (selectedChat) {
      try {
        // Marcar o chat como resolvido na API
        await fetch(`http://localhost:5000/api/support/resolve-chat/${selectedChat.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Atualizar a lista de chats e adicionar à lista de chats resolvidos
        setChats((prevChats) =>
          prevChats.filter(chat => chat.id !== selectedChat.id)
        );
        setResolvedChats((prevChats) => [
          ...prevChats,
          { ...selectedChat, resolved: true }
        ]);

        // Desmarcar o chat selecionado e limpar o campo de resposta
        setSelectedChat(null);
        setResponse('');
      } catch (error) {
        console.error('Erro ao marcar chat como resolvido:', error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="chat-list">
        <h1>Dashboard de Suporte</h1>
        <h2>Chats Pendentes</h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="chat-item"
              onClick={() => setSelectedChat(chat)}
            >
              Chat {chat.id}
            </li>
          ))}
        </ul>
        <h2>Chats Respondidos</h2>
        <ul>
          {resolvedChats.map((chat) => (
            <li
              key={chat.id}
              className="chat-item"
            >
              Chat {chat.id}
            </li>
          ))}
        </ul>
      </div>
      {selectedChat && (
        <div className="chat-detail">
          <h2>Chat {selectedChat.id}</h2>
          <div className="messages">
            {selectedChat.messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="response-area">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Digite sua resposta"
            />
            <button onClick={handleRespond}>Responder</button>
            <button onClick={handleMarkAsResolved}>
              Marcar como Respondido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportDashboard;