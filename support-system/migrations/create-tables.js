const sequelize = require('../config/database');
// const Message = require('../models/Message');
const User = require('../models/User');
// const Chat = require('../models/Chat');
// const Ticket = require('../models/Ticket');
// node migrations/create-tables.js
async function createTables() {
  try {
    await sequelize.sync({ force: true });
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

createTables();
