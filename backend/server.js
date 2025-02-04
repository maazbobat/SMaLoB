require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { authenticate } = require('./middleware/authMiddleware');
const http = require('http');
const setupWebSocket = require('./WebSocket');

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);
setupWebSocket(server);


// Middleware
app.use(cors({
  origin: process.env.BASE_URL,
  credentials: true,
  exposedHeaders: ['X-CSRF-Token']
}));
app.use(express.json());
app.use(cookieParser());

// In your Express server (middleware)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from API' });
});

// Protected Test Route
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});