const sequelize = require('../config/database');
const User = require('../models/User');
const Chat = require('../models/Chat');

async function createTables() {
  try {
    await sequelize.sync({ force: true });
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

createTables();
