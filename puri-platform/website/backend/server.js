const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Puri Auth API URL
const PURI_AUTH_API = process.env.PURI_AUTH_API || 'http://puri-auth-backend:5000';
const SERVICE_SECRET = process.env.SERVICE_SECRET || 'puri-service-secret';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Make Puri Auth API URL available to routes
app.locals.puriAuthAPI = PURI_AUTH_API;
app.locals.serviceSecret = SERVICE_SECRET;

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Website Backend running on port ${PORT}`);
});

