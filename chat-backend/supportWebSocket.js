// supportWebSocket.js
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5001');

ws.onopen = () => {
  console.log('Conectado ao WebSocket para atendimento humano');
  console.log('Digite suas mensagens para o cliente abaixo:');
};

ws.onmessage = (event) => {
  console.log('Mensagem recebida do cliente:', event.data);
};

ws.onerror = (error) => {
  console.error('Erro no WebSocket:', error);
};

ws.onclose = () => {
  console.log('Desconectado do WebSocket');
};

// Função para enviar mensagens para o cliente
const sendMessageToClient = (message) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  }
};

// Enviar uma mensagem inicial para o cliente
sendMessageToClient('Olá, como posso ajudar?');

// Interação via prompt
process.stdin.on('data', (data) => {
  const message = data.toString().trim();
  sendMessageToClient(message);
});
