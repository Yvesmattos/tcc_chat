const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('suporte', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
