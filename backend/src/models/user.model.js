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
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER, // User ID who created the record
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER, // User ID who updated the record
      allowNull: true
    }
  }, {
    tableName: 'master_user',
    timestamps: true,  // This will automatically manage created_at and updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  MasterUser.associate = (models) => {
    MasterUser.belongsTo(models.MasterPosition, {
      foreignKey: 'position_id',
      as: 'position'
    });
    // Add associations for created_by and updated_by to users table
    MasterUser.belongsTo(models.User, { // Assuming you have a `User` model
      foreignKey: 'created_by',
      as: 'creator'
    });
    MasterUser.belongsTo(models.User, { // Same for updated_by
      foreignKey: 'updated_by',
      as: 'updater'
    });
  };

  return MasterUser;
};
