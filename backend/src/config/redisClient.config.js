// src/redisClient.js
const { createClient } = require('redis');

// Create a client
const client = createClient({
});

// Set up an error listener to catch connection problems
client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis. We use an IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis successfully!');
  } catch (err) {
    console.error('Could not connect to Redis:', err);
  }
})();

module.exports = client;