const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const supportRoutes = require('./routes/support');
const sequelize = require('./config/database'); // Importa a configuração do Sequelize

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Conexão com o MySQL
sequelize.authenticate()
  .then(() => console.log('Conectado ao MySQL'))
  .catch(err => console.error('Erro ao conectar ao MySQL:', err));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/support', supportRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
