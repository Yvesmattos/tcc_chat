import React, { useState } from 'react';
import TicketModal from './TicketModal';


const ResponseArea = ({
  response,
  setResponse,
  handleRespond,
  status,
  handleMarkAsResolved,
  handleTicket
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="response-area">
      {status !== 0 && status !== 2 && (
        <>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Digite sua resposta..."
          />
          <button onClick={handleRespond}>Responder</button>
          <button onClick={handleMarkAsResolved}>Marcar como Resolvido</button>
        </>
      )}
      {status === 2 && (
        <>
          <button onClick={() => setModalOpen(!modalOpen)}>Abrir ticket</button>
        </>
      )}
      {modalOpen && (<TicketModal handleTicket={handleTicket} setModalOpen={setModalOpen} isOpen={modalOpen} />)}
    </div>
  );
};

export default ResponseArea;
