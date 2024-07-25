const axios = require('axios');
const WebSocket = require('ws');

let suporteWs;

const sendQuestion = async (req, res) => {
  try {
    const { pergunta } = req.body;

    const response = await axios.post(process.env.IA_API_URL, { pergunta });

    const resposta = response.data;

    if (resposta === 'A resposta foi suficiente? (responda com "sim" ou "não")') {
      // Se a resposta for insatisfatória, inicie o suporte WebSocket
      if (!suporteWs) {
        suporteWs = new WebSocket('ws://localhost:5001');
        suporteWs.on('open', () => {});
        suporteWs.on('message', (message) => {}); // Adicione lógica para enviar uma resposta ao cliente
      }
    }

    res.json({
      type: 'assistente',
      message: resposta,
      question: 'A resposta foi suficiente? (responda com "sim" ou "não")'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao se comunicar com a API da IA' });
  }
};

module.exports = { sendQuestion };
