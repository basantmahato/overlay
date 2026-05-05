const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const overlayRoutes = require('./routes/overlayRoutes');
const templateRoutes = require('./routes/templateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://overlay.footimes.com', 'https://overlay.footimes.com','https://www.footimes.com', 'https://app.footimes.com'],
  credentials: true,
}));
app.use(express.json());

// API Versioning (v1)
const API_V1_PREFIX = '/api/v1';

app.use(`${API_V1_PREFIX}/auth`, authRoutes);
app.use(`${API_V1_PREFIX}/overlays`, overlayRoutes);
app.use(`${API_V1_PREFIX}/templates`, templateRoutes);
app.use(`${API_V1_PREFIX}/admin`, adminRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Overlay API v1 is running...');
});

// Error Handling
app.use(errorHandler);

module.exports = app;
