import React from 'react';

const ResponseArea = ({
  response,
  setResponse,
  handleRespond,
  status,
  handleMarkAsResolved,
}) => {
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
    </div>
  );
};

export default ResponseArea;
