const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.json({ message: "Dexa backend is running." });
});

module.exports = app;
