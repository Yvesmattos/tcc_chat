module.exports = (sequelize, DataTypes) => {
  const Support = sequelize.define('Support', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255), // Define o tamanho máximo da string
      allowNull: false,
    },
  }, {
    timestamps: false
  });

  Support.associate = function (models) {
    // Define a associação entre Support e Chat
    Support.hasMany(models.Chat, { foreignKey: 'support_id' });
  };

  return Support;
};
