const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Importando o pacote cors
const chatRoutes = require('./src/routes/chatRoutes');
const { initializeWebSocket } = require('./src/utils/webSocket');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

// Configurar CORS para permitir todas as origens ou ajustar conforme necessário
app.use(cors({
  origin: '*', // Permitir todas as origens (substitua por uma lista específica de origens se necessário)
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use('/chat', chatRoutes);

const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Passe o servidor para a função initializeWebSocket
initializeWebSocket(server);
