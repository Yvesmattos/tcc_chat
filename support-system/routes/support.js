const express = require('express');
const Chat = require('../models/Chat');
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
    chat.supportResponse = response;
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
      const chats = await Chat.findAll({ resolved: true }); // Ajuste conforme seu modelo
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
