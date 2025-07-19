const db = require('../models');
const User = db.MasterUser;
const Position = db.MasterPosition;

exports.getAllUsers = async () => {
  return User.findAll({
    include: [{ model: Position, as: 'position' }],
  });
};

exports.getUserById = async (userId) => {
  return User.findOne({
    where: { id: userId },
    include: [{ model: Position, as: 'position' }],
  });
};

exports.createUser = async (name, email, hashedPassword, position_id, phone_number, profile_picture) => {
  return User.create({
    name,
    email,
    password: hashedPassword,
    position_id,
    phone_number,
    profile_picture,
    created_by: 1,
    updated_by: 1,
    created_at: new Date(),
    updated_at: new Date(),
  });
};

exports.updateUser = async (id, payload) => {
  return User.update(payload, { where: { id } });
};

exports.deleteUser = async (id) => {
  return User.destroy({ where: { id } });
};

exports.updatePassword = async (id, hashedPassword) => {
  return User.update({ password: hashedPassword }, { where: { id } });
};
