require('dotenv').config();
const db = require('../models');
const User = db.MasterUser;
const Position = db.MasterPosition;
const { getFromCache, setToCache } = require('../utils/redisCache');  // Import Redis cache functions
const redis = require('../config/redis.config');

exports.getAllUsers = async () => {
  const cacheKey = 'allUsers';  // Cache key for all users
  
  // First, check if users are in Redis cache
  const cachedUsers = await getFromCache(cacheKey);
  if (cachedUsers) return cachedUsers;
  
  // If not in cache, fetch from the database
  const users = await User.findAll({
    include: [{ model: Position, as: 'position' }],
  });

  // Store the result in Redis cache for future requests
  await setToCache(cacheKey, users);
  return users;
};

exports.getUserById = async (userId) => {
  const cacheKey = `user:${userId}`;  // Unique cache key for each user
  
  // First, check if user data is in Redis cache
  const cachedUser = await getFromCache(cacheKey);
  if (cachedUser) return cachedUser;
  
  // If not in cache, fetch from the database
  const user = await User.findOne({
    where: { id: userId },
    include: [{ model: Position, as: 'position' }],
  });

  if (user) await setToCache(cacheKey, user);
  return user;
};

exports.createUser = async (name, email, hashedPassword, position_id, phone_number, profile_picture) => {
  const user = await User.create({
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

  // Clear the cached data for users so that the cache is refreshed
  await redis.del('allUsers');
  return user;
};

exports.updateUser = async (id, payload) => {
  const updatedUser = await User.update(payload, { where: { id } });
  
  // Clear the cached user and all users list so that they are refreshed
  await redis.del(`user:${id}`);
  await redis.del('allUsers');
  
  return updatedUser;
};

exports.deleteUser = async (id) => {
  const deletedUser = await User.destroy({ where: { id } });
  
  // Clear the cached data for users
  await redis.del(`user:${id}`);
  await redis.del('allUsers');
  
  return deletedUser;
};

exports.updatePassword = async (id, hashedPassword) => {
  const updatedPassword = await User.update({ password: hashedPassword }, { where: { id } });
  
  await redis.del(`user:${id}`);
  return updatedPassword;
};
