const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
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
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  timestarted: {
    type: DataTypes.DATE, // Usando DATE para timestamps
    defaultValue: DataTypes.NOW
  },
  timeended: {
    type: DataTypes.DATE, // Usando DATE para timestamps
    allowNull: true
  }
}, {
  timestamps: false
});

Chat.associate = function (models) {
  // Define as associações
  Chat.hasMany(models.Message, { foreignKey: 'chatId' });
  Chat.hasOne(models.Ticket, { foreignKey: 'chatId' });
};

module.exports = Chat;
