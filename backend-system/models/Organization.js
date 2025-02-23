module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define('Organization', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  
    Organization.associate = function (models) {
      Organization.hasMany(models.Client, { foreignKey: 'organization_id' });
    };
  
    return Organization;
  };
  