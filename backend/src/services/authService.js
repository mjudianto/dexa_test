const authRepository = require('../repositories/authRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'f5c2cbc8fcb33f0f17f8f930f03a92a3';

exports.login = async (email, password) => {
  try {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 400, error: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET,                        
      { expiresIn: '1h' }               
    );

    return { token, userId: user.id };
  } catch (err) {
    // console.log(err.error);
    throw err.error;
  }
};

exports.loginAdmin = async (email, password) => {
  try {
    const user = await authRepository.findUserWithPositionByEmail(email);

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    if (user.position.division !== 'HR') {
      throw { status: 404, message: 'Please use admin account' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 400, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET,                        
      { expiresIn: '1h' }               
    );

    return { token, userId: user.id };
  } catch (err) {
    throw err;
  }
};
