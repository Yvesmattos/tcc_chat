const express = require('express');
const { Chat, Client, Message, Ticket } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticação
router.use(authMiddleware);

// Adiciona a mensagem à fila
const messageQueue = [];
insertMessages = async () => {
  if (messageQueue.length > 0) {
    const messagesToInsert = [...messageQueue];
    messageQueue.length = 0; // Limpa a fila

    try {
      // Mapear a fila de mensagens para um formato compatível com o Sequelize
      const values = messagesToInsert.map(msg => ({
        message: msg.message,
        sender: msg.sender,
        time_send: new Date(msg.timesend),
        chat_id: msg.chat_id,
      }));

      // Inserir as mensagens em massa no banco de dados
      await Message.bulkCreate(values);
    } catch (error) {
      console.error('Erro ao inserir mensagens:', error);
    }
  }
};


// Configura um intervalo para inserir mensagens a cada 5 segundos
setInterval(insertMessages, 2000);

// Nova rota para receber mensagens
router.post('/messages', async (req, res) => {
  try {
    const messages = req.body; // Assume que req.body é um array de mensagens
    if (Array.isArray(messages) && messages.every(msg => msg.message && msg.sender && msg.timesend && msg.chat_id)) {
      messageQueue.push(...messages); // Adiciona todas as mensagens na fila
      res.status(200).send('Mensagens recebidas');
    } else {
      res.status(400).send('Dados inválidos');
    }
  } catch (error) {
    res.status(500).send('Erro ao receber mensagens');
  }
});


// Resto do código da API...
// Atualizar status do chat
router.post('/updateStatusChat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, support_id } = req.query;

    const chat = await Chat.findByPk(id);
    if (!chat) {
      return res.status(404).send('Chat não encontrado');
    }
    chat.status = status;
    chat.support_id = support_id;

    await chat.save();
    res.send('Status atualizado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao responder chat');
  }
});

// Obter chats
router.get('/chats/', async (req, res) => {
  const { support_id, status } = req.query;

  let where = { status: 0 };

  if (status == 1 || status == 2) {
    where.status = status;
    where.support_id = support_id;
  }
  try {
    const chats = await Chat.findAll(
      {
        where,
        include: {
          model: Client,
          attributes: ["fullname"]
        }
      },);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter mensagens de um chat específico
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

// Iniciar chat
router.post('/chats', async (req, res) => {
  try {
    const { client_id } = req.body;

    let chat = new Chat();
    chat.client_id = client_id; //alterar
    chat.status = 0;
    const response = await chat.save();
    res.send({ id: response.dataValues.id });
  } catch (error) {
    res.status(500).send('Erro ao iniciar chat');
  }
});

// Cadastrar ticket
router.post('/tickets', async (req, res) => {
  try {
    const { subject, chat_id } = req.body;

    let chat = new Ticket();
    chat.resolved = 0;
    chat.subject = subject;
    chat.chat_id = chat_id;
    const response = await chat.save();
    res.send({ id: response.dataValues.id });
  } catch (error) {
    res.status(500).send('Erro ao iniciar chat');
  }
});

module.exports = router;
