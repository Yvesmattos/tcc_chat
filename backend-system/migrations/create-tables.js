const sequelize = require('../config/database');
// const Organization = require('../models/Organization');
// const Support = require('../models/Support');
// const Client = require('../models/Client');
// const Chat = require('../models/Chat');
// const Message = require('../models/Message');
// const Ticket = require('../models/Ticket');
const { Chat, Client, Message, Organization, Support, Ticket } = require('../models');

// node migrations/create-tables.js

async function createTables() {
  try {
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

createTables();
