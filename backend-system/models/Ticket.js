module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chats', // Nome da tabela Chat
        key: 'id'
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    time_opened: {
      type: DataTypes.DATE, // Usando DATE para timestamps
      defaultValue: DataTypes.NOW
    },
    time_closed: {
      type: DataTypes.DATE, // Usando DATE para timestamps
      allowNull: true
    },
  }, {
    timestamps: false
  });

  Ticket.associate = function (models) {
    // Define a associação entre Ticket e Chat
    Ticket.belongsTo(models.Chat, { foreignKey: 'chat_id' });
  };

  return Ticket;
};
