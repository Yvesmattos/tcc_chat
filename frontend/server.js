const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuração para servir arquivos estáticos
app.use(express.static(__dirname + '/public'));

// Configurações e uso do Socket.io aqui

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor Socket.io rodando na porta ${PORT}`);
});
