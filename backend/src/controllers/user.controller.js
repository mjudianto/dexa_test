const db = require('../models');
const User = db.MasterUser;
const Position = db.MasterPosition; 
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

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

    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const payload = {
      ...req.body,
      updated_by: req.user.id,       // assumes authMiddleware sets req.user
      updated_at: new Date()         // current timestamp
    };

    if (req.file) {
      payload.profile_picture = req.file.filename;

      const oldFilename = existingUser.profile_picture;

      if (oldFilename) {
        const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting old file:', err);
          }
        });
      }
    }

    const [updated] = await User.update(payload, { where: { id } });

    if (updated) {
      const updatedUser = await User.findByPk(id);
      return res.json(updatedUser);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
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

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(400).json({ message: "Current password is incorrect" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashed }, { where: { id } });

  res.json({ message: "Password updated successfully" });
};

