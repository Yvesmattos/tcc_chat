module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Clients', // Nome da tabela Client
        key: 'id'
      }
    },
    support_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Supports', // Nome da tabela Support
        key: 'id'
      }
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    time_started: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    time_ended: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: false
  });

  Chat.associate = function (models) {
    // Definindo associações
    Chat.hasMany(models.Message, { foreignKey: 'chat_id' });
    Chat.hasOne(models.Ticket, { foreignKey: 'chat_id' });
    Chat.belongsTo(models.Support, { foreignKey: 'support_id' });
    Chat.belongsTo(models.Client, { foreignKey: 'client_id' });
  };

  return Chat;
};
