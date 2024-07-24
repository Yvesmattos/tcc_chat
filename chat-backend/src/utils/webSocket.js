// src/utils/webSocket.js
const WebSocket = require('ws');

const initializeWebSocket = (server) => {
  if (!server) {
    throw new Error('O servidor deve ser passado para a função initializeWebSocket');
  }

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      // Broadcast da mensagem para todos os clientes conectados, exceto o remetente
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => { });
  });
};

module.exports = { initializeWebSocket };
