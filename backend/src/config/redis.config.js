require('dotenv').config();  
const Redis = require('ioredis');

// Redis connection setup
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',  
  port: process.env.REDIS_PORT || 6379,       
  password: process.env.REDIS_PASSWORD || null, 
  db: process.env.REDIS_DB || 0,               
  retryStrategy(times) {
    return Math.min(times * 50, 2000); 
  },
});

// Log the connection status for debugging
redis.ping((err, result) => {
  if (err) {
    console.error('Redis connection failed:', err);
  } else {
    console.log('Redis connected successfully:', result); // Should print "PONG"
  }
});

// Export the Redis client so it can be used elsewhere
module.exports = redis;
