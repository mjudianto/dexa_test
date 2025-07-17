module.exports = (sequelize, DataTypes) => {
  const MasterAttendance = sequelize.define(
    "MasterAttendance", 
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      check_in: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      check_out: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "master_attendance",
      timestamps: false, // Disable automatic timestamps if you are manually managing them
    }
  );

  // Define association with MasterUser
  MasterAttendance.associate = (models) => {
    MasterAttendance.belongsTo(models.MasterUser, {
      foreignKey: "user_id",
      as: "user", 
    });
  };

  return MasterAttendance;
};
