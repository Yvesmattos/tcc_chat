const WebSocket = require('ws');

const initializeWebSocket = (server) => {
  if (!server) {
    throw new Error('O servidor deve ser passado para a função initializeWebSocket');
  }

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Cliente conectado via WebSocket');

    ws.on('message', (message) => {
      console.log(`Mensagem recebida: ${message}`);
      // Adicione lógica para encaminhar a mensagem para o suporte humano ou responder ao cliente
    });

    ws.on('close', () => {
      console.log('Cliente desconectado via WebSocket');
    });
  });
};

module.exports = { initializeWebSocket };
