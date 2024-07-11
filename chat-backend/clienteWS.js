const WebSocket = require('ws');

const clienteWs = new WebSocket('ws://localhost:5001');

clienteWs.on('open', () => {
  console.log('Cliente conectado ao WebSocket');
  clienteWs.send('Olá, suporte!');
});

clienteWs.on('message', (message) => {
  console.log(`Mensagem recebida do suporte: ${message}`);
});

clienteWs.on('error', (error) => {
  console.error('Erro no WebSocket do cliente:', error);
});

clienteWs.on('close', () => {
  console.log('Cliente desconectado do WebSocket');
});
