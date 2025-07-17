const db = require('../models');
const User = db.MasterUser;
const Position = db.MasterPosition; 
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Position,
        as: 'position'
      }]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.params.id; 

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [{
        model: Position,
        as: 'position'
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Return the found user
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createUser = async (req, res) => {
  const { name, email, password, position_id, phone_number, profile_picture } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
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

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await User.update(req.body, { where: { id } });
    if (updated) {
      res.json({ message: "User updated" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
