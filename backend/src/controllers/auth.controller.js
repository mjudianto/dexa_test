const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const { where } = require('sequelize');
const User = db.MasterUser;
const Position = db.MasterPosition; 

const JWT_SECRET = 'f5c2cbc8fcb33f0f17f8f930f03a92a3';

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET,                        
      { expiresIn: '1h' }               
    );

    // Return the token and user ID
    res.status(200).json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email: email },
      include: [{
        model: Position,
        as: 'position'
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.position.division != "HR") {
      return res.status(404).json({ message: "Please use admin account" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET,                        
      { expiresIn: '1h' }               
    );

    // Return the token and user ID
    res.status(200).json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
