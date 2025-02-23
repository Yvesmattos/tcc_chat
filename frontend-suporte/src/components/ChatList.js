import React, { useState } from 'react';

const ChatList = ({ onGoingChats, pendingChats, resolvedChats, setSelectedChat, getChatMessages }) => {
  // Estados para controlar a visibilidade dos dropdowns
  const [isStartedOpen, setIsStartedOpen] = useState(false);
  const [isPendingOpen, setIsPendingOpen] = useState(false);
  const [isResolvedOpen, setIsResolvedOpen] = useState(false);

  // Funções para alternar a visibilidade dos dropdowns
  const toggleStartedChats = () => setIsStartedOpen(!isStartedOpen);
  const togglePendingChats = () => setIsPendingOpen(!isPendingOpen);
  const toggleResolvedChats = () => setIsResolvedOpen(!isResolvedOpen);

  return (
    <div className="chat-list">

      {/* Dropdown para Chats Pendentes */}
      <div className="dropdown-container">
        <h2 onClick={togglePendingChats} className="dropdown-title">
          Chats Pendentes {isPendingOpen ? '▲' : '▼'}
        </h2>
        {isPendingOpen && (
          <ul className="dropdown-list">
            {pendingChats.map((chat, index) => (
              <li
                key={index}
                className="chat-item chat-pending"
                onClick={() => { setSelectedChat(chat); getChatMessages(chat) }}
              >
                {/* {chat.id > 0 ? chat.id : chat.chatId} */}
                Atendimento - {chat.id > 0 ? chat.id : chat.chatId}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dropdown para Chats em andamento */}
      <div className="dropdown-container">
        <h2 onClick={toggleStartedChats} className="dropdown-title">
          Chats em andamento {isStartedOpen ? '▲' : '▼'}
        </h2>
        {isStartedOpen && (
          <ul className="dropdown-list">
            {onGoingChats.map((chat, index) => (console.log(chat),
              <li
                key={index}
                className="chat-item chat-started"
                onClick={() => { setSelectedChat(chat); getChatMessages(chat) }}
              >
                {/* {chat.id > 0 ? chat.id : chat.chatId} - {chat.client_id} */}
                Atendimento - {chat.id > 0 ? chat.id : chat.chatId}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dropdown para Chats Finalizados */}
      <div className="dropdown-container">
        <h2 onClick={toggleResolvedChats} className="dropdown-title">
          Chats Finalizados {isResolvedOpen ? '▲' : '▼'}
        </h2>
        {isResolvedOpen && (
          <ul className="dropdown-list">
            {resolvedChats.map((chat, index) => (
              <li
                key={index}
                className="chat-item chat-resolved"
                onClick={() => { setSelectedChat(chat); getChatMessages(chat) }}
              >
                {/* {chat.id > 0 ? chat.id : chat.chatId} - {chat.client_id} */}
                Atendimento - {chat.id > 0 ? chat.id : chat.chatId}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;
