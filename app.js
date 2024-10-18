const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config(); // To load environment variables from .env

const { swaggerUi, swaggerDocs } = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware setup
app.use(helmet()); // Security Middleware
app.use(cors()); // Enable Cors
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Logging

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Sample route
app.get('/', (req, res) => {
    res.status(200).json({ 'message': 'Welcome to the Task Manager API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// 404 Handle for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ 'message': 'Route not found' });
});

// Global Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;