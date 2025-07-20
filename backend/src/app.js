const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const path = require('path');
const app = express();
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const redisClient = require('./config/redisClient.config');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/attendance', attendanceRoutes);

const server = createServer(app);
const wss = new WebSocketServer({ server });

const CHANNEL = 'message-stream';

// Create a duplicate of your client specifically for subscribing
const subscriber = redisClient.duplicate();

(async () => {
  await subscriber.connect();

  // Subscribe to the Redis channel
  await subscriber.subscribe(CHANNEL, (message) => {
    console.log(`Received message from Redis channel '${CHANNEL}': ${message}`);

    // When a message is received, send it to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  });
})();

wss.on('connection', (ws) => {
  console.log('React client connected for message stream.');
  ws.on('close', () => {
    console.log('React client disconnected.');
  });
});

// An API endpoint to PUBLISH a message to the Redis channel
app.post('/api/stream', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send('Message is required.');
  }

  try {
    // Use your main client to publish
    await redisClient.publish(CHANNEL, message);
    res.status(200).send('Message published to stream.');
  } catch (err) {
    res.status(500).send('Failed to publish message.');
  }
});

module.exports = server;
