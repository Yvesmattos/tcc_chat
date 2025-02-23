const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const supportRoutes = require('./routes/supportRoute');
const clientRoutes = require('./routes/clientRoute');
const db = require('./models'); // Importa a configuração dos modelos

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Conexão com o MySQL
db.sequelize.authenticate()
  .then(() => console.log('Conectado ao MySQL'))
  .catch(err => console.error('Erro ao conectar ao MySQL:', err));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/client', clientRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
