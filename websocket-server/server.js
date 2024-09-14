const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};
let supports = {};
let chatAssignments = {}; // Armazena qual suporte está vinculado a qual chat

// Função para identificar o suporte ou cliente conectado
const identifyUser = (ws, data) => {
  if (data.userType === 'support') {
    if (!supports[data.support_id]) {
      supports[data.support_id] = ws;
      console.log(`Suporte ${data.support_id} conectado`);
    }
  } else if (data.userType === 'client') {
    if (!clients[data.chatId]) {
      clients[data.chatId] = ws;
      console.log(`Cliente ${data.chatId} conectado ao chat`);
    } else {
      console.log(`Cliente ${data.chatId} já está conectado a este chat, fechando nova conexão.`);
      ws.close(4001, 'Cliente já está conectado a este chat');
    }
  }
};

// Função para processar mensagens recebidas
const processMessage = (data) => {
  if (data.type === 'client_message') {
    // Verifica se existe um suporte atribuído ao chat
    let support = chatAssignments[data.chatId];
    if (support && supports[support]) {
      supports[support].send(JSON.stringify({
        chatId: data.chatId,
        sender: 'client',
        message: data.message,
        clientIdentify: data.clientIdentify,
      }));
    } else {
      console.log('Nenhum suporte atribuído ao chat, enviando para todos os suportes.');
      Object.values(supports).forEach((support) => {
        support.send(JSON.stringify({
          chatId: data.chatId,
          sender: 'client',
          message: data.message,
          clientIdentify: data.clientIdentify,
        }));
      });
    }
  } else if (data.type === 'support_message') {
    // Envia a resposta para o cliente apropriado
    const client = clients[data.chatId];
    if (client) {
      client.send(JSON.stringify({
        chatId: data.chatId,
        sender: 'support',
        message: data.message,
      }));
    } else {
      console.log(`Cliente não encontrado para o chat ${data.chatId}`);
    }
  }
};

// Função para atribuir um chat a um suporte específico
const takeAttendance = (data) => {
  const { chatId, support_id } = data;
  if (!chatAssignments[chatId]) {
    chatAssignments[chatId] = support_id;
    console.log(`Chat ${chatId} atribuído ao suporte ${support_id}`);

    // Envia uma confirmação para o suporte que assumiu o chat
    supports[support_id].send(JSON.stringify({
      chatId,
      message: `Você agora está atendendo o chat ${chatId}.`,
      type: 'attendance_confirmed',
      support_id, // Envia o ID do suporte que assumiu o chat
    }));

    // Envia uma mensagem para todos os outros suportes para removerem o chat da lista de pendentes
    Object.entries(supports).forEach(([otherSupportId, supportWs]) => {
      if (otherSupportId !== support_id) {
        supportWs.send(JSON.stringify({
          chatId,
          message: `O chat ${chatId} foi assumido por outro suporte.`,
          type: 'remove_pending_chat',
        }));
      }
    });

  } else {
    console.log(`Chat ${chatId} já está sendo atendido pelo suporte ${chatAssignments[chatId]}`);
  }
};

// Evento de conexão do WebSocket
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'identify') {
        identifyUser(ws, data);
      } else if (data.type === 'take_attendance') {
        takeAttendance(data); // Tratar a atribuição do chat a um suporte específico
      } else {
        processMessage(data);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      ws.close(4002, 'Erro ao processar mensagem');
    }
  });

  ws.on('close', () => {
    // Remover o cliente ou suporte desconectado
    Object.keys(clients).forEach(chatId => {
      if (clients[chatId] === ws) {
        delete clients[chatId];
        console.log(`Cliente desconectado do chat ${chatId}`);
      }
    });

    Object.keys(supports).forEach(supportId => {
      if (supports[supportId] === ws) {
        delete supports[supportId];
        console.log(`Suporte ${supportId} desconectado`);
      }
    });
  });
});

// Iniciar o servidor
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor WebSocket escutando na porta ${port}`);
});
