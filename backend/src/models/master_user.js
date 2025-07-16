const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MasterUser = sequelize.define('MasterUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    position_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'master_user',
    timestamps: false
  });

  MasterUser.associate = (models) => {
    MasterUser.belongsTo(models.MasterPosition, {
      foreignKey: 'position_id',
      as: 'position'
    });
  };

  return MasterUser;
};
