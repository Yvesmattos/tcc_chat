const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {}; // Armazena clientes por chatId
let support = null;

wss.on('connection', (ws) => {
  console.log('Nova conexão estabelecida');

  // Identificar usuário
  const identifyUser = (data) => {
    if (data.userType === 'support') {
      if (support === null) {
        support = ws;
        console.log('Suporte conectado');
      } else {
        console.log('Suporte já está conectado, fechando nova conexão.');
        ws.close(4000, 'Suporte já está conectado');
      }
    } else if (data.userType === 'client') {
      const chatId = data.chatId;
      if (!clients[chatId]) {
        clients[chatId] = ws;
        console.log(`Cliente conectado ao chat ${chatId}`);
      } else {
        console.log(`Cliente já está conectado a este chat ${chatId}, fechando nova conexão.`);
        ws.close(4001, 'Cliente já está conectado a este chat');
      }
    }
  };

  // Processar mensagens
  const processMessage = (data) => {
    if (data.type === 'message') {
      if (support) {
        // Enviar a mensagem do cliente para o suporte
        support.send(JSON.stringify({
          chatId: data.chatId,
          sender: 'client',
          message: data.message
        }));
      } else {
        console.log('Suporte não está disponível');
      }
    } else if (data.type === 'support_response') {
      // Responder ao cliente apropriado
      const client = clients[data.chatId];
      if (client) {
        client.send(JSON.stringify({
          chatId: data.chatId,
          sender: 'support',
          message: data.message
        }));
      } else {
        console.log(`Cliente não encontrado para o chat ${data.chatId}`);
      }
    }
  };

  ws.on('message', (message) => {
    console.log(`Recebido: ${message}`);
    try {
      const data = JSON.parse(message);
      if (data.type === 'identify') {
        identifyUser(data);
      } else {
        processMessage(data);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      ws.close(4002, 'Erro ao processar mensagem');
    }
  });

  ws.on('close', () => {
    // Remover o cliente desconectado
    for (const chatId in clients) {
      if (clients[chatId] === ws) {
        delete clients[chatId];
        console.log(`Cliente desconectado do chat ${chatId}`);
        break;
      }
    }

    // Verificar se o suporte foi desconectado
    if (support === ws) {
      support = null;
      console.log('Suporte desconectado');
    }
  });
});

// Inicie o servidor
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor WebSocket escutando na porta ${port}`);
});
