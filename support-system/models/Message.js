const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT, // Utilizado para armazenar o conteúdo da mensagem
    allowNull: false
  },
  sender: {
    type: DataTypes.ENUM('client', 'support'),
    allowNull: false
  },
  sender_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timesend: {
    type: DataTypes.DATE, // Usando DATE para timestamps
    defaultValue: DataTypes.NOW
  },
  chat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Chats', // Nome da tabela de chats
      key: 'id'
    }
  }
}, {
  timestamps: false
});

Message.associate = function (models) {
  // Define a associação entre Message e Chat
  Message.belongsTo(models.Chat, { foreignKey: 'chat_id' });
};

module.exports = Message;
