// src/components/WebSocketHandler.js
import { useEffect, useRef } from 'react';

const useWebSocket = (isHumanSupport, setMessages, setIsHumanSupport) => {
  const ws = useRef(null);

  useEffect(() => {
    if (isHumanSupport) {
      ws.current = new WebSocket('ws://localhost:5001');

      ws.current.onopen = () => {};

      ws.current.onmessage = (event) => {
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
        setIsHumanSupport(false);  // Atualiza o estado ao fechar a conexão
      };
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [isHumanSupport, setMessages, setIsHumanSupport]);

  const sendMessage = (message) => {
    if (ws.current) {
      ws.current.send(message);
    }
  };

  return { sendMessage };
};

export default useWebSocket;
