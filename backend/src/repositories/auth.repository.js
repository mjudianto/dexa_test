require('dotenv').config();
const db = require('../models');
const User = db.MasterUser;
const Position = db.MasterPosition;
const { getFromCache, setToCache } = require('../utils/redisCache');  // Import Redis cache functions

exports.findUserByEmail = async (email) => {
  const cacheKey = `userByEmail:${email}`;
  const cachedUser = await getFromCache(cacheKey);

  console.log(cachedUser);
  if (cachedUser) return cachedUser;
  
  const user = await User.findOne({ where: { email } });
  if (user) await setToCache(cacheKey, user);
  
  return user;
};

exports.findUserWithPositionByEmail = async (email) => {
  const cacheKey = `userWithPositionByEmail:${email}`;
  const cachedUser = await getFromCache(cacheKey);
  if (cachedUser) return cachedUser;
  
  const user = await User.findOne({
    where: { email },
    include: [{ model: Position, as: 'position' }]
  });
  if (user) await setToCache(cacheKey, user);
  
  return user;
};
