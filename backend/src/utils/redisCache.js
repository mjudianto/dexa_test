const redis = require('../config/redis.config');

// Utility function to get data from Redis cache
const getFromCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;  // Parse JSON data if available in cache
  } catch (err) {
    console.error('Error fetching data from Redis:', err);
    return null;
  }
};

// Utility function to set data to Redis cache
const setToCache = async (key, data, ttl = 3600) => { 
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);  // Store in Redis with TTL
  } catch (err) {
    console.error('Error setting data to Redis:', err);
  }
};

module.exports = {
  getFromCache,
  setToCache,
};
