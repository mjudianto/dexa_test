const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/mysql.config.js"); // Corrected the config filename

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: false, 
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.MasterPosition = require("./position.model.js")(sequelize, DataTypes);
db.MasterUser = require("./user.model.js")(sequelize, DataTypes);
db.Attendance = require("./attendance.model.js")(sequelize, DataTypes);

// Associations
db.MasterUser.belongsTo(db.MasterPosition, {
  foreignKey: "position_id",
  as: "position",
});

db.Attendance.belongsTo(db.MasterUser, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = db;
