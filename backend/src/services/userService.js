const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

exports.getAllUsers = async () => {
  try {
    return await userRepository.getAllUsers();
  } catch (err) {
    throw new Error('Error fetching users');
  }
};

exports.getUserById = async (userId) => {
  try {
    return await userRepository.getUserById(userId);
  } catch (err) {
    throw new Error('Error fetching user');
  }
};

exports.createUser = async (name, email, password, position_id, phone_number, profile_picture) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepository.createUser(name, email, hashedPassword, position_id, phone_number, profile_picture);
  } catch (err) {
    throw new Error('Error creating user');
  }
};

exports.updateUser = async (id, payload, file, userId) => {
  try {
    const existingUser = await userRepository.getUserById(id);
    if (!existingUser) {
      return null;
    }

    // Prepare payload for update
    const updatedPayload = {
      ...payload,
      updated_by: userId,
      updated_at: new Date(),
    };

    if (file) {
      updatedPayload.profile_picture = file.filename;
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

    // Update the user
    const updatedUser = await userRepository.updateUser(id, updatedPayload);

    // Send push notification
    // const message = {
    //   notification: {
    //     title: 'Profile Updated',
    //     body: `User ${updatedUser.name} has updated their profile.`,
    //   },
    //   topic: 'admin_notifications',
    // };
    // await admin.messaging().send(message);

    return updatedUser;
  } catch (err) {
    throw new Error('Error updating user');
  }
};

exports.deleteUser = async (id) => {
  try {
    return await userRepository.deleteUser(id);
  } catch (err) {
    throw new Error('Error deleting user');
  }
};

exports.updatePassword = async (id, currentPassword, newPassword) => {
  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      throw new Error("Current password is incorrect");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(id, hashed);
  } catch (err) {
    throw new Error('Error updating password');
  }
};
