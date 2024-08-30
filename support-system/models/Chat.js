const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
  clientMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supportResponse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Chat;
