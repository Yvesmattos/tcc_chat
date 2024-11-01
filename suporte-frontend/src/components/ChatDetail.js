import React from 'react';
import ResponseArea from './ResponseArea';

const ChatDetail = ({
  selectedChat,
  response,
  setResponse,
  handleRespond,
  handleMarkAsResolved,
  startChat,
  handleTicket
}) => {
  return (
    <div className="chat-detail">
      <h2>{selectedChat.id}</h2>
      <div className="messages">
        {selectedChat.messages?.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <ResponseArea
        response={response}
        setResponse={setResponse}
        handleRespond={handleRespond}
        status={selectedChat.status}
        handleMarkAsResolved={handleMarkAsResolved}
        handleTicket={handleTicket}
      />
      {selectedChat.status === 0 && (
        <>
          <button onClick={startChat}>Iniciar atendimento</button>
        </>
      )}
    </div>
  );
};

export default ChatDetail;
