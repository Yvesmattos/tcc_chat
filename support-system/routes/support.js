const express = require('express');
const Chat = require('../models/Chat');
const Message = require('../models/Message'); // Importar o modelo de Message
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticação
router.use(authMiddleware);

// Listar atendimentos pendentes
router.get('/chats', async (req, res) => {
  try {
    const chats = await Chat.findAll({ where: { resolved: false } });
    res.json(chats);
  } catch (error) {
    res.status(500).send('Erro ao listar chats');
  }
});

// Responder atendimento
router.post('/respond/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const chat = await Chat.findByPk(id);
    if (!chat) {
      return res.status(404).send('Chat não encontrado');
    }
    chat.resolved = true;
    await chat.save();
    res.send('Resposta enviada com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao responder chat');
  }
});

// Rota para obter chats respondidos
router.get('/resolved-chats', async (req, res) => {
  try {
    const chats = await Chat.findAll({ where: { resolved: true } });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter mensagens de um chat específico
router.get('/chats/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.findAll({ where: { chat_id: id } });
    if (messages.length === 0) {
      return res.status(404).send('Nenhuma mensagem encontrada para este chat');
    }
    res.json(messages);
  } catch (error) {
    res.status(500).send('Erro ao listar mensagens');
  }
});

router.post('/chats', async (req, res) => {
  try {
    const { client_id } = req.body;
    let chat = new Chat()
    chat.client_id = "vel01"; //alterar
    chat.resolved = 0;
    chat.timestarted = '2024-09-01 14:16:59';
    console.log(chat)
    await chat.save();
    res.send('Chat iniciado');
  } catch (error) {
    res.status(500).send('Erro ao iniciar chat');
  }
});

module.exports = router;
