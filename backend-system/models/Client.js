module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Organizations', // Nome da tabela Organization
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });

  Client.associate = function (models) {
    Client.hasMany(models.Chat, { foreignKey: 'client_id' });
    Client.belongsTo(models.Organization, { foreignKey: 'organization_id' });
  };

  return Client;
};
