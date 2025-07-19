const db = require('../models');
const User = db.MasterUser;
const Position = db.MasterPosition;

exports.findUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

exports.findUserWithPositionByEmail = async (email) => {
  return User.findOne({
    where: { email },
    include: [{
      model: Position,
      as: 'position'
    }]
  });
};
