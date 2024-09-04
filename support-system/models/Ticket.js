const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  client_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resp_support: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  timeopened: {
    type: DataTypes.DATE, // Usando DATE para timestamps
    defaultValue: DataTypes.NOW
  },
  timeclosed: {
    type: DataTypes.DATE, // Usando DATE para timestamps
    allowNull: true
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Campo opcional
    references: {
      model: 'Chats', // Nome da tabela de chats
      key: 'id'
    }
  }
}, {
  timestamps: false
});

Ticket.associate = function (models) {
  // Define a associação entre Ticket e Chat
  Ticket.belongsTo(models.Chat, { foreignKey: 'chatId' });
};

module.exports = Ticket;
