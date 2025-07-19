const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const path = require('path');
const app = express();
const Redis = require('ioredis');  // Import Redis

// Redis connection setup
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',  // Use environment variables for flexibility
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,  // Optionally set if Redis is password-protected
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/attendance', attendanceRoutes);

// Sample Redis test to check connection
redis.ping((err, result) => {
  if (err) {
    console.error('Redis connection failed:', err);
  } else {
    console.log('Redis connected:', result);  // Should print "PONG"
  }
});

module.exports = app;
