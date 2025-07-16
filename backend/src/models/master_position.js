const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MasterPosition = sequelize.define('MasterPosition', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    division: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'master_position',
    timestamps: false
  });

  MasterPosition.associate = (models) => {
    MasterPosition.hasMany(models.MasterUser, {
      foreignKey: 'position_id',
      as: 'users'
    });
  };

  return MasterPosition;
};
